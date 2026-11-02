/* Gidex consulting · ventanas, carrusel, agenda, WhatsApp, idioma, diagnóstico, formulario y estadísticas */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const CORREO = "gidex.consulting@gmail.com", WA = "51953859154";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Estadísticas de visitas =====
  // Para activarlas, pega aquí tu código. GoatCounter (gratis y sin cookies): el nombre de tu cuenta, por ejemplo "gidex".
  // Google Analytics 4: el ID de medición, por ejemplo "G-ABC123XYZ". Si ambos están vacíos, no se carga nada.
  const ANALITICA = {goatcounter: "gidexconsulting", ga4: ""};
  const cola = [];
  const gcListo = () => window.goatcounter && typeof window.goatcounter.count === "function";
  const gc = d => { if(!ANALITICA.goatcounter) return; if(gcListo()) window.goatcounter.count(d); else cola.push(d); };
  if(ANALITICA.goatcounter){
    window.goatcounter = {no_onload: true};
    const sc = document.createElement("script"); sc.async = true; sc.src = "https://gc.zgo.at/count.js";
    sc.dataset.goatcounter = `https://${ANALITICA.goatcounter}.goatcounter.com/count`;
    sc.onload = () => { while(cola.length && gcListo()) window.goatcounter.count(cola.shift()); };
    document.head.appendChild(sc);
  }
  if(ANALITICA.ga4){
    const sc = document.createElement("script"); sc.async = true; sc.src = "https://www.googletagmanager.com/gtag/js?id=" + ANALITICA.ga4; document.head.appendChild(sc);
    window.dataLayer = window.dataLayer || []; window.gtag = function(){ dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", ANALITICA.ga4, {send_page_view: false, anonymize_ip: true});
  }
  const medirVista = (id, titulo) => {
    gc({path: location.pathname + "#" + id, title: titulo});
    if(window.gtag && ANALITICA.ga4) gtag("event", "page_view", {page_title: titulo, page_location: location.href, page_path: location.pathname + "#" + id});
  };
  const medirEvento = (nombre, titulo) => {
    gc({path: nombre, title: titulo || nombre, event: true});
    if(window.gtag && ANALITICA.ga4) gtag("event", nombre);
  };

  // ===== Idioma =====
  const EN = window.GIDEX_EN || {};
  const L = () => document.documentElement.lang.startsWith("en");
  const T = (es, en) => L() ? en : es;
  const norm = t => t.replace(/\s+/g, " ").trim();
  const FRASE = new Set(["B", "I", "EM", "STRONG", "SMALL", "A", "BR", "SPAN", "SUP", "ABBR", "CODE"]);
  const SALTAR = new Set(["SCRIPT", "STYLE", "SVG", "TEXTAREA", "NOSCRIPT", "SELECT"]);
  const ATRS = ["aria-label", "title", "placeholder", "alt", "data-titulo", "data-grupo", "aria-roledescription"];
  const noTraducir = el => el.getAttribute && el.getAttribute("translate") === "no";
  let reg = null;
  const esUnidad = el => norm(el.textContent) && [...el.querySelectorAll("*")].every(x => FRASE.has(x.tagName) && !noTraducir(x));
  const recorrer = el => {
    if(SALTAR.has(el.tagName.toUpperCase()) || noTraducir(el) || (el.matches(".vista-nav") && !el.matches(".fija"))) return;
    if(el !== document.body && esUnidad(el)){ reg.u.push({el, es: el.innerHTML, k: norm(el.textContent)}); return; }
    el.childNodes.forEach(n => {
      if(n.nodeType === 3){ if(norm(n.nodeValue)) reg.t.push({n, es: n.nodeValue, k: norm(n.nodeValue)}); }
      else if(n.nodeType === 1) recorrer(n);
    });
  };
  const registrar = () => {
    reg = {u: [], t: [], a: []};
    recorrer(document.body);
    $$("option").forEach(o => { if(norm(o.textContent)) reg.u.push({el: o, es: o.innerHTML, k: norm(o.textContent)}); });
    $$("*").forEach(el => ATRS.forEach(a => { const v = el.getAttribute(a); if(v && norm(v)) reg.a.push({el, a, es: v, k: norm(v)}); }));
    const md = $('meta[name="description"]'); if(md) reg.a.push({el: md, a: "content", es: md.content, k: norm(md.content)});
  };
  const alCambiar = [];
  const ponerIdioma = (en, guardar) => {
    if(!reg) registrar();
    document.documentElement.lang = en ? "en" : "es-PE";
    reg.u.forEach(x => { x.el.innerHTML = en && EN[x.k] ? EN[x.k] : x.es; });
    reg.t.forEach(x => { const m = x.es.match(/^(\s*)[\s\S]*?(\s*)$/); x.n.nodeValue = en && EN[x.k] ? m[1] + EN[x.k] + m[2] : x.es; });
    reg.a.forEach(x => x.el.setAttribute(x.a, en && EN[x.k] ? EN[x.k] : x.es));
    const b = $("#idioma"); b.setAttribute("aria-label", en ? "Ver la página en español" : "View this page in English"); b.title = en ? "Español" : "English";
    if(guardar){ try{ localStorage.setItem("gx-idioma", en ? "en" : "es"); }catch(_){} medirEvento("idioma-" + (en ? "en" : "es")); }
    alCambiar.forEach(f => f());
  };

  // ===== Ventanas: se muestra una sola a la vez, según el #enlace =====
  const zona = $("#ventanas"), vistas = $$(".vista"), lateral = $("#lateral"), hamb = $("#hamb");
  const anio = $("#anio"); if(anio){ anio.textContent = new Date().getFullYear(); anio.setAttribute("translate", "no"); }
  ["#sup-titulo", "#sup-grupo", "#diag-res", "#estado", "#agenda-estado", "#agenda-ok", "#idioma"].forEach(s => { const e = $(s); if(e) e.setAttribute("translate", "no"); });
  $$("[data-cuenta]").forEach(e => e.setAttribute("translate", "no"));
  const cerrarMenu = () => { lateral.classList.remove("abierto"); hamb.setAttribute("aria-expanded", "false"); };
  hamb.addEventListener("click", () => { const a = !lateral.classList.contains("abierto"); lateral.classList.toggle("abierto", a); hamb.setAttribute("aria-expanded", String(a)); });
  $("#velo").addEventListener("click", cerrarMenu);
  addEventListener("keydown", e => { if(e.key === "Escape") cerrarMenu(); });

  // Botones «Anterior» y «Siguiente» según el orden del menú
  const orden = $$("#lat-nav a[data-v]").map(a => a.dataset.v);
  const construirNavs = () => {
    $$(".vista-nav:not(.fija)").forEach(n => n.remove());
    orden.forEach((id, i) => {
      const v = $("#v-" + id); if(!v) return;
      const enl = (dest, cls, txt) => { const d = $("#v-" + dest); return d ? `<a class="${cls}" href="#${dest}"><small>${txt}</small><b>${d.dataset.titulo}</b></a>` : ""; };
      const nav = document.createElement("nav"); nav.className = "vista-nav"; nav.setAttribute("aria-label", T("Cambiar de ventana", "Change window"));
      nav.innerHTML = (i > 0 ? enl(orden[i - 1], "ant", T("← Anterior", "← Previous")) : "") + (i < orden.length - 1 ? enl(orden[i + 1], "sig", T("Siguiente →", "Next →")) : "");
      v.appendChild(nav);
    });
  };

  let contados = false, actual = "inicio";
  const mostrar = (id, foco) => {
    const v = $("#v-" + id) || $("#v-inicio"), nombre = v.id.slice(2), padre = v.dataset.padre || nombre;
    const cambio = nombre !== actual;
    actual = nombre;
    vistas.forEach(x => { x.hidden = x !== v; if(cambio) x.classList.remove("entra"); });
    if(cambio && !RM){ void v.offsetWidth; v.classList.add("entra"); }
    $$("#lat-nav a").forEach(a => { if(a.dataset.v === padre) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    $("#sup-titulo").textContent = v.dataset.titulo; $("#sup-grupo").textContent = v.dataset.grupo;
    document.title = (nombre === "inicio" ? "" : v.dataset.titulo + " · ") + "Gidex consulting";
    actualizarWA();
    if(foco === undefined) return;
    zona.scrollTop = 0; cerrarMenu();
    if(foco) zona.focus({preventScroll: true});
    if(nombre === "inicio" && !contados){ contados = true; contar(); }
    medirVista(nombre, v.dataset.titulo);
  };
  const ruta = () => (location.hash || "#inicio").slice(1);
  addEventListener("hashchange", () => mostrar(ruta(), true));

  // Contadores del panel de ejemplo
  function contar(){ $$("[data-cuenta]").forEach(el => { const fin = +el.dataset.cuenta; if(RM){ el.textContent = fin; return; }
    const t0 = performance.now(), paso = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(paso); }; requestAnimationFrame(paso); }); }

  // ===== WhatsApp flotante: el mensaje cambia según la ventana =====
  const MSJ = {
    inicio: ["quisiera información sobre sus servicios", "I would like information about your services"],
    servicios: ["me interesan sus servicios de automatización, sistemas e inteligencia artificial", "I am interested in your automation, systems and AI services"],
    precios: ["quisiera una cotización", "I would like a quote"],
    algarrobo: ["quisiera una demostración de Algarrobo para mi colegio", "I would like a demo of Algarrobo for my school"],
    agenda: ["quisiera agendar una reunión", "I would like to schedule a meeting"],
    diagnostico: ["hice el diagnóstico rápido y quisiera conversar", "I took the quick assessment and would like to talk"],
    equipo: ["quisiera conversar con el equipo", "I would like to talk with the team"],
    recursos: ["leí sus artículos y quisiera más información", "I read your articles and would like more information"],
    contacto: ["quisiera información", "I would like some information"]
  };
  const waUrl = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  function actualizarWA(){
    const v = $("#v-" + actual), clave = (v && v.dataset.padre) || actual, m = MSJ[clave] || MSJ.inicio;
    $("#wa-flot").href = waUrl(T(`Hola Gidex consulting, ${m[0]}.`, `Hello Gidex consulting, ${m[1]}.`));
  }
  try{ if(!sessionStorage.getItem("gx-wa")){ setTimeout(() => { const w = $("#wa-flot"); w.classList.add("avisa"); setTimeout(() => w.classList.remove("avisa"), 5000); try{ sessionStorage.setItem("gx-wa", "1"); }catch(_){} }, 7000); } }catch(_){}
  document.addEventListener("click", e => { const a = e.target.closest('a[href*="wa.me/"]'); if(a) medirEvento("clic-whatsapp", "WhatsApp"); });

  // ===== Formulario: motivo y mensaje que vienen de otros botones o enlaces =====
  const form = $("#form");
  const ponerMotivo = (mo, me) => { if(!form) return; const op = mo && [...form.motivo.options].find(o => o.value === mo); if(op) form.motivo.value = op.value; if(me && !form.mensaje.value) form.mensaje.value = me; };
  const qs = new URLSearchParams(location.search); ponerMotivo(qs.get("motivo"), qs.get("mensaje"));
  document.addEventListener("click", e => { const a = e.target.closest("[data-motivo]"); if(a){ ponerMotivo(a.dataset.motivo, a.dataset.mensaje && T(a.dataset.mensaje, EN[norm(a.dataset.mensaje)] || a.dataset.mensaje)); medirEvento("clic-" + a.dataset.motivo.toLowerCase().replace(/[^a-z0-9]+/g, "-")); } });

  // ===== Diagnóstico rápido =====
  const diag = $("#diag");
  if(diag) diag.addEventListener("submit", e => {
    e.preventDefault();
    const f = e.currentTarget, res = $("#diag-res"), r = [1, 2, 3, 4, 5, 6].map(i => f[`q${i}`].value);
    if(r.some(v => v === "")){ res.hidden = false; res.innerHTML = `<p>${T("Responde las 6 preguntas para ver tu resultado.", "Answer the 6 questions to see your result.")}</p>`; return; }
    const pct = Math.round(r.reduce((s, v) => s + +v, 0) / 6 * 100);
    const RECS = [["q1", "ordenar tu información en una base de datos o sistema", "organizing your information in a database or system"], ["q2", "automatizar tus reportes", "automating your reports"], ["q3", "enviar avisos automáticos por WhatsApp o correo", "sending automatic WhatsApp or email notifications"], ["q4", "crear un tablero de indicadores", "building a KPI dashboard"], ["q5", "incorporar inteligencia artificial en tareas diarias", "bringing artificial intelligence into daily tasks"], ["q6", "documentar y sistematizar tus procesos", "documenting and systematizing your processes"]];
    const recs = RECS.filter(([k]) => f[k].value === "0").map(x => L() ? x[2] : x[1]);
    const nivel = pct >= 84 ? [T("Organización avanzada", "Advanced organization"), T("Tienes una buena base digital. Podemos ayudarte a dar el siguiente paso con inteligencia artificial y analítica avanzada.", "You have a solid digital foundation. We can help you take the next step with artificial intelligence and advanced analytics.")]
      : pct >= 50 ? [T("En camino", "On the way"), T("Ya diste pasos importantes, pero aún hay tareas manuales que te quitan tiempo.", "You have taken important steps, but manual tasks are still costing you time.")]
      : [T("Gran oportunidad de mejora", "Great room for improvement"), T("Hay mucho tiempo que puedes ahorrar automatizando y ordenando tu información. ¡Es el mejor momento para empezar!", "You can save a lot of time by automating and organizing your information. It is the perfect time to start!")];
    const msj = T(`Hice el diagnóstico rápido en la web: ${pct} % (${nivel[0]}).${recs.length ? ` Me interesa ${recs[0]}.` : ""}`, `I took the quick assessment on the website: ${pct}% (${nivel[0]}).${recs.length ? ` I am interested in ${recs[0]}.` : ""}`);
    res.hidden = false;
    res.innerHTML = `<h3>${nivel[0]} · ${pct} %</h3><div class="barra"><i style="width:0"></i></div><p>${nivel[1]}</p>${recs.length ? `<p><b>${T("Te recomendamos empezar por:", "We recommend starting with:")}</b> ${recs.slice(0, 3).join("; ")}.</p>` : ""}<a class="btn btn-sol" href="#contacto" data-motivo="Diagnóstico gratuito">${T("Quiero mi diagnóstico gratuito", "I want my free assessment")}</a>`;
    $("[data-motivo]", res).dataset.mensaje = msj;
    requestAnimationFrame(() => { $(".barra i", res).style.width = pct + "%"; });
    medirEvento("diagnostico-" + pct, T("Diagnóstico", "Assessment"));
  });

  // ===== Envío de formularios al correo de Gidex consulting =====
  // Web3Forms (rápido): pega aquí la clave de acceso que llega a gidex.consulting@gmail.com al registrarse en web3forms.com.
  // Mientras esté vacía se usa FormSubmit.
  const WEB3FORMS_CLAVE = "";
  const enviarCorreo = async (datos, asunto) => {
    const ctl = new AbortController(), reloj = setTimeout(() => ctl.abort(), 25000);
    try{
      const [url, cuerpo] = WEB3FORMS_CLAVE
        ? ["https://api.web3forms.com/submit", {access_key: WEB3FORMS_CLAVE, subject: asunto, from_name: "Web Gidex consulting", replyto: datos.correo, ...datos}]
        : [`https://formsubmit.co/ajax/${CORREO}`, {...datos, _subject: asunto, _replyto: datos.correo, _template: "table", _captcha: "false"}];
      const r = await fetch(url, {method: "POST", signal: ctl.signal, referrerPolicy: "no-referrer-when-downgrade", headers: {"Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify(cuerpo)});
      const j = await r.json().catch(() => ({}));
      if(!r.ok || String(j.success) === "false") throw new Error(j.message || "envío");
    }finally{ clearTimeout(reloj); }
  };
  // Si el envío falla, no se abre nada solo: se ofrecen botones para enviarlo por WhatsApp o por correo
  const respaldo = (estado, txtWA, asunto, cuerpo, msjEs, msjEn) => {
    estado.className = "estado error";
    estado.innerHTML = `${T(msjEs, msjEn)}<span class="respaldo"><a class="btn btn-wa" href="${waUrl(txtWA)}" target="_blank" rel="noopener">💬 ${T("Enviar por WhatsApp", "Send via WhatsApp")}</a><a class="btn btn-borde-azul" href="mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}">✉️ ${T("Enviar por correo", "Send by email")}</a></span>`;
  };
  const validar = (f, campos, avisar) => {
    $$(".invalido", f).forEach(x => x.classList.remove("invalido"));
    const faltan = campos.filter(k => !f[k].value.trim() || (k === "correo" && !f[k].checkValidity()));
    faltan.forEach(k => f[k].classList.add("invalido"));
    if(faltan.length){ f[faltan[0]].focus(); avisar(faltan.includes("correo") && f.correo.value ? T("Revisa tu correo: parece que no está bien escrito.", "Please check your email address.") : T("Completa los campos marcados.", "Please fill in the highlighted fields."), "error"); return false; }
    if(!f.acepto.checked){ f.acepto.focus(); avisar(T("Marca la casilla de aceptación para poder responderte.", "Please tick the consent box so we can reply to you."), "error"); return false; }
    return true;
  };

  // ===== Formulario de contacto =====
  if(form){
    const estado = $("#estado"), btn = $("#enviar");
    const avisar = (txt, tipo) => { estado.textContent = txt; estado.className = "estado " + (tipo || ""); };
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if(form._honey.value) return;
      if(!validar(form, ["nombre", "correo", "mensaje"], avisar)) return;
      const datos = {nombre: form.nombre.value.trim(), correo: form.correo.value.trim(), celular: form.celular.value.trim(), organizacion: form.organizacion.value.trim(), motivo: form.motivo.value, mensaje: form.mensaje.value.trim(), idioma: L() ? "inglés" : "español"};
      const txtBtn = btn.textContent; btn.disabled = true; btn.textContent = T("Enviando…", "Sending…"); avisar(T("Enviando tu mensaje, espera unos segundos…", "Sending your message, please wait a few seconds…"));
      try{
        await enviarCorreo(datos, `Web Gidex consulting · ${datos.motivo} · ${datos.nombre}`);
        form.reset(); avisar(T("¡Gracias! Tu mensaje fue enviado. Te responderemos pronto.", "Thank you! Your message was sent. We will reply soon."), "ok");
        medirEvento("formulario-enviado", "Contacto");
      }catch(_){
        const cuerpo = `Nombre: ${datos.nombre}\nCorreo: ${datos.correo}\nCelular: ${datos.celular || "-"}\nOrganización: ${datos.organizacion || "-"}\nMotivo: ${datos.motivo}\n\n${datos.mensaje}`;
        respaldo(estado, `Hola Gidex consulting, soy ${datos.nombre}. ${datos.mensaje}`, "Web Gidex consulting · " + datos.motivo, cuerpo,
          "No pudimos enviar tu mensaje desde la página. Tu texto sigue guardado; puedes enviarlo con un clic:", "We could not send your message from the page. Your text is still here; you can send it with one click:");
      }finally{ btn.disabled = false; btn.textContent = txtBtn; }
    });
  }

  // ===== Agenda una reunión =====
  const ag = $("#agenda-form");
  if(ag){
    const estado = $("#agenda-estado"), btn = $("#agenda-enviar"), ok = $("#agenda-ok");
    const avisar = (txt, tipo) => { estado.textContent = txt; estado.className = "estado " + (tipo || ""); };
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const hoy = new Date(), man = new Date(hoy); man.setDate(hoy.getDate() + 1); const lim = new Date(hoy); lim.setDate(hoy.getDate() + 60);
    ag.fecha.min = iso(man); ag.fecha.max = iso(lim);
    const diaDe = f => f ? new Date(f + "T12:00:00").getDay() : -1;
    const horas = () => {
      const d = diaDe(ag.fecha.value), prev = ag.hora.value, lista = [];
      const fin = d === 6 ? 12.5 : 17.5;
      if(d !== 0) for(let h = 9; h <= fin; h += .5){ if(d !== 6 && h >= 13 && h < 14) continue; lista.push(`${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`); }
      ag.hora.innerHTML = `<option value="">${d === 0 ? T("Los domingos no atendemos", "We are closed on Sundays") : !ag.fecha.value ? T("Primero elige la fecha", "Choose a date first") : T("Elige una hora", "Choose a time")}</option>` + (ag.fecha.value ? lista.map(h => `<option${h === prev ? " selected" : ""}>${h}</option>`).join("") : "");
    };
    ag.fecha.addEventListener("change", horas); horas(); alCambiar.push(horas);
    const legible = f => new Date(f + "T12:00:00").toLocaleDateString(L() ? "en-US" : "es-PE", {weekday: "long", day: "numeric", month: "long"});
    ag.addEventListener("submit", async e => {
      e.preventDefault();
      if(ag._honey.value) return;
      if(!validar(ag, ["nombre", "correo", "celular", "fecha", "hora"], avisar)) return;
      if(diaDe(ag.fecha.value) === 0){ ag.fecha.classList.add("invalido"); return avisar(T("Los domingos no atendemos; elige otro día.", "We are closed on Sundays; please choose another day."), "error"); }
      const datos = {nombre: ag.nombre.value.trim(), correo: ag.correo.value.trim(), celular: ag.celular.value.trim(), organizacion: ag.organizacion.value.trim(), fecha: ag.fecha.value, hora: ag.hora.value, modalidad: ag.modalidad.value, tema: ag.tema.value, mensaje: ag.mensaje.value.trim(), idioma: L() ? "inglés" : "español"};
      const cuando = `${legible(datos.fecha)} · ${datos.hora}`;
      const txtWA = T(`Hola Gidex consulting, soy ${datos.nombre}. Solicité una reunión para el ${cuando} (${datos.modalidad}) sobre: ${datos.tema}.`, `Hello Gidex consulting, this is ${datos.nombre}. I requested a meeting on ${cuando} (${datos.modalidad}) about: ${datos.tema}.`);
      const txtBtn = btn.textContent; btn.disabled = true; btn.textContent = T("Enviando…", "Sending…"); avisar(T("Enviando tu solicitud, espera unos segundos…", "Sending your request, please wait a few seconds…")); ok.hidden = true;
      try{
        await enviarCorreo(datos, `Reunión solicitada · ${datos.fecha} ${datos.hora} · ${datos.nombre}`);
        const [hh, mm] = datos.hora.split(":").map(Number), ini = datos.fecha.replace(/-/g, "") + "T" + String(hh).padStart(2, "0") + String(mm).padStart(2, "0") + "00";
        const fm = hh * 60 + mm + 30, finT = datos.fecha.replace(/-/g, "") + "T" + String(Math.floor(fm / 60)).padStart(2, "0") + String(fm % 60).padStart(2, "0") + "00";
        const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(T("Reunión con Gidex consulting", "Meeting with Gidex consulting"))}&dates=${ini}/${finT}&ctz=America/Lima&details=${encodeURIComponent(T("Tema: ", "Topic: ") + datos.tema + " · " + datos.modalidad + T(". Pendiente de confirmación por Gidex consulting.", ". Pending confirmation by Gidex consulting."))}`;
        ok.innerHTML = `<h3>${T("¡Solicitud enviada!", "Request sent!")}</h3><p>${T(`Pediste una reunión para el <b>${cuando}</b>. Te confirmaremos por correo o WhatsApp en menos de 24 horas hábiles.`, `You requested a meeting on <b>${cuando}</b>. We will confirm by email or WhatsApp within one business day.`)}</p><div class="acc"><a class="btn btn-blanco" href="${cal}" target="_blank" rel="noopener">📅 ${T("Añadir a mi calendario", "Add to my calendar")}</a><a class="btn btn-wa" href="${waUrl(txtWA)}" target="_blank" rel="noopener">💬 ${T("Avisar por WhatsApp", "Let us know on WhatsApp")}</a></div>`;
        ok.hidden = false; ag.reset(); horas();
        medirEvento("reunion-solicitada", T("Agenda", "Schedule"));
      }catch(_){
        const cuerpo = `Nombre: ${datos.nombre}\nCorreo: ${datos.correo}\nCelular: ${datos.celular}\nOrganización: ${datos.organizacion || "-"}\nFecha y hora: ${cuando}\nModalidad: ${datos.modalidad}\nTema: ${datos.tema}\n\n${datos.mensaje}`;
        respaldo(estado, txtWA, "Reunión solicitada · " + cuando, cuerpo,
          "No pudimos enviar tu solicitud desde la página. Tus datos siguen guardados; puedes enviarla con un clic:", "We could not send your request from the page. Your details are still here; you can send it with one click:");
      }finally{ btn.disabled = false; btn.textContent = txtBtn; }
    });
  }

  // ===== Arranque =====
  alCambiar.push(construirNavs, () => mostrar(actual), actualizarWA);
  construirNavs();
  let pref = null; try{ pref = localStorage.getItem("gx-idioma"); }catch(_){}
  const qLang = qs.get("lang"); if(qLang === "en" || qLang === "es") pref = qLang;
  if(!pref && /^en\b/i.test(navigator.language || "") ) pref = "en";
  $("#idioma").addEventListener("click", e => { const en = e.target.closest(".id-en") ? true : e.target.closest(".id-es") ? false : !L(); if(en !== L()) ponerIdioma(en, true); });
  if(pref === "en") ponerIdioma(true, false); else ponerIdioma(false, false);
  mostrar(ruta(), false);
})();
