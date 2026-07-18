import { useNavigate } from 'react-router-dom'
import { TransitionWrapper } from '../../components/TransitionWrapper/TransitionWrapper'
import { COMPANY_VALUES } from '../../data/company'
import styles from './AboutSection.module.css'

// SVG icons for each value
function StarIcon() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 016-6z" />
    </svg>
  )
}

function HandshakeIcon() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M2 8.5l10 6.5 10-6.5" />
    </svg>
  )
}

const ICON_MAP: Record<string, React.ReactElement> = {
  star: <StarIcon />,
  lightbulb: <LightbulbIcon />,
  handshake: <HandshakeIcon />,
  diamond: <DiamondIcon />,
}

export function AboutSection() {
  const navigate = useNavigate()

  return (
    <TransitionWrapper variant="fade">
      <div className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.tagline}>Acerca de nosotros</div>
          <h1 className={styles.title}>Zapata Composiciones</h1>
          <p className={styles.subtitle}>
            Somos una empresa dedicada a la creación, producción y desarrollo de
            proyectos musicales de alta calidad. Nuestro objetivo es convertir tus
            ideas en canciones que conecten con el mundo.
          </p>
        </header>

        {/* Values section */}
        <section className={styles.valuesSection} aria-labelledby="values-heading">
          <h2 className={styles.valuesTitle} id="values-heading">
            Nuestros valores
          </h2>
          <div className={styles.valuesGrid}>
            {COMPANY_VALUES.map((value) => (
              <article key={value.id} className={styles.valueCard}>
                <div className={styles.valueIcon} aria-hidden="true">
                  {ICON_MAP[value.icon] ?? <StarIcon />}
                </div>
                <h3 className={styles.valueName}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Mission strip */}
        <div className={styles.missionStrip}>
          <blockquote className={styles.missionQuote}>
            "Nuestra misión es ayudar a artistas a convertir ideas en canciones
            profesionales que conecten emocionalmente con su audiencia."
          </blockquote>
          <cite className={styles.missionAuthor}>
            — Emmanuel Segura Zapata, Fundador y CEO
          </cite>
        </div>

        {/* Back button */}
        <div className={styles.backWrapper}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/hallway')}
            type="button"
            aria-label="Volver al pasillo principal"
          >
            ← Volver al pasillo
          </button>
        </div>
      </div>
    </TransitionWrapper>
  )
}
