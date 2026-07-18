import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import styles from './Exterior.module.css'

function isDay(): boolean {
  const h = new Date().getHours()
  return h >= 6 && h < 19
}

export function Exterior() {
  const navigate = useNavigate()
  const day = useMemo(() => isDay(), [])
  const [entering, setEntering] = useState(false)

  const desktopBgSrc = day
    ? '/images/vistaexteriordia-bg.jpg'
    : '/images/vistaexteriornoche-bg.jpg'

  const mobileBgSrc = day
    ? '/images/vistaexteriordia-mobile-bg.jpg'
    : '/images/vistaexteriornoche-mobile-bg.jpg'

  const bgAlt = day
    ? 'Vista exterior diurna de Zapata Composiciones'
    : 'Vista exterior nocturna de Zapata Composiciones'

  const handleEnter = () => {
    if (entering) return
    setEntering(true)
    setTimeout(() => navigate('/reception'), 900)
  }

  return (
    <main
      className={styles.page}
      aria-label="Entrada exterior a Zapata Composiciones"
      onClick={!entering ? handleEnter : undefined}
    >
      {/* ── Background with zoom ── */}
      <motion.div
        className={styles.bgWrapper}
        animate={entering ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={entering
          ? { duration: 0.85, ease: [0.4, 0, 0.2, 1] }
          : { duration: 0 }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileBgSrc} />
          <img src={desktopBgSrc} alt={bgAlt} className={styles.bgImg} draggable={false} loading="eager" />
        </picture>
        {/* Very subtle overlay — keep image crisp */}
        <div className={styles.overlay} />
      </motion.div>

      {/* ── Day/Night badge (top right) ── */}
      <div className={styles.timeBadge} aria-label={day ? 'Vista de día' : 'Vista de noche'}>
        <span aria-hidden="true">{day ? '☀️' : '🌙'}</span>
        <span>{day ? 'DÍA' : 'NOCHE'}</span>
      </div>

      {/* ── UI layer ── */}
      <div className={styles.uiLayer}>
        <AnimatePresence>
          {!entering && (
            <motion.div
              className={styles.contentLayout}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* "BIENVENIDO A" — sits just above the building sign */}
              <p className={styles.welcomeLabel}>BIENVENIDO A</p>

              {/* Spacer that pushes content down below the building sign */}
              <div className={styles.signSpacer} aria-hidden="true" />

              {/* "OFICINA VIRTUAL" — highlighted below the sign */}
              <p className={styles.officeLabel}>OFICINA VIRTUAL</p>

              {/* ↓ hint + button stacked */}
              <div className={styles.ctaGroup}>
                <p className={styles.hint}>
                  ↓ Toca para comenzar el recorrido
                </p>
                <motion.button
                  className={styles.enterBtn}
                  onClick={(e) => { e.stopPropagation(); handleEnter() }}
                  type="button"
                  aria-label="Entrar a Zapata Composiciones"
                  whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(201,168,76,0.7)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.enterIcon} aria-hidden="true">→</span>
                  ENTRAR
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading dots */}
        <AnimatePresence>
          {entering && (
            <motion.div
              className={styles.dots}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="status"
              aria-live="polite"
            >
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
