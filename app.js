/* Gidex consulting · interacciones de la página */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CORREO = "gidex.consulting@gmail.com";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Año del copyright
  const anio = $("#anio"); if(anio) anio.textContent = new Date().getFullYear();

  // Cabecera sólida al bajar
  const cab = $("#cabecera"), alBajar = () => cab.classList.toggle("solida", scrollY > 30);
  addEventListener("scroll", alBajar, {passive: true}); alBajar();

  // Menú en celulares
  const hamb = $("#hamb"), menu = $("#menu");
  const cerrarMenu = () => { menu.classList.remove("abierto"); hamb.setAttribute("aria-expanded", "false"); hamb.setAttribute("aria-label", "Abrir menú"); };
  hamb.addEventListener("click", () => { const abre = !menu.classList.contains("abierto"); menu.classList.toggle("abierto", abre); hamb.setAttribute("aria-expanded", String(abre)); hamb.setAttribute("aria-label", abre ? "Cerrar menú" : "Abrir menú"); });
  $$("a", menu).forEach(a => a.addEventListener("click", cerrarMenu));
  addEventListener("keydown", e => { if(e.key === "Escape") cerrarMenu(); });

  // Aparición suave de los bloques al desplazarse
  const bloques = $$(".tarjeta, .serv, .caso, .pasos li, .mv-tar, .valores div, .miembro, .faq details, .diag, .form");
  if(!RM && "IntersectionObserver" in window){
    bloques.forEach(b => b.classList.add("revelar"));
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } }), {threshold: .12});
    bloques.forEach(b => io.observe(b));
  }

  // Contadores del panel de ejemplo
  $$("[data-cuenta]").forEach(el => { const fin = +el.dataset.cuenta; if(RM){ el.textContent = fin; return; }
    const t0 = performance.now(), paso = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(paso); }; requestAnimationFrame(paso); });

  // Botones que eligen el motivo del mensaje (por ejemplo, «Solicita una demostración»)
  // Motivo y mensaje que llegan desde otras páginas (por ejemplo, contacto.html?motivo=Testimonio)
  const fm = $("#form"), qs = new URLSearchParams(location.search);
  if(fm){ const mo = qs.get("motivo"), me = qs.get("mensaje"); const op = mo && [...fm.motivo.options].find(o => o.text === mo); if(op) fm.motivo.value = op.value; if(me) fm.mensaje.value = me; }

  // Diagnóstico rápido
  if($("#diag")) $("#diag").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.currentTarget, res = $("#diag-res"), r = [1, 2, 3, 4, 5, 6].map(i => f[`q${i}`].value);
    if(r.some(v => v === "")){ res.hidden = false; res.innerHTML = "<p>Responde las 6 preguntas para ver tu resultado.</p>"; return; }
    const n = r.reduce((s, v) => s + +v, 0), pct = Math.round(n / 6 * 100);
    const recs = [["q1", "ordenar tu información en una base de datos o sistema"], ["q2", "automatizar tus reportes"], ["q3", "enviar avisos automáticos por WhatsApp o correo"], ["q4", "crear un tablero de indicadores"], ["q5", "incorporar inteligencia artificial en tareas diarias"], ["q6", "documentar y sistematizar tus procesos"]]
      .filter(([k]) => f[k].value === "0").map(([, t]) => t);
    const nivel = pct >= 84 ? ["Organización avanzada", "Tienes una buena base digital. Podemos ayudarte a dar el siguiente paso con inteligencia artificial y analítica avanzada."]
      : pct >= 50 ? ["En camino", "Ya diste pasos importantes, pero aún hay tareas manuales que te quitan tiempo."]
      : ["Gran oportunidad de mejora", "Hay mucho tiempo que puedes ahorrar automatizando y ordenando tu información. ¡Es el mejor momento para empezar!"];
    res.hidden = false;
    res.innerHTML = `<h3>${nivel[0]} · ${pct} %</h3><div class="barra"><i style="width:0"></i></div><p>${nivel[1]}</p>${recs.length ? `<p><b>Te recomendamos empezar por:</b> ${recs.slice(0, 3).join("; ")}.</p>` : ""}<a class="btn btn-sol" id="diag-ir" href="contacto.html?${new URLSearchParams({motivo: "Diagnóstico gratuito", mensaje: `Hice el diagnóstico rápido en la web: ${pct} % (${nivel[0]}).${recs.length ? ` Me interesa ${recs[0]}.` : ""}`})}">Quiero mi diagnóstico gratuito</a>`;
    requestAnimationFrame(() => { $(".barra i", res).style.width = pct + "%"; });
  });

  // Formulario de contacto y comentarios: se envía al correo de Gidex consulting
  const form = $("#form"), estado = $("#estado"), btn = $("#enviar");
  if(!form) return;
  const avisar = (txt, tipo) => { estado.textContent = txt; estado.className = "estado " + (tipo || ""); };
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if(form._honey.value) return; // trampa para robots
    $$(".invalido", form).forEach(x => x.classList.remove("invalido"));
    const faltan = ["nombre", "correo", "mensaje"].filter(k => !form[k].value.trim() || (k === "correo" && !form[k].checkValidity()));
    faltan.forEach(k => form[k].classList.add("invalido"));
    if(faltan.length){ form[faltan[0]].focus(); return avisar(faltan.includes("correo") && form.correo.value ? "Revisa tu correo: parece que no está bien escrito." : "Completa tu nombre, correo y mensaje.", "error"); }
    if(!form.acepto.checked){ form.acepto.focus(); return avisar("Marca la casilla de aceptación para poder responderte.", "error"); }
    const datos = {nombre: form.nombre.value.trim(), correo: form.correo.value.trim(), celular: form.celular.value.trim(), organizacion: form.organizacion.value.trim(), motivo: form.motivo.value, mensaje: form.mensaje.value.trim()};
    btn.disabled = true; btn.textContent = "Enviando…"; avisar("");
    try{
      const r = await fetch(`https://formsubmit.co/ajax/${CORREO}`, {method: "POST", headers: {"Content-Type": "application/json", "Accept": "application/json"},
        body: JSON.stringify({...datos, _subject: `Web Gidex consulting · ${datos.motivo} · ${datos.nombre}`, _replyto: datos.correo, _template: "table", _captcha: "false"})});
      const j = await r.json().catch(() => ({}));
      if(!r.ok || String(j.success) === "false") throw new Error(j.message || "envío");
      form.reset(); avisar("¡Gracias! Tu mensaje fue enviado. Te responderemos pronto.", "ok");
    }catch(_){
      // Si el servicio de envío no responde, se abre el correo del visitante con el mensaje listo
      const cuerpo = `Nombre: ${datos.nombre}\nCorreo: ${datos.correo}\nCelular: ${datos.celular || "-"}\nOrganización: ${datos.organizacion || "-"}\nMotivo: ${datos.motivo}\n\n${datos.mensaje}`;
      location.href = `mailto:${CORREO}?subject=${encodeURIComponent("Web Gidex consulting · " + datos.motivo)}&body=${encodeURIComponent(cuerpo)}`;
      avisar("No pudimos enviarlo desde la página; se abrió tu correo con el mensaje listo para enviar.", "error");
    }finally{ btn.disabled = false; btn.textContent = "Enviar mensaje"; }
  });
})();
