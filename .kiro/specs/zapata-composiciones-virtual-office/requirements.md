# Documento de Requisitos

## Introducción

Zapata Composiciones necesita una presencia web que no sea convencional. En lugar de un sitio con menú de navegación estándar, el visitante vive una **experiencia de oficina virtual inmersiva**: entra por una recepción, recorre un pasillo con puertas numeradas y accede a cada departamento como si estuviera físicamente dentro de una empresa musical real.

La estética es oscura, lujosa y moderna — tonos negros y dorados, iluminación ambiental cálida — para transmitir profesionalismo y creatividad de alto nivel. El sitio debe funcionar en navegadores de escritorio y dispositivos móviles.

---

## Glosario

- **Virtual_Office**: La experiencia web completa que simula un recorrido por las instalaciones físicas de Zapata Composiciones.
- **Reception**: Pantalla de bienvenida que muestra el logo iluminado y el punto de entrada al recorrido.
- **Hallway**: Vista de pasillo con perspectiva visual que contiene las puertas de los departamentos.
- **Door**: Elemento interactivo del Hallway que representa y da acceso a un departamento específico.
- **Department_Office**: Vista interior de un departamento, accesible al activar una Door.
- **Department_Sidebar**: Menú lateral izquierdo persistente que lista los seis departamentos numerados, visible en todas las vistas excepto la Reception.
- **Navigation_System**: Conjunto de controles que permiten al usuario moverse entre Reception, Hallway y Department_Offices.
- **Office_Map**: Vista de plano interactivo que muestra la distribución de todos los departamentos.
- **CEO_Room**: Sección especial dentro del Virtual_Office dedicada al perfil y mensaje del director de la empresa.
- **Featured_Works**: Sección dentro de un Department_Office que expone ejemplos de proyectos reales del departamento con reproductores de audio o miniaturas visuales.
- **Work_Process**: Sección dentro de un Department_Office que describe el flujo de trabajo del departamento mediante pasos numerados.
- **About_Section**: Sección que expone los valores fundacionales de la empresa.
- **Contact_Footer**: Área final con información de contacto directo, enlace de retorno a la Reception y enlaces a redes sociales.
- **Transition**: Animación visual que acompaña el cambio entre vistas del Virtual_Office.

---

## Requisitos

### Requisito 1: Pantalla de Entrada y Recepción

**User Story:** Como visitante nuevo, quiero ver una recepción elegante al llegar al sitio, para sentir que estoy entrando a una empresa musical real de alto nivel.

#### Criterios de Aceptación

1. THE Virtual_Office SHALL mostrar la Reception como la primera vista al cargar la URL raíz del sitio.
2. THE Reception SHALL presentar el logotipo iluminado de Zapata Composiciones centrado en pantalla.
3. THE Reception SHALL incluir un elemento decorativo de disco de oro visible en la composición visual.
4. THE Reception SHALL incluir plantas decorativas como elementos de ambientación del espacio.
5. THE Reception SHALL mostrar un botón de llamada a la acción con el texto "Entrar a la oficina" o "Comenzar recorrido".
6. WHEN el visitante activa el botón de llamada a la acción, THE Navigation_System SHALL ejecutar una Transition hacia la vista del Hallway.
7. IF la URL raíz es accedida en un dispositivo móvil, THEN THE Reception SHALL adaptar su composición visual para ser completamente visible en pantallas de 320px de ancho o más.

---

### Requisito 2: Pasillo con Perspectiva Visual

**User Story:** Como visitante, quiero ver un pasillo con puertas al hacer clic en "Entrar", para sentir que camino por las instalaciones y elijo a qué departamento ir.

#### Criterios de Aceptación

1. THE Hallway SHALL presentarse con una representación visual de perspectiva que simule profundidad espacial.
2. THE Hallway SHALL contener exactamente seis Doors, cada una numerada y etiquetada con el nombre de su departamento correspondiente.
3. THE Hallway SHALL usar la paleta de colores oscura con acentos dorados definida en el sistema de diseño del Virtual_Office.
4. WHEN el visitante posiciona el cursor sobre una Door, THE Door SHALL mostrar una respuesta visual de retroalimentación (resaltado, cambio de escala o efecto de brillo).
5. WHEN el visitante activa una Door, THE Navigation_System SHALL ejecutar una Transition hacia el Department_Office correspondiente.
6. THE Hallway SHALL incluir un control de acceso al Office_Map para que el visitante consulte la distribución completa.
7. IF el Hallway es visualizado en un dispositivo móvil, THEN THE Hallway SHALL reorganizar las Doors en un formato de lista o cuadrícula desplazable que mantenga la estética general.

