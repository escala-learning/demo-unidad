/* Capa Scala · sonido de la evaluación
   ------------------------------------------------------------------
   Tres señales sintetizadas con WebAudio (sin archivos que licenciar):
   acierto (dos notas ascendentes), error (dos notas descendentes) y
   avance de pregunta (un blip corto). El motor solo emite eventos
   (ova:quiz-respuesta · ova:empar-intento · ova:evalquiz-avance); si esta
   capa no está cargada, el curso funciona igual en silencio.
   El AudioContext se crea en el primer evento —siempre nace de un
   click, así que el navegador no lo bloquea. */
(() => {
  'use strict';

  let ctx = null;
  const VOLUMEN = 0.12;

  function contexto() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* Toca una secuencia de notas: [frecuencia, duración en s] */
  function tocar(notas, tipo = 'sine') {
    const ac = contexto();
    if (!ac) return;
    let t = ac.currentTime;
    notas.forEach(([frec, dur]) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = tipo;
      osc.frequency.value = frec;
      /* Ataque y caída suaves para que no haga click al cortar */
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(VOLUMEN, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur * 0.7; /* leve solape entre notas */
    });
  }

  const sonidos = {
    acierto: () => tocar([[523.25, 0.16], [783.99, 0.22]]),          /* C5 → G5 */
    error:   () => tocar([[311.13, 0.18], [233.08, 0.26]], 'triangle'), /* Eb4 → Bb3 */
    avance:  () => tocar([[587.33, 0.09]])                            /* D5, blip */
  };

  document.addEventListener('ova:quiz-respuesta', e => {
    (e.detail.correcta ? sonidos.acierto : sonidos.error)();
  });
  document.addEventListener('ova:empar-intento', e => {
    (e.detail.correcta ? sonidos.acierto : sonidos.error)();
  });
  document.addEventListener('ova:evalquiz-avance', () => sonidos.avance());
})();

/* Capa Scala · pódcast de la unidad
   ------------------------------------------------------------------
   El motor trae la pieza visual `.ova-audio` (play, título, progreso, tiempo)
   pero no la reproduce. Aquí se le da vida a la que declare
   `data-sl-audio="<ruta del mp3>"`: play/pausa, progreso, tiempo restante y
   salto al tocar la barra. Delegado en `document`, así funciona igual en la
   SPA (pantallas montadas desde <template>) y en multipágina. Un solo pódcast
   suena a la vez. */
