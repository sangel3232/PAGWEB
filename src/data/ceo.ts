import type { CEOProfile } from '../types'

export const CEO_PROFILE: CEOProfile = {
  name: 'Emmanuel Segura Zapata',
  title: 'Fundador y CEO de Zapata Composiciones',
  photo: '', // placeholder — reemplazar con URL real
  welcomeMessage:
    'Bienvenido a Zapata Composiciones. Soy Emmanuel Segura Zapata, Fundador y CEO de Zapata Composiciones. Mi misión es ayudarte a convertir tus ideas en canciones que conecten con el mundo.',
  signature: '', // placeholder — reemplazar con URL de imagen de firma manuscrita
  stats: [
    { value: '+150', label: 'canciones creadas' },
    { value: '+50', label: 'artistas trabajados' },
    { value: '+30M', label: 'reproducciones' },
  ],
  sections: [
    {
      id: 'historia',
      title: 'Mi historia',
      content:
        'Comenzé en la música desde los 14 años, componiendo mis primeras canciones en una guitarra prestada. Con los años transformé esa pasión en una empresa que hoy ayuda a cientos de artistas a encontrar su voz y llevarla al mundo.',
    },
    {
      id: 'mision',
      title: 'Misión y visión',
      content:
        'Nuestra misión es convertir ideas en canciones profesionales que conecten emocionalmente con el público. Nuestra visión es ser el estudio de referencia en México para artistas que buscan calidad, creatividad y resultados reales.',
    },
    {
      id: 'valores',
      title: 'Valores',
      content:
        'Creatividad, profesionalismo, compromiso y calidad son los pilares de cada proyecto que tomamos. Creemos que cada canción merece ser tratada como una obra de arte.',
    },
    {
      id: 'logros',
      title: 'Logros',
      content:
        'Más de 150 canciones creadas, colaboraciones con artistas internacionales, más de 30 millones de reproducciones acumuladas y presencia en más de 20 países a través de nuestros proyectos musicales.',
    },
  ],
  whatsappUrl: 'https://wa.me/573183592598',
}