---

### Requisito 3: Menú Lateral Persistente de Departamentos

**User Story:** Como visitante, quiero un menú lateral siempre visible mientras exploro los departamentos, para poder saltar directamente entre ellos sin tener que volver al pasillo cada vez.

#### Criterios de Aceptación

1. THE Department_Sidebar SHALL estar presente en todas las vistas del Virtual_Office excepto la Reception.
2. THE Department_Sidebar SHALL listar los seis departamentos numerados del 1 al 6 con sus nombres completos: (1) Composición Musical, (2) Proyectos y Remixes, (3) Producción Musical, (4) Marketing y Lanzamientos, (5) Relaciones Artísticas, (6) Derechos de Autor.
3. WHEN el visitante activa un departamento en el Department_Sidebar, THE Navigation_System SHALL ejecutar una Transition directa hacia ese Department_Office sin pasar por el Hallway.
4. WHILE el visitante se encuentra dentro de un Department_Office, THE Department_Sidebar SHALL indicar visualmente cuál departamento está activo resaltándolo con el color de acento dorado.
5. IF el Department_Sidebar es visualizado en un dispositivo móvil, THEN THE Department_Sidebar SHALL colapsarse en un control de acceso compacto que se expande al ser activado, sin obstruir el contenido principal.

---

### Requisito 4: Departamentos — Estructura Interior Común

**User Story:** Como visitante, quiero entrar a la oficina de cada departamento, para conocer en detalle los servicios, ejemplos de trabajo y proceso de Zapata Composiciones.

#### Criterios de Aceptación

1. THE Virtual_Office SHALL proveer un Department_Office independiente para cada uno de los seis departamentos: Composición Musical, Proyectos y Remixes, Producción Musical, Marketing y Lanzamientos, Relaciones Artísticas, y Derechos de Autor.
2. THE Department_Office SHALL presentar el nombre del departamento como encabezado principal de la vista sobre una imagen ambiental de fondo representativa del tipo de trabajo del departamento (estudio de grabación, sala de reuniones, etc.).
3. THE Department_Office SHALL incluir una sección de lista de servicios específicos del departamento con los servicios definidos en el Requisito 5.
4. THE Department_Office SHALL incluir una sección Featured_Works con ejemplos de proyectos reales; los proyectos de audio SHALL presentarse con reproductores de audio reproducibles y los proyectos visuales con miniaturas clicables.
5. THE Department_Office SHALL incluir una sección Work_Process que describa el flujo de trabajo del departamento mediante al menos tres pasos numerados.
6. THE Department_Office SHALL incluir el botón de acción principal de contacto definido para ese departamento en el Requisito 5.
7. WHEN el visitante activa el botón de contacto en un Department_Office, THE Navigation_System SHALL redirigir al visitante al canal de contacto correspondiente (WhatsApp o formulario) en una nueva pestaña del navegador.
8. THE Department_Office SHALL incluir un botón "Volver al pasillo" visible en la parte inferior de la vista.
9. WHEN el visitante activa el botón "Volver al pasillo", THE Navigation_System SHALL ejecutar una Transition de regreso hacia el Hallway.
10. IF el Department_Office es visualizado en un dispositivo móvil, THEN THE Department_Office SHALL presentar todas sus secciones en un flujo vertical desplazable sin pérdida de contenido.

---

### Requisito 5: Contenido Específico por Departamento

**User Story:** Como visitante interesado en un servicio concreto, quiero ver los servicios, proyectos y forma de contacto propios de cada departamento, para evaluar si se ajustan a mis necesidades.

#### Criterios de Aceptación