(() => {
  'use strict';

  const reproductores = new WeakMap();

  const mmss = s => {
    if (!isFinite(s)) return '--:--';
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, '0')}`;
  };

  function pintar(caja, audio) {
    const fill = caja.querySelector('.ova-audio__progress-fill');
    const tiempo = caja.querySelector('.ova-audio__time');
    const icono = caja.querySelector('.ova-audio__play iconify-icon');
    if (fill && audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    if (tiempo) tiempo.textContent = audio.paused && !audio.currentTime
      ? mmss(audio.duration)
      : `${mmss(audio.currentTime)} / ${mmss(audio.duration)}`;
    if (icono) icono.setAttribute('icon', audio.paused ? 'mdi:play' : 'mdi:pause');
    caja.classList.toggle('is-playing', !audio.paused);
  }

  function reproductor(caja) {
    let audio = reproductores.get(caja);
    if (audio) return audio;
    audio = new Audio(caja.dataset.slAudio);
    audio.preload = 'metadata';
    ['loadedmetadata', 'timeupdate', 'play', 'pause', 'ended'].forEach(ev =>
      audio.addEventListener(ev, () => pintar(caja, audio)));
    audio.addEventListener('play', () => {
      document.querySelectorAll('[data-sl-audio]').forEach(otra => {
        const a = reproductores.get(otra);
        if (a && a !== audio && !a.paused) a.pause();
      });
    });
    reproductores.set(caja, audio);
    return audio;
  }

  document.addEventListener('click', e => {
    const play = e.target.closest('[data-sl-audio] .ova-audio__play');
    if (play) {
      const audio = reproductor(play.closest('[data-sl-audio]'));
      audio.paused ? audio.play() : audio.pause();
      return;
    }
    const barra = e.target.closest('[data-sl-audio] .ova-audio__progress');
    if (barra) {
      const caja = barra.closest('[data-sl-audio]');
      const audio = reproductor(caja);
      if (!audio.duration) return;
      const r = barra.getBoundingClientRect();
      audio.currentTime = audio.duration * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      pintar(caja, audio);
    }
  });
})();

/* Capa Scala · globos de los puntos de interés
   ------------------------------------------------------------------
   El motor abre el globo de un `.ova-hotspot` siempre hacia abajo, centrado
   en el punto, dentro de una imagen que recorta. Un punto cerca del borde
   inferior o lateral dejaba el texto cortado (unidad-3-v2, tema 1, punto 6,
   2026-10-09). Aquí, al abrirlo, se mide: si no cabe abajo y sí arriba, se
   abre hacia arriba (.sl-hotspot--arriba), y si se sale por un costado de la
   imagen o de la ventana, se corre lo justo (--sl-globo-dx). El CSS de la
   capa (skin.css, «Puntos de interés») deja de recortar, así que sin este
   script el globo igual se ve entero. Se abre al pasar el puntero o al tocar
   el punto; un toque fuera lo cierra. */
(() => {
  'use strict';

  const MARGEN = 8;   // aire mínimo hasta el borde de la imagen o de la ventana

  function abrir(punto) {
    const globo = punto.querySelector('.ova-hotspot__tooltip');
    if (!globo) return;
    punto.classList.add('is-open');
    punto.classList.remove('sl-hotspot--arriba');
    punto.style.removeProperty('--sl-globo-dx');
    const caja = (punto.closest('.ova-hotspots__img') || punto.parentElement).getBoundingClientRect();
    const p = punto.getBoundingClientRect();
    const g = globo.getBoundingClientRect();
    const alto = g.height + 14;
    if (p.bottom + alto > caja.bottom && p.top - alto >= caja.top) punto.classList.add('sl-hotspot--arriba');
    const izq = Math.max(caja.left, 0) + MARGEN;
    const der = Math.min(caja.right, document.documentElement.clientWidth) - MARGEN;
    let dx = 0;
    if (g.width <= der - izq) {
      if (g.left < izq) dx = izq - g.left;
      else if (g.right > der) dx = der - g.right;
    }
    if (dx) punto.style.setProperty('--sl-globo-dx', `${Math.round(dx)}px`);
  }
  function cerrar(punto) {
    punto.classList.remove('is-open', 'sl-hotspot--arriba');
    punto.style.removeProperty('--sl-globo-dx');
  }

  document.addEventListener('pointerover', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    if (punto && !punto.contains(e.relatedTarget)) abrir(punto);
  });
  document.addEventListener('pointerout', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    if (punto && e.pointerType === 'mouse' && !punto.contains(e.relatedTarget)) cerrar(punto);
  });
  document.addEventListener('click', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    document.querySelectorAll('.ova-hotspot.is-open').forEach(otro => { if (otro !== punto) cerrar(otro); });
    if (punto) abrir(punto);
  });
})();

/* Capa Scala · indicio de interacción
   ------------------------------------------------------------------
   Cada vez que un componente interactivo aparece en pantalla (al bajar o
   al subir), él y su llamado a la acción (.sl-cta justo antes) reciben
   .sl-indicio, y la manito y el halo de skin.css se animan una vez. Al salir
   del todo se les quita, así que al volver la animación arranca de nuevo
   (decisión del 2026-10-09). No usa el .is-visible del motor: ese se pone una
   sola vez y no se quita. Vigila también los componentes que la SPA pinta al
   navegar. Con movimiento reducido, skin.css anula las animaciones. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  const INTERACTIVOS = '.ova-acordeon, .ova-carrusel, .ova-tabs, .ova-timeline-h, .ova-hotspots, ' +
                       '.ova-video, .ova-audio, .ova-beforeafter, .sl-descarga';
  const vigilados = new WeakSet();

  const marcar = (comp, si) => {
    comp.classList.toggle('sl-indicio', si);
    const previo = comp.previousElementSibling;
    if (previo && previo.classList.contains('sl-cta')) previo.classList.toggle('sl-indicio', si);
  };

  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (e.intersectionRatio >= 0.25) marcar(e.target, true);
      else if (!e.isIntersecting) marcar(e.target, false);
    }
  }, { threshold: [0, 0.25] });

  const vigilar = raiz => {
    if (!raiz.querySelectorAll) return;
    const lista = raiz.matches && raiz.matches(INTERACTIVOS) ? [raiz] : [];
    lista.push(...raiz.querySelectorAll(INTERACTIVOS));
    for (const comp of lista) {
      if (vigilados.has(comp)) continue;
      vigilados.add(comp);
      observador.observe(comp);
    }
  };

  const iniciar = () => {
    vigilar(document);
    new MutationObserver(cambios => {
      for (const c of cambios) c.addedNodes.forEach(n => n.nodeType === 1 && vigilar(n));
    }).observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();
