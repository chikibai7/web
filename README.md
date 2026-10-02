# Delega Pisos — web

Web estática de Delega Pisos: HTML, CSS y JavaScript sin frameworks ni compilación, pensada para Netlify.
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
img/                Logos, favicons, og-image y originales (portada.png es la portada de redes; no se usa en la web)
data/opiniones.json Opiniones; si está vacío, la sección no aparece
robots.txt, sitemap.xml, site.webmanifest, favicon.ico
netlify.toml        Publicación y cabeceras de seguridad (la CSP bloquea cualquier recurso de terceros)
```

## Verla en local

```
python3 -m http.server 8000
```

y abrir http://localhost:8000. El formulario solo funciona una vez publicado en Netlify.

## Pendientes

Todo lo que falta está marcado en el código como `[PENDIENTE: …]`. Para localizarlo:

```
grep -rn "PENDIENTE" --include=*.html --include=*.txt --include=*.xml .
```

- **Foto de Marcos** (`index.html`, portada): subir `marcos.jpg` a `img/`, crear `img/marcos-640.webp` y `img/marcos-1280.webp` (por ejemplo con squoosh.app) y sustituir el bloque marcado por la etiqueta `<img>` que hay comentada justo encima.
- **Texto de Marcos** (`index.html`, «Quién está detrás»).
- **NIF y dirección** (`privacidad.html` y `aviso-legal.html`).
- **IVA** (`aviso-legal.html`, apartado 4): «incluyen IVA» o «no incluyen IVA».
- **Dominio**: sustituir `https://dominio-pendiente.example` en todos los archivos:

  ```
  grep -rl "dominio-pendiente.example" . | xargs sed -i 's#https://dominio-pendiente.example#https://www.tudominio.es#g'
  ```

  (en macOS: `sed -i ''`).

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

1. *Add new site → Import an existing project →* GitHub → este repositorio, rama `main`.
2. Sin comando de compilación; directorio de publicación `.` (ya viene en `netlify.toml`).
3. *Forms → Enable form detection* y volver a desplegar.
4. *Site configuration → Notifications → Emails and webhooks → Form submission notifications →*
   *Add notification → Email notification*, formulario `contacto`, email `moriogarciaatance@gmail.com`.
