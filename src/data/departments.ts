import type { DepartmentData, DepartmentId } from '../types'

const WHATSAPP_URL = 'https://wa.me/573183592598'

export const DEPARTMENTS: DepartmentData[] = [
  {
    id: 1,
    slug: 'composicion-musical',
    name: 'Composición Musical',
    tagline: 'Damos vida a tus ideas y emociones en canciones únicas',
    backgroundImage: '/images/composition-musical-bg.jpg',
    ambientColor: '#8B4A1C',
    services: [
      { id: 'comp-1', name: 'Composición de canciones', description: 'Creamos canciones originales desde cero adaptadas a tu visión.' },
      { id: 'comp-2', name: 'Letras y melodías', description: 'Desarrollamos letras con profundidad y melodías que perduran.' },
      { id: 'comp-3', name: 'Canciones personalizadas', description: 'Canciones a medida para eventos, marcas o momentos especiales.' },
      { id: 'comp-4', name: 'Asesoría creativa', description: 'Guía experta para desarrollar y pulir tus propias ideas musicales.' },
    ],
    featuredWorks: [
      {
        id: 'comp-fw-1',
        title: 'Corazón de Noche',
        artist: 'Valentina Cruz',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'comp-fw-2',
        title: 'Entre Luces',
        artist: 'Diego Alvarado',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'comp-fw-3',
        title: 'Sesión de composición — Backstage',
        artist: 'Zapata Composiciones',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Conocemos tu idea',
        description: 'Escuchamos tu concepto, estilo y referencias para entender exactamente lo que necesitas.',
      },
      {
        number: 2,
        title: 'Componemos',
        description: 'Nuestro equipo desarrolla la estructura, letra y melodía en función de tu visión.',
      },
      {
        number: 3,
        title: 'Desarrollamos',
        description: 'Refinamos cada sección con revisiones colaborativas hasta que la canción sea perfecta.',
      },
      {
        number: 4,
        title: 'Entrega final',
        description: 'Recibes los archivos en los formatos que necesites, listos para producción.',
      },
    ],
    contactAction: {
      label: 'Solicitar servicio',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
  },
  {
    id: 2,
    slug: 'proyectos-remixes',
    name: 'Proyectos y Remixes',
    tagline: 'Transformamos canciones en experiencias únicas',
    backgroundImage: '/images/proyect-remix-bg.jpg',
    ambientColor: '#1A1A4E',
    services: [
      { id: 'remix-1', name: 'Remixes profesionales', description: 'Reinterpretamos canciones existentes con identidad y calidad.' },
      { id: 'remix-2', name: 'Edición de audio', description: 'Corrección, limpieza y optimización de material pregrabado.' },
      { id: 'remix-3', name: 'Reversiones', description: 'Nuevas versiones de canciones con géneros o estilos alternativos.' },
      { id: 'remix-4', name: 'Proyectos musicales', description: 'Desarrollo integral de proyectos discográficos desde la idea hasta el lanzamiento.' },
    ],
    featuredWorks: [
      {
        id: 'remix-fw-1',
        title: 'Fuego Lento (Remix)',
        artist: 'Marco Reyes ft. Layla',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'remix-fw-2',
        title: 'Madrugada Eléctrica (Club Mix)',
        artist: 'DJ Nómada',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'remix-fw-3',
        title: 'Proceso de remix — Estudio',
        artist: 'Zapata Composiciones',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Recibimos tu material',
        description: 'Nos envías los stems o el audio original con las notas de lo que buscas lograr.',
      },
      {
        number: 2,
        title: 'Analizamos y planificamos',
        description: 'Estudiamos el material y definimos la dirección creativa del remix o revisión.',
      },
      {
        number: 3,
        title: 'Producimos el remix',
        description: 'Creamos la nueva versión con revisiones incluidas hasta que el resultado te convenza.',
      },
    ],
    contactAction: {
      label: 'Enviar demo',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
  },
  {
    id: 3,
    slug: 'produccion-musical',
    name: 'Producción Musical',
    tagline: 'Llevamos tu canción al siguiente nivel',
    backgroundImage: '/images/production-musical-bg.jpg',
    ambientColor: '#1A3A1A',
    services: [
      { id: 'prod-1', name: 'Producción musical', description: 'Producción completa de canciones con sonido profesional de nivel internacional.' },
      { id: 'prod-2', name: 'Grabación de voces', description: 'Sesiones de grabación vocal en entorno profesional con dirección artística.' },
      { id: 'prod-3', name: 'Mezcla y masterización', description: 'Balance, dinámica y loudness optimizados para todas las plataformas.' },
      { id: 'prod-4', name: 'Beats personalizados', description: 'Instrumentales únicos creados exclusivamente para tu proyecto.' },
    ],
    featuredWorks: [
      {
        id: 'prod-fw-1',
        title: 'Alma de Cristal',
        artist: 'Isabela Montoya',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'prod-fw-2',
        title: 'Sombras del Norte',
        artist: 'Los Tres Caminos',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'prod-fw-3',
        title: 'Sesión en cabina — Proceso de producción',
        artist: 'Zapata Composiciones',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Pre-producción',
        description: 'Definimos la visión artística, tonalidad, tempo y referencias de sonido antes de empezar.',
      },
      {
        number: 2,
        title: 'Producción',
        description: 'Construimos la instrumentación, beats y arreglos que dan vida a la canción.',
      },
      {
        number: 3,
        title: 'Mezcla',
        description: 'Balanceamos todos los elementos para que cada instrumento y voz ocupe su espacio.',
      },
      {
        number: 4,
        title: 'Masterización',
        description: 'Optimizamos el volumen y dinámica para su distribución en todas las plataformas.',
      },
    ],
    contactAction: {
      label: 'Iniciar demo',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
  },
  {
    id: 4,
    slug: 'marketing-lanzamientos',
    name: 'Marketing y Lanzamientos',
    tagline: 'Hacemos que tu música llegue lejos',
    backgroundImage: '/images/marquetin-lanzamiento-bg.jpg',
    ambientColor: '#1A1A1A',
    services: [
      { id: 'mkt-1', name: 'Estrategia de lanzamiento', description: 'Plan integral para el lanzamiento de singles, EPs o álbumes.' },
      { id: 'mkt-2', name: 'Campañas publicitarias', description: 'Anuncios digitales en Meta, YouTube y TikTok dirigidos a tu audiencia objetivo.' },
      { id: 'mkt-3', name: 'Gestión de redes sociales', description: 'Creación de contenido y administración de perfiles para construir tu marca artística.' },
      { id: 'mkt-4', name: 'Distribución digital', description: 'Distribución en Spotify, Apple Music, YouTube Music y más de 150 plataformas.' },
    ],
    featuredWorks: [
      {
        id: 'mkt-fw-1',
        title: 'Campaña de lanzamiento — "Horizonte"',
        artist: 'Sofía Delgado',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
      {
        id: 'mkt-fw-2',
        title: 'Viral en TikTok — "El Último Verano"',
        artist: 'Nodo Sur',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
      {
        id: 'mkt-fw-3',
        title: 'Jingle de marca — Campaña nacional',
        artist: 'Cliente confidencial',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Planificamos tu lanzamiento',
        description: 'Definimos fechas, plataformas y mensajes clave para maximizar el impacto del lanzamiento.',
      },
      {
        number: 2,
        title: 'Creamos contenido',
        description: 'Producimos material visual, reels, stories y assets para todas las plataformas digitales.',
      },
      {
        number: 3,
        title: 'Ejecutamos la campaña',
        description: 'Publicamos, administramos anuncios y monitoreamos métricas en tiempo real.',
      },
    ],
    contactAction: {
      label: 'Hablemos',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
  },
  {
    id: 5,
    slug: 'relaciones-artisticas',
    name: 'Relaciones Artísticas',
    tagline: 'Conectamos talentos y creamos oportunidades',
    backgroundImage: '',
    ambientColor: '#2A1A2E',
    services: [
      { id: 'rel-1', name: 'Gestión de colaboraciones', description: 'Coordinamos colaboraciones entre artistas para potenciar el alcance de ambos.' },
      { id: 'rel-2', name: 'Búsqueda de talento', description: 'Identificamos y conectamos talentos emergentes con los proyectos correctos.' },
      { id: 'rel-3', name: 'Networking musical', description: 'Acceso a nuestra red de contactos en la industria: productores, sellos y medios.' },
      { id: 'rel-4', name: 'Asesoría artística', description: 'Orientación estratégica para el desarrollo de carrera artística a largo plazo.' },
    ],
    featuredWorks: [
      {
        id: 'rel-fw-1',
        title: 'Collab "Dos Mundos"',
        artist: 'Andrés Vega ft. Luna Roja',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
      {
        id: 'rel-fw-2',
        title: 'Sesión de networking — Showcase 2024',
        artist: 'Zapata Composiciones',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
      {
        id: 'rel-fw-3',
        title: 'Proyecto conjunto — "Raíces"',
        artist: 'Colectivo Tláloc',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Evaluamos tu perfil',
        description: 'Analizamos tu proyecto artístico, objetivos y el tipo de conexiones que necesitas.',
      },
      {
        number: 2,
        title: 'Buscamos conexiones',
        description: 'Mapeamos nuestra red y encontramos los artistas, productores o sellos ideales para ti.',
      },
      {
        number: 3,
        title: 'Gestionamos la relación',
        description: 'Facilitamos el primer contacto, negociación y seguimiento de la colaboración.',
      },
    ],
    contactAction: {
      label: 'Colaborar',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
  },
  {
    id: 6,
    slug: 'derechos-autor',
    name: 'Derechos de Autor',
    tagline: 'Protegemos tu música, tus ideas y tu futuro',
    backgroundImage: '/images/derechos-autor-bg.jpg',
    ambientColor: '#1A1400',
    services: [
      { id: 'der-1', name: 'Registro de obras', description: 'Tramitamos el registro oficial de tus composiciones ante las sociedades autorizadas.' },
      { id: 'der-2', name: 'Contratos musicales', description: 'Elaboramos y revisamos contratos de edición, licencia, colaboración y distribución.' },
      { id: 'der-3', name: 'Asesoría legal', description: 'Orientación jurídica especializada en propiedad intelectual musical.' },
      { id: 'der-4', name: 'Gestión de regalías', description: 'Administramos la recaudación y liquidación de regalías por derechos de ejecución y reproducción.' },
    ],
    featuredWorks: [
      {
        id: 'der-fw-1',
        title: 'Caso de éxito — Registro internacional',
        artist: 'Cliente anónimo',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
      {
        id: 'der-fw-2',
        title: 'Masterclass derechos digitales',
        artist: 'Zapata Composiciones',
        type: 'visual',
        thumbnailSrc: '',
        linkUrl: '',
      },
      {
        id: 'der-fw-3',
        title: 'Podcast — Cómo proteger tu música',
        artist: 'Emmanuel Segura Zapata',
        type: 'audio',
        audioSrc: '',
        audioCover: '',
      },
    ],
    workProcess: [
      {
        number: 1,
        title: 'Revisamos tus obras',
        description: 'Evaluamos el catálogo de obras y su situación legal actual para detectar riesgos o vacíos.',
      },
      {
        number: 2,
        title: 'Registramos y protegemos',
        description: 'Iniciamos el proceso de registro formal ante las instancias correspondientes.',
      },
      {
        number: 3,
        title: 'Gestionamos los derechos',
        description: 'Administramos licencias, contratos y regalías de forma continua para que tú te enfoque en crear.',
      },
    ],
    contactAction: {
      label: 'Consultar',
      type: 'whatsapp',
      url: WHATSAPP_URL,
    },
    documents: [
      {
        id: 'doc-1',
        title: 'Contrato de composición',
        url: '',
      },
      {
        id: 'doc-2',
        title: 'Acuerdo de colaboración',
        url: '',
      },
      {
        id: 'doc-3',
        title: 'Gestión de derechos',
        url: '',
      },
    ],
  },
]

export function getDepartmentBySlug(slug: string): DepartmentData | undefined {
  return DEPARTMENTS.find((dept) => dept.slug === slug)
}

export function getDepartmentRoute(id: DepartmentId): string {
  const dept = DEPARTMENTS.find((d) => d.id === id)
  if (!dept) {
    throw new Error(`Department with id ${id} not found`)
  }
  return `/department/${dept.slug}`
}
