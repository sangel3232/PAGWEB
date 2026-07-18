// Guided conversation flows for each department
// Each step collects specific information progressively

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'file' | 'audio' | 'select'

export interface ConversationStep {
  id: string
  assistantMessage: string
  fieldType: FieldType
  fieldLabel: string
  placeholder: string
  required: boolean
  options?: string[]          // for 'select' type
  accepts?: string            // for 'file'/'audio' type
  dataKey: keyof FlowData     // maps to FlowData field
}

export interface FlowData {
  clientName?: string
  clientPhone?: string
  clientEmail?: string
  workTitle?: string
  lyrics?: string
  audioFile?: File
  attachments?: File[]
  genre?: string
  artistName?: string
  projectDescription?: string
  budget?: string
  deadline?: string
  serviceType?: string
  message?: string
  appointmentDate?: string
  observations?: string
}

export interface DepartmentFlow {
  slug: string
  name: string
  greeting: string
  steps: ConversationStep[]
  farewell: string
}

export const FLOWS: Record<string, DepartmentFlow> = {

  'composicion-musical': {
    slug: 'composicion-musical',
    name: 'Composición Musical',
    greeting: '¡Bienvenido a Composición Musical! Soy tu asistente virtual. Voy a guiarte para que podamos crear la canción perfecta para ti. ¿Comenzamos?',
    farewell: '¡Excelente! He recibido toda la información. Nuestro equipo de compositores la revisará y te contactará en menos de 24 horas. ¡Gracias por confiar en Zapata Composiciones!',
    steps: [
      {
        id: 'name',
        assistantMessage: 'Primero, ¿cuál es tu nombre completo?',
        fieldType: 'text',
        fieldLabel: 'Nombre completo',
        placeholder: 'Ej: María García López',
        required: true,
        dataKey: 'clientName',
      },
      {
        id: 'email',
        assistantMessage: 'Perfecto, {{clientName}}. ¿Cuál es tu correo electrónico?',
        fieldType: 'email',
        fieldLabel: 'Correo electrónico',
        placeholder: 'tu@correo.com',
        required: true,
        dataKey: 'clientEmail',
      },
      {
        id: 'phone',
        assistantMessage: '¿Y tu número de teléfono o WhatsApp?',
        fieldType: 'tel',
        fieldLabel: 'Teléfono / WhatsApp',
        placeholder: '+57 300 000 0000',
        required: true,
        dataKey: 'clientPhone',
      },
      {
        id: 'service',
        assistantMessage: '¿Qué tipo de composición necesitas?',
        fieldType: 'select',
        fieldLabel: 'Tipo de servicio',
        placeholder: 'Selecciona una opción',
        required: true,
        options: ['Canción original desde cero', 'Letra para melodía existente', 'Canción personalizada para evento', 'Jingle publicitario', 'Asesoría creativa'],
        dataKey: 'serviceType',
      },
      {
        id: 'title',
        assistantMessage: '¿Tienes ya un título o nombre tentativo para la obra?',
        fieldType: 'text',
        fieldLabel: 'Título de la obra',
        placeholder: 'Ej: "Mi historia" o "Sin título por ahora"',
        required: true,
        dataKey: 'workTitle',
      },
      {
        id: 'description',
        assistantMessage: '¡Qué bonito título! Ahora cuéntame: ¿de qué trata la canción? ¿Qué historia o mensaje quieres transmitir?',
        fieldType: 'textarea',
        fieldLabel: 'Descripción e idea',
        placeholder: 'Describe el tema, el mensaje principal, el ambiente que buscas...',
        required: true,
        dataKey: 'projectDescription',
      },
      {
        id: 'genre',
        assistantMessage: '¿Qué género musical prefieres?',
        fieldType: 'select',
        fieldLabel: 'Género musical',
        placeholder: 'Selecciona un género',
        required: true,
        options: ['Pop', 'Balada', 'Reggaeton / Urbano', 'Rock', 'R&B / Soul', 'Cumbia', 'Vallenato', 'Jazz', 'Otro'],
        dataKey: 'genre',
      },
      {
        id: 'audio',
        assistantMessage: '¿Tienes alguna referencia de audio o demo que quieras compartir? (Opcional)',
        fieldType: 'audio',
        fieldLabel: 'Audio de referencia',
        placeholder: 'Sube un archivo MP3, M4A o WAV (opcional)',
        required: false,
        accepts: 'audio/*',
        dataKey: 'audioFile',
      },
      {
        id: 'message',
        assistantMessage: '¿Hay algo más que quieras que sepamos antes de comenzar?',
        fieldType: 'textarea',
        fieldLabel: 'Comentarios adicionales',
        placeholder: 'Fecha límite, presupuesto aproximado, observaciones...',
        required: false,
        dataKey: 'message',
      },
    ],
  },

  'produccion-musical': {
    slug: 'produccion-musical',
    name: 'Producción Musical',
    greeting: '¡Bienvenido a Producción Musical! Estás en el lugar indicado para llevar tu música al siguiente nivel. Te haré algunas preguntas para entender tu proyecto.',
    farewell: '¡Perfecto! Tu solicitud de producción ha sido registrada. Nuestro productor principal te contactará pronto para coordinar tu sesión. ¡El sonido que imaginas está a punto de hacerse realidad!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre o nombre artístico?', fieldType: 'text', fieldLabel: 'Nombre / Nombre artístico', placeholder: 'Tu nombre o alias', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: 'Excelente, ¿cuál es tu correo electrónico?', fieldType: 'email', fieldLabel: 'Correo electrónico', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Tu número de contacto?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Qué servicio de producción necesitas?', fieldType: 'select', fieldLabel: 'Servicio', placeholder: 'Selecciona', required: true, options: ['Producción completa', 'Grabación de voces', 'Mezcla y masterización', 'Beat personalizado', 'Arreglos musicales'], dataKey: 'serviceType' },
      { id: 'title', assistantMessage: '¿Cuál es el título del proyecto o canción?', fieldType: 'text', fieldLabel: 'Título del proyecto', placeholder: 'Nombre de la canción o álbum', required: true, dataKey: 'workTitle' },
      { id: 'genre', assistantMessage: '¿Qué género musical es tu proyecto?', fieldType: 'select', fieldLabel: 'Género', placeholder: 'Selecciona', required: true, options: ['Pop', 'Urbano / Reggaeton', 'Trap', 'R&B', 'Rock', 'Electrónica', 'Cumbia', 'Salsa', 'Otro'], dataKey: 'genre' },
      { id: 'description', assistantMessage: 'Cuéntame más sobre el sonido que buscas. ¿Tienes referencias de artistas o canciones?', fieldType: 'textarea', fieldLabel: 'Descripción del proyecto', placeholder: 'Describe el sonido, los artistas de referencia, el estado actual del proyecto...', required: true, dataKey: 'projectDescription' },
      { id: 'audio', assistantMessage: '¿Tienes un demo, maqueta o pista existente para compartir?', fieldType: 'audio', fieldLabel: 'Demo / Maqueta', placeholder: 'Sube tu archivo de audio (MP3, WAV, M4A)', required: false, accepts: 'audio/*', dataKey: 'audioFile' },
      { id: 'deadline', assistantMessage: '¿Tienes una fecha límite para el proyecto?', fieldType: 'text', fieldLabel: 'Fecha deseada de entrega', placeholder: 'Ej: Finales de agosto 2025', required: false, dataKey: 'deadline' },
      { id: 'message', assistantMessage: '¿Algún comentario o requerimiento especial?', fieldType: 'textarea', fieldLabel: 'Observaciones', placeholder: 'Presupuesto, formato de entrega, otros detalles...', required: false, dataKey: 'message' },
    ],
  },

  'proyectos-remixes': {
    slug: 'proyectos-remixes',
    name: 'Proyectos y Remixes',
    greeting: '¡Hola! Bienvenido al área de Proyectos y Remixes. Aquí transformamos tu música en algo único. Cuéntame qué tienes en mente.',
    farewell: '¡Genial! Recibimos tu solicitud. Nuestro equipo técnico analizará tu material y te dará una propuesta en las próximas 24 horas. ¡Prepárate para algo increíble!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre?', fieldType: 'text', fieldLabel: 'Nombre', placeholder: 'Tu nombre', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: '¿Tu correo electrónico?', fieldType: 'email', fieldLabel: 'Email', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Número de contacto?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Qué tipo de proyecto necesitas?', fieldType: 'select', fieldLabel: 'Tipo de proyecto', placeholder: 'Selecciona', required: true, options: ['Remix profesional', 'Edición y limpieza de audio', 'Nueva versión / Cover', 'Proyecto discográfico completo', 'Stem mixing'], dataKey: 'serviceType' },
      { id: 'title', assistantMessage: '¿Cuál es el nombre de la canción o proyecto a trabajar?', fieldType: 'text', fieldLabel: 'Título', placeholder: 'Nombre de la canción', required: true, dataKey: 'workTitle' },
      { id: 'description', assistantMessage: '¿Qué quieres lograr con este remix o proyecto? ¿A qué género quieres llevarlo?', fieldType: 'textarea', fieldLabel: 'Descripción del proyecto', placeholder: 'Explica el resultado que esperas, el género destino, referencias...', required: true, dataKey: 'projectDescription' },
      { id: 'audio', assistantMessage: 'Necesito que subas el audio original o stems del proyecto.', fieldType: 'audio', fieldLabel: 'Audio original', placeholder: 'Sube el archivo (MP3, WAV, ZIP con stems)', required: true, accepts: 'audio/*,.zip', dataKey: 'audioFile' },
      { id: 'message', assistantMessage: '¿Alguna instrucción o detalle adicional?', fieldType: 'textarea', fieldLabel: 'Instrucciones adicionales', placeholder: 'BPM objetivo, key, referencias de mezcla...', required: false, dataKey: 'message' },
    ],
  },

  'marketing-lanzamientos': {
    slug: 'marketing-lanzamientos',
    name: 'Marketing y Lanzamientos',
    greeting: '¡Bienvenido a Marketing y Lanzamientos! Aquí haremos que tu música llegue a todo el mundo. Vamos a diseñar tu estrategia juntos.',
    farewell: '¡Excelente! Tu propuesta de lanzamiento fue registrada. Nuestro equipo de marketing te enviará una propuesta personalizada en las próximas 48 horas. ¡Tu música va a brillar!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre o nombre artístico?', fieldType: 'text', fieldLabel: 'Nombre artístico', placeholder: 'Tu nombre o alias', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: '¿Tu correo electrónico?', fieldType: 'email', fieldLabel: 'Email', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Número de contacto?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Qué servicio de marketing necesitas?', fieldType: 'select', fieldLabel: 'Servicio', placeholder: 'Selecciona', required: true, options: ['Estrategia de lanzamiento completa', 'Campaña publicitaria digital', 'Distribución digital', 'Gestión de redes sociales', 'Pitching a playlists', 'Press release y medios'], dataKey: 'serviceType' },
      { id: 'title', assistantMessage: '¿Cuál es el título del single, EP o álbum a lanzar?', fieldType: 'text', fieldLabel: 'Título del lanzamiento', placeholder: 'Nombre de la canción o proyecto', required: true, dataKey: 'workTitle' },
      { id: 'description', assistantMessage: '¿Cuál es el mensaje principal de tu lanzamiento? ¿A qué audiencia va dirigido?', fieldType: 'textarea', fieldLabel: 'Descripción del proyecto', placeholder: 'Target, mensaje, plataformas prioritarias, presupuesto estimado...', required: true, dataKey: 'projectDescription' },
      { id: 'deadline', assistantMessage: '¿Cuándo planeas hacer el lanzamiento?', fieldType: 'text', fieldLabel: 'Fecha de lanzamiento', placeholder: 'Ej: 15 de septiembre de 2025', required: true, dataKey: 'deadline' },
      { id: 'audio', assistantMessage: '¿Puedes compartir el audio del lanzamiento? (Opcional)', fieldType: 'audio', fieldLabel: 'Audio del lanzamiento', placeholder: 'Sube tu canción (MP3, WAV)', required: false, accepts: 'audio/*', dataKey: 'audioFile' },
      { id: 'message', assistantMessage: '¿Algún detalle adicional sobre tu visión artística o presupuesto?', fieldType: 'textarea', fieldLabel: 'Comentarios', placeholder: 'Presupuesto, inspiraciones visuales, colaboraciones...', required: false, dataKey: 'message' },
    ],
  },

  'relaciones-artisticas': {
    slug: 'relaciones-artisticas',
    name: 'Relaciones Artísticas',
    greeting: '¡Bienvenido a Relaciones Artísticas! Aquí conectamos talentos y creamos oportunidades únicas. Cuéntame sobre ti y lo que buscas.',
    farewell: '¡Excelente! Tu perfil ha sido registrado. Un asesor artístico se pondrá en contacto contigo para explorar las mejores oportunidades. ¡El mundo necesita escucharte!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre artístico o nombre real?', fieldType: 'text', fieldLabel: 'Nombre artístico', placeholder: 'Nombre o alias', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: '¿Tu correo electrónico?', fieldType: 'email', fieldLabel: 'Email', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Número de contacto?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Qué tipo de relación artística buscas?', fieldType: 'select', fieldLabel: 'Tipo de servicio', placeholder: 'Selecciona', required: true, options: ['Busco colaboración con artistas', 'Busco productor para mi proyecto', 'Networking y conexiones en la industria', 'Asesoría para desarrollo de carrera', 'Búsqueda de sello discográfico'], dataKey: 'serviceType' },
      { id: 'description', assistantMessage: '¿Cuéntame sobre tu proyecto artístico y qué estás buscando lograr?', fieldType: 'textarea', fieldLabel: 'Tu proyecto artístico', placeholder: 'Género, trayectoria, metas, lo que buscas...', required: true, dataKey: 'projectDescription' },
      { id: 'audio', assistantMessage: '¿Tienes material musical para compartir?', fieldType: 'audio', fieldLabel: 'Muestra musical', placeholder: 'Sube un audio representativo de tu trabajo', required: false, accepts: 'audio/*', dataKey: 'audioFile' },
      { id: 'message', assistantMessage: '¿Algo más que quieras que sepamos sobre tu carrera?', fieldType: 'textarea', fieldLabel: 'Información adicional', placeholder: 'Logros, colaboraciones anteriores, links a redes sociales...', required: false, dataKey: 'message' },
    ],
  },

  'derechos-autor': {
    slug: 'derechos-autor',
    name: 'Derechos de Autor',
    greeting: '¡Bienvenido a la oficina de Derechos de Autor! Aquí protegeremos tu música y tu legado. Vamos a recopilar la información necesaria para tu registro.',
    farewell: '¡Tu solicitud de registro ha sido recibida! Nuestro equipo legal la procesará y te informará sobre los pasos a seguir. Recuerda que proteger tu obra es proteger tu futuro. ¡Gracias!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre completo (tal como aparecerá en el registro)?', fieldType: 'text', fieldLabel: 'Nombre completo legal', placeholder: 'Nombre y apellidos completos', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: '¿Tu correo electrónico?', fieldType: 'email', fieldLabel: 'Email', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Número de contacto?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Qué servicio legal necesitas?', fieldType: 'select', fieldLabel: 'Servicio', placeholder: 'Selecciona', required: true, options: ['Registro de obra musical', 'Revisión de contrato discográfico', 'Contrato de colaboración artística', 'Gestión de regalías', 'Asesoría legal general', 'Licenciamiento de obra'], dataKey: 'serviceType' },
      { id: 'title', assistantMessage: '¿Cuál es el título de la obra que deseas registrar o proteger?', fieldType: 'text', fieldLabel: 'Título de la obra', placeholder: 'Nombre exacto de la canción o álbum', required: true, dataKey: 'workTitle' },
      { id: 'lyrics', assistantMessage: '¿Puedes escribir o pegar la letra de la obra? (Si aplica)', fieldType: 'textarea', fieldLabel: 'Letra de la obra', placeholder: 'Copia aquí la letra completa...', required: false, dataKey: 'lyrics' },
      { id: 'audio', assistantMessage: '¿Tienes el audio de la obra para adjuntar al registro?', fieldType: 'audio', fieldLabel: 'Audio de la obra', placeholder: 'Sube el archivo de audio (MP3, WAV)', required: false, accepts: 'audio/*', dataKey: 'audioFile' },
      { id: 'attachments', assistantMessage: '¿Tienes contratos, documentos o archivos adicionales para adjuntar?', fieldType: 'file', fieldLabel: 'Documentos adjuntos', placeholder: 'PDF, DOC, imágenes (opcional)', required: false, accepts: '.pdf,.doc,.docx,.jpg,.png', dataKey: 'attachments' },
      { id: 'message', assistantMessage: '¿Alguna observación o contexto legal adicional que debamos conocer?', fieldType: 'textarea', fieldLabel: 'Observaciones', placeholder: 'Situación legal actual, disputas, acuerdos previos...', required: false, dataKey: 'message' },
    ],
  },

  'ceo': {
    slug: 'ceo',
    name: 'Oficina del CEO',
    greeting: '¡Bienvenido a la Oficina del CEO! Soy el asistente de Emmanuel Segura Zapata. Para agendar una reunión o presentar una propuesta de alto nivel, necesito algunos datos.',
    farewell: '¡Excelente! Tu solicitud ha llegado directamente a la agenda del CEO. Emmanuel o su equipo se pondrán en contacto contigo dentro de las próximas 24 horas. ¡Gracias por tu confianza!',
    steps: [
      { id: 'name', assistantMessage: '¿Cuál es tu nombre completo?', fieldType: 'text', fieldLabel: 'Nombre completo', placeholder: 'Tu nombre y apellidos', required: true, dataKey: 'clientName' },
      { id: 'email', assistantMessage: '¿Tu correo electrónico?', fieldType: 'email', fieldLabel: 'Email', placeholder: 'tu@correo.com', required: true, dataKey: 'clientEmail' },
      { id: 'phone', assistantMessage: '¿Número de contacto directo?', fieldType: 'tel', fieldLabel: 'Teléfono', placeholder: '+57 300 000 0000', required: true, dataKey: 'clientPhone' },
      { id: 'service', assistantMessage: '¿Cuál es el motivo de tu solicitud?', fieldType: 'select', fieldLabel: 'Motivo', placeholder: 'Selecciona', required: true, options: ['Agendar reunión presencial', 'Propuesta de inversión o partnership', 'Propuesta de colaboración artística', 'Consulta ejecutiva', 'Otro'], dataKey: 'serviceType' },
      { id: 'description', assistantMessage: '¿Puedes describir brevemente tu propuesta o el tema de la reunión?', fieldType: 'textarea', fieldLabel: 'Descripción de la propuesta', placeholder: 'Describe el objetivo, el contexto y lo que esperas de la reunión...', required: true, dataKey: 'projectDescription' },
      { id: 'deadline', assistantMessage: '¿Tienes alguna preferencia de fecha y hora para la reunión?', fieldType: 'text', fieldLabel: 'Fecha y hora preferida', placeholder: 'Ej: Martes 20 de agosto, entre 10am y 2pm', required: false, dataKey: 'deadline' },
      { id: 'attachments', assistantMessage: '¿Deseas adjuntar algún documento, presentación o portafolio?', fieldType: 'file', fieldLabel: 'Documentos adjuntos', placeholder: 'PDF, PPT, DOCX (opcional)', required: false, accepts: '.pdf,.ppt,.pptx,.doc,.docx', dataKey: 'attachments' },
      { id: 'message', assistantMessage: '¿Hay algo más que Emmanuel deba saber antes de la reunión?', fieldType: 'textarea', fieldLabel: 'Mensaje adicional', placeholder: 'Contexto adicional, urgencia, referencias...', required: false, dataKey: 'message' },
    ],
  },
}

export function getFlow(slug: string): DepartmentFlow | undefined {
  return FLOWS[slug]
}
