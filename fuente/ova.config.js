/* =========================================================
   CURSO · Curso demo · Cómo está hecha una unidad Scala
   ---------------------------------------------------------
   Cliente:   Scala Learning
   Insumo:    NINGUNO. Este curso no tiene DI: es una muestra y su
              texto se escribió directamente (ver insumos/LEEME.md).
              Por lo mismo, `verificar-di.py` no aplica aquí.
   Audiencia: Diseñadores instruccionales y clientes que van a escribir
              o a aprobar una unidad Scala. No requiere conocimiento
              técnico de maquetación.
   Duración:  [no declarada]
   Preset visual: scala  (ver instituciones/scala-learning/INSTITUCION.md)
   Versión template: hibrida
   ========================================================= */

module.exports = {

  brand: {
    // Logo negativo (blanco + arco amarillo): el que va sobre el sidebar navy.
    name: '',
    sub:  '',
    logo:       'assets/img/logos/scala-logo.svg',
    logoMobile: 'assets/img/logos/scala-sello.svg',
  },

  course: {
    code:             'CURSO DEMO',
    name:             'Cómo está hecha una unidad Scala',
    subtitle:         'Una unidad de muestra, explicada desde dentro',
    duration:         '',
    iso:              '',
    licencia:         '',
    preset:           'scala',
    pdf:              '',            // el demo no trae cuaderno de aprendizaje
    portadaFullBleed: true,
  },

  /* MENÚ · el demo reproduce la estructura estándar de una unidad Scala
     (INSTITUCION.md §2): Inicio, Contenido, Introducción, los temas
     numerados, Conclusión, Evaluación, Glosario y Referencias.

       - `tipo: 'especial'`  → sección estructural. Icono, no número.
       - `tipo: 'tema'`      → contenido temático. Numerado.

     Es a propósito que solo los temas lleven número: el demo enseña
     esa regla mostrándola, no contándola (INSTITUCION.md §4.15).

     Las `secciones` con `ancla` aparecen en el menú como sub-ítems y bajan
     a la `.sl-seccion` con ese `id`. En una unidad real los títulos de
     sección son literales del DI; aquí, como no hay DI, son editoriales
     igual que el resto del curso (ver insumos/LEEME.md). */
  menu: [
    { id: 'portada',         titulo: 'Inicio',                                  tipo: 'especial', icon: 'mdi:home-outline' },
    { id: 'temario',         titulo: 'Contenido de la unidad',                  tipo: 'especial', icon: 'mdi:map-outline' },

    { id: 'introduccion',    titulo: 'Introducción',                            tipo: 'especial', icon: 'mdi:information-variant',
      secciones: [ { titulo: 'Una unidad es un Word convertido en pantallas' },
                   { titulo: 'Qué vas a lograr', ancla: 'que-vas-a-lograr' },
                   { titulo: 'Cómo se organiza una unidad', ancla: 'como-se-organiza' },
                   { titulo: 'Quién hace qué', ancla: 'quien-hace-que' } ] },

    { id: 'tema1',           titulo: 'Cómo se lee un tema',                     tipo: 'tema', numero: 1,
      secciones: [ { titulo: 'Qué contiene siempre un tema', ancla: 'que-contiene' },
                   { titulo: 'Las piezas que ordenan', ancla: 'piezas-ordenan' },
                   { titulo: 'Las piezas que destacan', ancla: 'piezas-destacan' },
                   { titulo: 'Las piezas que contrastan', ancla: 'piezas-contrastan' } ] },

    { id: 'tema2',           titulo: 'Cómo se explica con piezas gráficas',     tipo: 'tema',
      secciones: [ { titulo: 'Lo que se dibuja entero: la rueda y la ficha', ancla: 'rueda-y-ficha' },
                   { titulo: 'Lo que se dibuja comparando: el caso y el diagrama', ancla: 'caso-y-diagrama' },
                   { titulo: 'Lo que llega ya hecho: la figura', ancla: 'la-figura' },
                   { titulo: 'Lo que viaja con el curso: el video', ancla: 'el-video', nota: 'incluye un video de muestra' } ] },

    { id: 'tema3',           titulo: 'Pautas de diseño',                        tipo: 'tema',
      secciones: [ { titulo: 'Color: el violeta actúa, el amarillo guía', ancla: 'color' },
                   { titulo: 'Tipografía: tres pesos y un remate', ancla: 'tipografia' },
                   { titulo: 'Forma y aire', ancla: 'forma-y-aire' },
                   { titulo: 'La rueda', ancla: 'la-rueda' },
                   { titulo: 'Fotografía e ilustración', ancla: 'foto-e-ilustracion' },
                   { titulo: 'Movimiento y móvil', ancla: 'movimiento-y-movil' } ] },

    { id: 'tema4',           titulo: 'Cómo se marca el Word',                   tipo: 'tema',
      secciones: [ { titulo: 'Las tres vías', ancla: 'tres-vias' },
                   { titulo: 'La plantilla: un bloque por componente', ancla: 'la-plantilla', nota: 'con la plantilla y el ejemplo para descargar' },
                   { titulo: 'La figura se pide en su caja', ancla: 'diseno-grafico' },
                   { titulo: 'Las negrillas son contenido', ancla: 'negrillas' } ] },

    { id: 'tema5',           titulo: 'Catálogo · Texto y énfasis',              tipo: 'tema',
      secciones: [ { titulo: 'Bloque de apertura', ancla: 'apertura' },
                   { titulo: 'Tarjeta con icono', ancla: 'tarjeta-destacada' },
                   { titulo: 'Nota lateral', ancla: 'dato-ligero' },
                   { titulo: 'Cifra destacada', ancla: 'cifra' },
                   { titulo: 'Cita', ancla: 'cita' },
                   { titulo: 'Banner destacado', ancla: 'banda' },
                   { titulo: 'Término con tooltip', ancla: 'termino' } ] },

    { id: 'tema6',           titulo: 'Catálogo · Estructura del contenido',     tipo: 'tema',
      secciones: [ { titulo: 'Acordeón', ancla: 'acordeon' },
                   { titulo: 'Carrusel', ancla: 'carrusel' },
                   { titulo: 'Pestañas', ancla: 'pestanas' },
                   { titulo: 'Recorrido de pasos', ancla: 'recorrido' },
                   { titulo: 'Pasos con detalle', ancla: 'pasos-detalle' },
                   { titulo: 'Ciclo', ancla: 'ciclo' },
                   { titulo: 'Línea de tiempo', ancla: 'linea-de-tiempo' },
                   { titulo: 'Infografía de lista', ancla: 'infografia' },
                   { titulo: 'Comparativo', ancla: 'comparativo' },
                   { titulo: 'Tabla', ancla: 'tabla' },
                   { titulo: 'Ventana de detalle', ancla: 'ventana-detalle' },
                   { titulo: 'Diagrama y proporción', ancla: 'diagrama-y-proporcion' } ] },

    { id: 'tema7',           titulo: 'Catálogo · Imagen, video y audio',        tipo: 'tema',
      secciones: [ { titulo: 'Ilustración explicativa', ancla: 'ilustracion' },
                   { titulo: 'Figura y foto', ancla: 'figura-y-foto' },
                   { titulo: 'Antes y después', ancla: 'antes-y-despues' },
                   { titulo: 'Puntos de interés', ancla: 'puntos-de-interes' },
                   { titulo: 'Video', ancla: 'video' },
                   { titulo: 'Audio y pódcast', ancla: 'audio-y-podcast' },
                   { titulo: 'Descarga', ancla: 'descarga' } ] },

    { id: 'tema8',           titulo: 'Catálogo · Actividad',                    tipo: 'tema',
      secciones: [ { titulo: 'Pregunta de selección', ancla: 'pregunta' },
                   { titulo: 'Relacionar términos', ancla: 'relacionar' },
                   { titulo: 'Ordenar y clasificar', ancla: 'ordenar-y-clasificar' },
                   { titulo: 'Lista de verificación', ancla: 'lista-de-verificacion' },
                   { titulo: 'Evaluación de la unidad', ancla: 'evaluacion-unidad' } ] },

    { id: 'conclusion',      titulo: 'Conclusión',                              tipo: 'especial', icon: 'mdi:flag-outline', nota: 'incluye el pódcast de la unidad' },
    { id: 'evaluacion',      titulo: 'Evaluación de la unidad',                 tipo: 'especial', icon: 'mdi:clipboard-check-outline', nota: '8 preguntas' },
    { id: 'glosario',        titulo: 'Glosario',                                tipo: 'especial', icon: 'mdi:card-text-outline', nota: '15 términos' },   // set de INSTITUCION.md §2 7quater
    { id: 'referencias',     titulo: 'Referencias',                             tipo: 'especial', icon: 'mdi:bookmark-outline' },
  ],

  /* REFERENCIAS · este curso no cita literatura académica: sus fuentes son los
     documentos internos con los que se produce una unidad Scala. Se maquetan
     en la pantalla de referencias con el mismo formato de la U2. */
  referencias: [
    'Scala Learning. (2026). Guía de producción de Scala Learning (INSTITUCION.md). OVA Kit, instituciones/scala-learning/.',
    'Scala Learning. (2026). Brandbook Scala Learning · Visual Identity System 2026.',
    'OVA Kit. (2026). Producción de cursos · procedimiento (docs/produccion-de-cursos.md).',
  ],

  creditos: {
    institucion: 'Scala Learning',
  },
};
