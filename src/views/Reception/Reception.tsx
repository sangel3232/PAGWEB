import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useAmbientAudio } from '../../hooks/useAmbientAudio'
import styles from './Reception.module.css'

export function Reception() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'gone'>('idle')
  const { startPlayback } = useAmbientAudio()

  const handleEnter = () => {
    if (phase !== 'idle') return
    startPlayback()
    setPhase('zoom')
    setTimeout(() => navigate('/hallway'), 1100)
  }

  return (
    <main className={styles.page} aria-label="Recepción de Zapata Composiciones">

      {/* ── Background: drive-in zoom on enter ── */}
      <motion.div
        className={styles.bg}
        animate={
          phase === 'zoom'
            ? { scale: 1.25, opacity: 0, filter: 'blur(6px)' }
            : { scale: 1, opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      >
        <img
          src="/images/reception-bg.jpg"
          alt="Recepción de Zapata Composiciones"
          className={styles.bgImg}
          draggable={false}
        />
        {/* Bottom gradient only — keep top crisp */}
        <div className={styles.bgGradient} />
      </motion.div>

      {/* ── Single premium CTA ── */}
      <div className={styles.centerStage}>
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.div
              className={styles.ctaWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.button
                className={styles.premiumBtn}
                onClick={handleEnter}
                type="button"
                aria-label="Entrar a la oficina de Zapata Composiciones"
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 0 60px rgba(201,168,76,0.55), 0 0 120px rgba(201,168,76,0.2)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {/* Animated border */}
                <span className={styles.btnBorderTop}    aria-hidden="true" />
                <span className={styles.btnBorderBottom} aria-hidden="true" />
                <span className={styles.btnBorderLeft}   aria-hidden="true" />
                <span className={styles.btnBorderRight}  aria-hidden="true" />

                <span className={styles.btnInner}>
                  <span className={styles.btnIcon} aria-hidden="true">→</span>
                  <span className={styles.btnText}>ENTRAR A LA OFICINA</span>
                </span>
              </motion.button>

              {/* Subtle back link */}
              <motion.button
                className={styles.exitLink}
                onClick={() => navigate('/')}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                ← Salir
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drive-in indicator */}
        <AnimatePresence>
          {phase === 'zoom' && (
            <motion.div
              className={styles.entering}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="status"
              aria-live="polite"
            >
              <span className={styles.eDot} />
              <span className={styles.eDot} />
              <span className={styles.eDot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
