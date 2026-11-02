# Gidex consulting · página web

**Automatización | Sistematización | Inteligencia artificial**
*Ingeniería que transforma · Tecnología que impulsa*

Sitio web de Gidex consulting, consultora peruana de ingeniería y tecnología con sede en Piura.

🌐 **Sitio publicado:** https://gidexconsulting-ctrl.github.io/gidex-consulting/

## Cómo está organizado

El sitio funciona como una aplicación, igual que Algarrobo: un **menú lateral** y **ventanas** que se abren una a la vez (sin una página larga), con botones «Anterior» y «Siguiente».

| Grupo | Ventanas |
|---|---|
| Gidex consulting | Inicio · ¿Por qué Gidex? · Quiénes somos (misión y visión) · Valores y sectores · Equipo |
| Servicios | Servicios (8, con «¿Qué incluye?») · Planes y precios · Cómo trabajamos · Algarrobo · Experiencia · Trayectoria |
| Contigo | Diagnóstico rápido · Agenda una reunión · Testimonios · Preguntas frecuentes · Recursos y artículos (3 artículos) · Contacto |

Cada ventana tiene su propia dirección (por ejemplo `#servicios`), así se puede compartir directamente. Las direcciones antiguas (`servicios.html`, `contacto.html`, etc.) redirigen a su ventana.

Colores y tipografías de Algarrobo: azul rey `#003399`, celeste `#00BFFF`, fondo `#F4F9FC`; Unbounded e Instrument Sans.

## Archivos

```
index.html      menú lateral y todas las ventanas
styles.css      estilos
app.js          ventanas, carrusel, agenda, WhatsApp, idioma, diagnóstico, formularios y estadísticas
i18n-en.js      traducción al inglés (texto en español → texto en inglés)
assets/         logo, fotos del equipo, imágenes del carrusel e imagen para redes sociales
```

## Funciones

- **Carrusel en Inicio:** panel de ejemplo, capturas de Algarrobo y foto del equipo. Avanza solo cada 5,5 s, se pausa al pasar el mouse y tiene botón de pausa; en celular se desliza con el dedo.
- **WhatsApp flotante:** el mensaje que se envía cambia según la ventana (cotización en «Planes y precios», demostración en «Algarrobo», etc.).
- **Agenda una reunión:** el visitante elige fecha (lunes a sábado) y hora; la solicitud llega al correo y puede añadirla a su Google Calendar o avisar por WhatsApp.
- **Español / inglés:** botón ES | EN en la barra superior. Se recuerda la elección y también funciona con `?lang=en`. Si se cambia un texto en `index.html`, hay que agregar su traducción en `i18n-en.js` (si falta, se muestra en español).
- **Estadísticas de visitas:** al inicio de `app.js`, en `ANALITICA`, se pega el nombre de la cuenta de GoatCounter (gratis y sin cookies) o el ID de Google Analytics 4. Se registra cada ventana vista y los clics en WhatsApp, formularios enviados, reuniones solicitadas y cambio de idioma.

## Formulario de contacto

El formulario usa [FormSubmit](https://formsubmit.co) para enviar los mensajes al correo **gidex.consulting@gmail.com** sin necesidad de servidor.
**La primera vez** que alguien envíe un mensaje, FormSubmit manda un correo de activación a gidex.consulting@gmail.com: hay que abrirlo y confirmar para que los siguientes mensajes lleguen. Si el servicio no respondiera, el formulario abre el correo del visitante con el mensaje listo para enviar.

## Contacto

- ✉️ gidex.consulting@gmail.com
- 💬 953 859 154 · Giancarlos Adanaque Flores
- 💬 925 937 386 · Denis Javier García Cortez

© Gidex consulting. Todos los derechos reservados.
