import { motion, AnimatePresence } from 'motion/react'
import { useAmbientAudio } from '../../hooks/useAmbientAudio'
import styles from './AmbientAudioButton.module.css'

export function AmbientAudioButton() {
  const { isMuted, isReady, toggleMute } = useAmbientAudio()

  return (
    <motion.button
      className={`${styles.btn} ${!isMuted ? styles.btnActive : ''}`}
      onClick={toggleMute}
      type="button"
      aria-label={isMuted ? 'Activar música de ambiente' : 'Silenciar música de ambiente'}
      title={isMuted ? 'Activar música' : 'Silenciar música'}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isReady ? 1 : 0.5, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sound wave bars */}
      <span className={styles.bars} aria-hidden="true">
        <span className={`${styles.bar} ${!isMuted ? styles.barAnimate : ''}`} style={{ '--h': '60%' } as React.CSSProperties} />
        <span className={`${styles.bar} ${!isMuted ? styles.barAnimate : ''}`} style={{ '--h': '100%', '--delay': '0.15s' } as React.CSSProperties} />
        <span className={`${styles.bar} ${!isMuted ? styles.barAnimate : ''}`} style={{ '--h': '40%', '--delay': '0.3s' } as React.CSSProperties} />
        <span className={`${styles.bar} ${!isMuted ? styles.barAnimate : ''}`} style={{ '--h': '80%', '--delay': '0.1s' } as React.CSSProperties} />
      </span>

      <AnimatePresence mode="wait">
        {isMuted
          ? <motion.span key="off" className={styles.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              Música
            </motion.span>
          : <motion.span key="on" className={styles.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              ♪ Sonando
            </motion.span>
        }
      </AnimatePresence>
    </motion.button>
  )
}