1. THE Department_Office de Composición Musical SHALL listar los servicios: Composición de canciones, Letras y melodías, Canciones personalizadas, y Asesoría creativa; y SHALL mostrar el botón de acción con el texto "Solicitar servicio".
2. THE Department_Office de Proyectos y Remixes SHALL listar los servicios: Remixes profesionales, Edición de audio, Reversiones, y Proyectos musicales; y SHALL mostrar el botón de acción con el texto "Enviar demo".
3. THE Department_Office de Producción Musical SHALL listar los servicios: Producción musical, Grabación de voces, Mezcla y masterización, y Beats personalizados; y SHALL mostrar el botón de acción con el texto "Iniciar demo".
4. THE Department_Office de Marketing y Lanzamientos SHALL listar los servicios: Estrategia de lanzamiento, Campañas publicitarias, Gestión de redes sociales, y Distribución digital; y SHALL mostrar el botón de acción con el texto "Hablemos".
5. THE Department_Office de Relaciones Artísticas SHALL listar los servicios: Gestión de colaboraciones, Búsqueda de talento, Networking musical, y Asesoría artística; y SHALL mostrar el botón de acción con el texto "Colaborar".
6. THE Department_Office de Derechos de Autor SHALL listar los servicios: Registro de obras, Contratos musicales, Asesoría legal, y Gestión de regalías; SHALL incluir una sección de documentos descargables con: Contrato de composición, Acuerdo de colaboración, y Gestión de derechos; y SHALL mostrar el botón de acción con el texto "Consultar".

---

### Requisito 6: Navegación entre Vistas y Transiciones

**User Story:** Como visitante, quiero que el recorrido por la oficina tenga transiciones fluidas, para que la experiencia se sienta continua y cinematográfica.

#### Criterios de Aceptación

1. THE Navigation_System SHALL gestionar las transiciones entre Reception, Hallway, Department_Offices, CEO_Room y About_Section sin recargar la página completa.
2. WHEN el Navigation_System ejecuta una Transition, THE Transition SHALL completarse en un tiempo máximo de 600ms para animaciones de entrada y salida de vistas.
3. THE Navigation_System SHALL conservar el historial de navegación del navegador de manera que el botón "Atrás" del navegador lleve al visitante a la vista previa dentro del Virtual_Office.
4. WHILE una Transition está en curso, THE Navigation_System SHALL bloquear nuevas interacciones de navegación para evitar estados inconsistentes.
5. IF un visitante accede directamente a la URL de un Department_Office específico, THEN THE Navigation_System SHALL cargar esa vista directamente sin redirigir a la Reception.

---

### Requisito 7: Mapa Interactivo de Oficina

**User Story:** Como visitante, quiero ver un plano de la oficina, para tener una visión general de todos los departamentos y saltar directamente al que me interese.

#### Criterios de Aceptación

1. THE Office_Map SHALL mostrar la distribución de los seis departamentos más la CEO_Room en una representación de plano visual.
2. WHEN el visitante activa un departamento en el Office_Map, THE Navigation_System SHALL ejecutar una Transition hacia el Department_Office correspondiente.
3. THE Office_Map SHALL indicar visualmente cuál es la vista actualmente activa en el Virtual_Office.
4. THE Office_Map SHALL ser accesible desde el Hallway y desde cualquier Department_Office activo.

---

### Requisito 8: Oficina del CEO

**User Story:** Como visitante, quiero conocer al director de la empresa dentro del recorrido, para darle un rostro humano y profesional a Zapata Composiciones.

#### Criterios de Aceptación

1. THE CEO_Room SHALL presentarse como una sección especial accesible desde el Hallway o el Office_Map.
2. THE CEO_Room SHALL mostrar prominentemente el logo de Zapata Composiciones en la parte superior de la vista.
3. THE CEO_Room SHALL identificar al director con su nombre completo Emmanuel Segura Zapata y su cargo Fundador y CEO de Zapata Composiciones, acompañado de fotografía o ilustración.
4. THE CEO_Room SHALL incluir una sección "Sobre mí" con cuatro subsecciones: Mi historia, Misión y visión, Valores, y Logros.
5. THE CEO_Room SHALL mostrar un mensaje de bienvenida personal del CEO dirigido al visitante.
6. THE CEO_Room SHALL presentar las estadísticas destacadas: +150 canciones creadas, +50 artistas trabajados, y +30M reproducciones, con formato visual diferenciado.
7. THE CEO_Room SHALL incluir la firma manuscrita del CEO como elemento visual de autenticidad.
8. THE CEO_Room SHALL incluir un botón con el texto "Hablemos directo" que abra una conversación de WhatsApp con el número de contacto del CEO en una nueva pestaña del navegador.
9. THE CEO_Room SHALL mantener la estética visual oscura y lujosa consistente con el resto del Virtual_Office.

---

### Requisito 9: Sección "Acerca de" — Valores de la Empresa

**User Story:** Como visitante, quiero conocer los valores de Zapata Composiciones, para entender la filosofía detrás de sus servicios.

