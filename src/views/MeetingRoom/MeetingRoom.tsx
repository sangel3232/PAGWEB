import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import styles from './MeetingRoom.module.css'

export function MeetingRoom() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = e.currentTarget.clientWidth / 2
    const cy = e.currentTarget.clientHeight / 2
    setOffset({ x: ((e.clientX - cx) / cx) * 12, y: ((e.clientY - cy) / cy) * 5 })
  }, [])
  const handleMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return
    setOffset({ x: (e.touches[0].clientX - touchRef.current.x) * 0.3, y: (e.touches[0].clientY - touchRef.current.y) * 0.15 })
  }, [])
  const handleTouchEnd = useCallback(() => { touchRef.current = null; setOffset({ x: 0, y: 0 }) }, [])

  return (
    <div
      className={styles.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className={styles.bg}
        animate={{ x: -offset.x, y: -offset.y }}
        transition={{ x: { duration: 0.65, ease: 'easeOut' }, y: { duration: 0.65, ease: 'easeOut' } }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/salareuniones-mobile-bg.svg" />
          <img src="/images/salareuniones-bg.jpg" alt="Sala de reuniones" className={styles.bgImg} draggable={false} />
        </picture>
        <div className={styles.bgVignette} />
      </motion.div>

      <p className={styles.lookHint} aria-hidden="true">↔ Mueve el mouse para explorar</p>

      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            className={styles.hotspotBtn}
            style={{ left: '48%', top: '52%' }}
            onClick={() => setPanelOpen(true)}
            type="button"
            aria-label="Ver información de la Sala de Reuniones"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.4, duration: 0.35, ease: 'backOut' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={styles.hotspotRing}  aria-hidden="true" />
            <span className={styles.hotspotRing2} aria-hidden="true" />
            <span className={styles.hotspotCore}  aria-hidden="true" />
            <span className={styles.hotspotTooltip} role="tooltip">Toca para explorar</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className={styles.infoPanel}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button className={styles.closeBtn} onClick={() => setPanelOpen(false)} type="button" aria-label="Cerrar">✕</button>

            <div className={styles.panelHeader}>
              <span className={styles.floorBadge}>SEGUNDO PISO</span>
              <h1 className={styles.roomTitle}>SALA DE REUNIONES</h1>
              <p className={styles.roomDesc}>
                Espacio profesional para reuniones, presentaciones y sesiones creativas. Capacidad para hasta 10 personas.
              </p>
            </div>

            <div className={styles.features}>
              {[
                { icon: '📽️', text: 'Proyector 4K' },
                { icon: '🎙️', text: 'Sistema de audio profesional' },
                { icon: '🌐', text: 'Videoconferencia integrada' },
                { icon: '🖊️', text: 'Pizarra digital' },
                { icon: '👥', text: 'Capacidad: 10 personas' },
                { icon: '📱', text: 'Conectividad total' },
              ].map(f => (
                <div key={f.text} className={styles.featureItem}>
                  <span aria-hidden="true">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.panelActions}>
              <a
                href="https://wa.me/573183592598?text=Hola%2C%20quiero%20agendar%20la%20sala%20de%20reuniones"
                className={styles.bookBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Agendar sala de reuniones"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8"  y1="2" x2="8"  y2="6" />
                  <line x1="3"  y1="10" x2="21" y2="10" />
                </svg>
                Agendar sala
              </a>
              <button className={styles.backBtn} onClick={() => navigate('/second-floor')} type="button">← Volver</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
