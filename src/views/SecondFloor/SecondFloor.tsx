import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import styles from './SecondFloor.module.css'

export function SecondFloor() {
  const navigate = useNavigate()
  const [entering, setEntering] = useState<string | null>(null)

  const go = (route: string, key: string) => {
    if (entering) return
    setEntering(key)
    setTimeout(() => navigate(route), 700)
  }

  return (
    <div className={styles.page}>
      {/* Background: escaleras */}
      <motion.div
        className={styles.bg}
        animate={entering ? { scale: 1.1, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/escaleras-mobile-bg.jpg" />
          <img
            src="/images/escaleras-bg.jpg"
            alt="Segundo piso de Zapata Composiciones"
            className={styles.bgImg}
            draggable={false}
          />
        </picture>
        <div className={styles.bgOverlay} />
      </motion.div>

      <AnimatePresence>
        {!entering && (
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.header}>
              <h1 className={styles.title}>SEGUNDO PISO</h1>
              <p className={styles.subtitle}>Selecciona una sala</p>
            </div>

            <div className={styles.roomsGrid}>
              {/* Sala de espera */}
              <motion.button
                className={styles.roomCard}
                onClick={() => go('/sala-espera', 'espera')}
                type="button"
                aria-label="Ir a la sala de espera"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/images/salaespera-bg.jpg"
                  alt="Sala de espera"
                  className={styles.roomImg}
                  loading="lazy"
                />
                <div className={styles.roomOverlay} />
                <div className={styles.roomLabel}>
                  <span className={styles.roomTitle}>SALA DE ESPERA</span>
                  <span className={styles.roomHint}>→ ENTRAR</span>
                </div>
              </motion.button>

              {/* Sala de reuniones */}
              <motion.button
                className={styles.roomCard}
                onClick={() => go('/sala-reuniones', 'reuniones')}
                type="button"
                aria-label="Ir a la sala de reuniones"
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/images/salareuniones-bg.jpg"
                  alt="Sala de reuniones"
                  className={styles.roomImg}
                  loading="lazy"
                />
                <div className={styles.roomOverlay} />
                <div className={styles.roomLabel}>
                  <span className={styles.roomTitle}>SALA DE REUNIONES</span>
                  <span className={styles.roomHint}>→ ENTRAR</span>
                </div>
              </motion.button>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.backBtn}
                onClick={() => navigate('/hallway')}
                type="button"
                aria-label="Bajar al pasillo principal"
              >
                ↓ VOLVER AL PASILLO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