#### Criterios de Aceptación

1. THE About_Section SHALL presentar los cuatro valores fundacionales de la empresa: Profesionalismo, Creatividad, Compromiso y Calidad.
2. THE About_Section SHALL representar cada valor con un ícono o elemento visual diferenciador y una descripción breve.
3. THE About_Section SHALL ser accesible desde el Hallway o el Office_Map sin salir del Virtual_Office.
4. THE About_Section SHALL incluir un control de retorno al Hallway.

---

### Requisito 10: Footer de Contacto y Redes Sociales

**User Story:** Como visitante, quiero encontrar fácilmente cómo contactar a Zapata Composiciones y seguirlos en redes sociales, para poder comunicarme o mantenerme al tanto de su trabajo.

#### Criterios de Aceptación

1. THE Contact_Footer SHALL estar presente en todas las vistas del Virtual_Office excepto la Reception.
2. THE Contact_Footer SHALL incluir en la esquina inferior izquierda un enlace con el texto "Recepción / Volver al inicio" que ejecute una Transition de regreso hacia la Reception.
3. THE Contact_Footer SHALL incluir un enlace funcional a WhatsApp que abra una conversación directa con el número de contacto de la empresa.
4. THE Contact_Footer SHALL incluir un enlace funcional a la dirección de correo electrónico de la empresa.
5. THE Contact_Footer SHALL incluir un enlace al sitio web externo de la empresa si aplica.
6. THE Contact_Footer SHALL incluir enlaces funcionales a los perfiles de Instagram, YouTube, TikTok y Spotify de Zapata Composiciones.
7. WHEN el visitante activa un enlace de red social o contacto en el Contact_Footer, THE Contact_Footer SHALL abrir el destino en una nueva pestaña del navegador.
8. THE Contact_Footer SHALL mostrar el texto de copyright "Zapata Composiciones © 2025 | Todos los derechos reservados".

---

### Requisito 11: Sistema de Diseño Visual

**User Story:** Como cliente, quiero que toda la experiencia tenga una identidad visual coherente, lujosa y musical, para que refleje la calidad de Zapata Composiciones.

#### Criterios de Aceptación

1. THE Virtual_Office SHALL aplicar una paleta de colores basada en negro profundo (#0A0A0A o equivalente) como color de fondo dominante.
2. THE Virtual_Office SHALL usar el dorado (#C9A84C o equivalente) como color de acento principal para resaltar elementos interactivos, bordes y tipografía destacada.
3. THE Virtual_Office SHALL usar tipografía serif o display de alta legibilidad para títulos y sans-serif limpia para textos descriptivos.
4. THE Virtual_Office SHALL aplicar iluminación ambiental cálida simulada mediante gradientes y sombras en todos los espacios decorativos.
5. THE Virtual_Office SHALL incluir elementos decorativos musicales (discos de oro, instrumentos, notas) como parte del ambiente visual de los espacios.
6. IF un elemento interactivo no es inmediatamente reconocible como clickeable, THEN THE Virtual_Office SHALL aplicar una señal visual adicional (flecha, texto de ayuda o animación) para guiar al visitante.

---

### Requisito 12: Rendimiento y Accesibilidad

**User Story:** Como visitante, quiero que la página cargue rápido y que pueda usarla correctamente, para no abandonar la experiencia por problemas técnicos.

#### Criterios de Aceptación

1. THE Virtual_Office SHALL cargar la vista inicial (Reception) en menos de 3 segundos en una conexión de banda ancha estándar (≥10 Mbps).
2. THE Virtual_Office SHALL ser navegable completamente mediante teclado, de manera que cada Door, botón y control de navegación sea accesible sin ratón.
3. THE Virtual_Office SHALL proveer texto alternativo descriptivo para todos los elementos visuales no decorativos.
4. THE Virtual_Office SHALL mantener una relación de contraste de color mínima de 4.5:1 entre el texto principal y su fondo, según las pautas WCAG 2.1 nivel AA.
5. WHILE el contenido multimedia o recursos pesados se cargan en segundo plano, THE Virtual_Office SHALL mostrar un indicador de carga visual consistente con la estética de la experiencia.
6. IF el navegador del visitante no soporta las tecnologías de animación utilizadas, THEN THE Virtual_Office SHALL presentar una versión de respaldo funcional que permita el acceso a todos los departamentos.
