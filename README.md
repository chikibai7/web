# Delega Pisos — web

Web estática de Delega Pisos: HTML, CSS y JavaScript sin frameworks, pensada para Netlify.
No carga nada de terceros (ni analítica, ni fuentes remotas, ni CDNs) y no instala cookies.

## Estructura

```
index.html          Página principal (una sola página)
privacidad.html     Política de privacidad (texto literal facilitado)
aviso-legal.html    Aviso legal (texto literal facilitado)
gracias.html        Destino del formulario (noindex)
css/styles.css      Estilos (móvil primero)
js/main.js          Menú móvil, animación al hacer scroll, validación del formulario y opiniones
fonts/              Lora e Inter en woff2 (licencia OFL incluida)
img/                Logos, favicons, og-image, fotos en WebP y originales del logo (portada.png es la portada de redes; no se usa en la web)
data/opiniones.json Opiniones; si está vacío, la sección no aparece
robots.txt, sitemap.xml, site.webmanifest, favicon.ico
netlify.toml        Publicación, dirección web y cabeceras de seguridad (la CSP bloquea cualquier recurso de terceros)
```

## Verla en local

```
python3 -m http.server 8000
```

y abrir http://localhost:8000. El formulario solo funciona una vez publicado en Netlify.

## Dirección web

Las direcciones absolutas (enlace canónico, Open Graph, datos estructurados, `robots.txt` y `sitemap.xml`)
usan `https://delegapisos.netlify.app`. Al desplegar, `netlify.toml` la cambia por la dirección real
del proyecto (`$URL`), así que no hay que tocar nada:

- si Netlify asigna otro nombre, se usa ese;
- si algún día hay dominio propio, se añade en *Domain management* y se vuelve a desplegar.

Conviene llamar al proyecto `delegapisos` en Netlify (*Project configuration → General → Project details → Change project name*)
para que la dirección sea legible.

## Fotos

Las fotos son ilustrativas y llevan la nota «Imagen ilustrativa». Se sirven en WebP, sin metadatos y en varios
anchos para que cada pantalla descargue la que necesita:

| Archivo | Dónde | Formato |
|---|---|---|
| `foto-salon-*.webp` | Portada (ordenador y tableta) | 2,2:1, de 800 a 2240 px |
| `foto-salon-movil-*.webp` | Portada (móvil) | 4:3, de 400 a 1320 px |
| `foto-recibidor-*.webp` | «Para quién es» | 4:5, de 400 a 1320 px |
| `foto-fachada-*.webp` | «Solo pisos en regla» | 4:3, de 400 a 1400 px |

Para cambiar una foto, basta con sustituir esos archivos por otros con el mismo nombre y proporción.

## Opiniones

Solo opiniones reales y con permiso de quien las escribe. Formato de `data/opiniones.json`:

```json
[
  {
    "nombre": "Nombre",
    "zona": "Alcobendas",
    "texto": "Texto de la opinión.",
    "fecha": "2026-09",
    "origen": "Google"
  }
]
```

`fecha` admite `AAAA-MM` o `AAAA-MM-DD` (se muestra como «septiembre de 2026»). Con `[]` la sección queda oculta.

## Netlify

1. *Add new project → Import an existing project →* GitHub → este repositorio, rama `main`.
2. Todo lo demás viene en `netlify.toml`: no hay que rellenar comando ni carpeta.
3. *Forms → Enable form detection* y volver a desplegar.
4. *Project configuration → Notifications → Emails and webhooks → Form submission notifications →*
   *Add notification → Email notification*, formulario `contacto`, email `moriogarciaatance@gmail.com`.
