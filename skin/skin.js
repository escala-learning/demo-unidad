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
