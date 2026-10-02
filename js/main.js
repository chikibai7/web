/* Delega Pisos — interacción mínima, sin dependencias ni servicios externos. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Cabecera: filete inferior al hacer scroll ---------- */

  var header = document.querySelector('.site-header');
  if (header && 'IntersectionObserver' in window) {
    var centinela = document.createElement('div');
    centinela.className = 'scroll-centinela';
    centinela.setAttribute('aria-hidden', 'true');
    document.body.prepend(centinela);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    }).observe(centinela);
  }

  /* ---------- Menú móvil ---------- */

  var nav = document.querySelector('.nav');
  var toggle = nav && nav.querySelector('.nav-toggle');
  if (nav && toggle) {
    var label = toggle.querySelector('.nav-toggle-label');
    var panel = nav.querySelector('.nav-panel');
    var fondo = ['main', '.site-footer', '.barra-movil', '.header-cta', '.brand'].map(function (sel) {
      return document.querySelector(sel);
    });

    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Cerrar' : 'Menú';
      root.classList.toggle('menu-abierto', open);
      fondo.forEach(function (el) {
        if (el) el.inert = open;
      });
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 72em)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------- Aparición suave (solo lo que aún no se ha visto) ---------- */

  // El primer aviso del observador dice qué está fuera de pantalla: solo eso se oculta,
  // sin medir nada a mano (medir cada bloque forzaba un recálculo de diseño por elemento).
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          if (el.classList.contains('reveal')) el.classList.add('is-visible');
          observer.unobserve(el);
        } else {
          el.classList.add('reveal');
        }
      });
    });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentElement.children, function (n) {
        return n.hasAttribute('data-reveal');
      });
      if (hermanos.length > 1) el.style.setProperty('--i', String(hermanos.indexOf(el) % 4));
      observer.observe(el);
    });
  }

  /* ---------- Formulario de contacto (Netlify Forms) ---------- */

  var form = document.querySelector('form[name="contacto"]');
  if (form) {
    var enviar = form.querySelector('[type="submit"]');
    var textoEnviar = enviar.textContent;

    var reglas = {
      nombre: {
        valido: function (f) { return f.value.trim().length >= 2; },
        mensaje: 'Escribe tu nombre.'
      },
      telefono: {
        valido: function (f) {
          var v = f.value.trim();
          var digitos = v.replace(/\D/g, '');
          return /^[+\d\s().-]+$/.test(v) && digitos.length >= 9 && digitos.length <= 15;
        },
        mensaje: 'Escribe un teléfono válido.'
      },
      zona: {
        valido: function (f) { return f.value !== ''; },
        mensaje: 'Elige la zona del piso.'
      },
      consentimiento: {
        valido: function (f) { return f.checked; },
        mensaje: 'Tienes que aceptar para que podamos llamarte.'
      }
    };

    var marcar = function (campo, mensaje) {
      var caja = document.getElementById('e-' + campo.name);
      if (mensaje) {
        campo.setAttribute('aria-invalid', 'true');
      } else {
        campo.removeAttribute('aria-invalid');
      }
      if (caja) {
        caja.textContent = mensaje;
        caja.hidden = !mensaje;
      }
    };

    var revisar = function (event) {
      var campo = event.target;
      var regla = reglas[campo.name];
      if (regla && campo.getAttribute('aria-invalid') === 'true' && regla.valido(campo)) {
        marcar(campo, '');
      }
    };

    form.noValidate = true;
    form.addEventListener('input', revisar);
    form.addEventListener('change', revisar);

    form.addEventListener('submit', function (event) {
      var primero = null;
      Object.keys(reglas).forEach(function (nombre) {
        var campo = form.elements[nombre];
        var ok = reglas[nombre].valido(campo);
        marcar(campo, ok ? '' : reglas[nombre].mensaje);
        if (!ok && !primero) primero = campo;
      });
      if (primero) {
        event.preventDefault();
        primero.focus();
        return;
      }
      enviar.disabled = true;
      enviar.textContent = 'Enviando…';
    });

    // Al volver atrás desde gracias.html, el botón debe estar operativo otra vez
    window.addEventListener('pageshow', function () {
      enviar.disabled = false;
      enviar.textContent = textoEnviar;
    });

    // La barra inferior no debe tapar el teclado mientras se escribe
    var barra = document.querySelector('.barra-movil');
    if (barra) {
      form.addEventListener('focusin', function () { barra.classList.add('is-hidden'); });
      form.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!form.contains(document.activeElement)) barra.classList.remove('is-hidden');
        }, 150);
      });
    }
  }

  /* ---------- Opiniones desde /data/opiniones.json ---------- */
  /* Si el archivo no existe, está vacío o no tiene opiniones válidas, la sección sigue oculta. */

  var seccion = document.getElementById('opiniones');
  var lista = seccion && seccion.querySelector('[data-opiniones]');
  if (seccion && lista && window.fetch) {
    var texto = function (v) { return typeof v === 'string' ? v.trim() : ''; };

    var fecha = function (v) {
      var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(v);
      if (!m) return v;
      var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3] || 1));
      return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(d);
    };

    fetch('/data/opiniones.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (cuerpo) {
        var datos;
        try { datos = JSON.parse(cuerpo); } catch (e) { return; }
        if (!Array.isArray(datos)) return;

        var validas = datos.filter(function (o) {
          return o && texto(o.texto) && texto(o.nombre);
        });
        if (!validas.length) return;

        validas.forEach(function (o) {
          var li = document.createElement('li');
          var figure = document.createElement('figure');
          figure.className = 'opinion';

          var cita = document.createElement('blockquote');
          var p = document.createElement('p');
          p.textContent = texto(o.texto);
          cita.appendChild(p);

          var pie = document.createElement('figcaption');
          var nombre = document.createElement('span');
          nombre.className = 'opinion-nombre';
          nombre.textContent = texto(o.nombre);
          pie.appendChild(nombre);
          [texto(o.zona), fecha(texto(o.fecha)), texto(o.origen)].forEach(function (dato) {
            if (dato) pie.appendChild(document.createTextNode(' · ' + dato));
          });

          figure.appendChild(cita);
          figure.appendChild(pie);
          li.appendChild(figure);
          lista.appendChild(li);
        });

        seccion.hidden = false;
      })
      .catch(function () { /* sin opiniones, sin sección */ });
  }
})();
