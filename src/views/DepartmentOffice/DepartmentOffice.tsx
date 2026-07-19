import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { getDepartmentBySlug } from '../../data/departments'
import { getFlow } from '../../lib/conversationFlows'
import { AIAssistant } from '../../components/AIAssistant/AIAssistant'
import { useNavigationStore } from '../../store/navigationStore'
import styles from './DepartmentOffice.module.css'

// Map slugs to their real background images
const DEPT_BG: Record<string, string> = {
  'composicion-musical':    '/images/composition-musical-bg.jpg',
  'produccion-musical':     '/images/production-musical-bg.jpg',
  'proyectos-remixes':      '/images/proyect-remix-bg.jpg',
  'marketing-lanzamientos': '/images/marquetin-lanzamiento-bg.jpg',
  'relaciones-artisticas':  '',
  'derechos-autor':         '/images/derechos-autor-bg.jpg',
}

const DEPT_BG_MOBILE: Record<string, string> = {
  'composicion-musical':    '/images/composition-musical-bg.jpg',
  'produccion-musical':     '/images/production-musical-bg.jpg',
  'proyectos-remixes':      '/images/proyect-remix-bg.jpg',
  'marketing-lanzamientos': '/images/marquetin-lanzamiento-bg.jpg',
  'relaciones-artisticas':  '',
  'derechos-autor':         '/images/derechos-autor-mobile-bg.jpg',
}

export function DepartmentOffice() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { navigateTo: _navigateTo } = useNavigationStore()

  const dept = getDepartmentBySlug(slug)
  const flow = getFlow(slug)

  // Panel hidden by default — revealed by clicking the hotspot
  const [panelOpen, setPanelOpen] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!dept) { navigate('/', { replace: true }); return }
    // Update active dept in store without triggering re-renders
    useNavigationStore.getState().navigateTo('department', dept.id)
    setPanelOpen(false)
    setShowAssistant(false)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = e.currentTarget.clientWidth / 2
    const cy = e.currentTarget.clientHeight / 2
    setOffset({
      x: ((e.clientX - cx) / cx) * 16,
      y: ((e.clientY - cy) / cy) * 8,
    })
  }, [])
  const handleMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return
    setOffset({
      x: (e.touches[0].clientX - touchRef.current.x) * 0.4,
      y: (e.touches[0].clientY - touchRef.current.y) * 0.2,
    })
  }, [])
  const handleTouchEnd = useCallback(() => {
    touchRef.current = null
    setOffset({ x: 0, y: 0 })
  }, [])

  if (!dept) return null

  const bgImage = DEPT_BG[slug] || ''
  const mobileBgImage = DEPT_BG_MOBILE[slug] || bgImage
  const bgStyle = bgImage
    ? undefined
    : { backgroundColor: dept.ambientColor }

  return (
    <div
      className={styles.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Parallax background — NO heavy overlay, keep image bright ── */}
      <motion.div
        className={styles.bg}
        style={bgStyle}
        animate={{ x: -offset.x, y: -offset.y }}
        transition={{
          x: { duration: 0.65, ease: 'easeOut' },
          y: { duration: 0.65, ease: 'easeOut' },
        }}
      >
        {bgImage && (
          <picture>
            <source media="(max-width: 768px)" srcSet={mobileBgImage} />
            <img
              src={bgImage}
              alt={`Oficina de ${dept.name}`}
              className={styles.bgImg}
              draggable={false}
            />
          </picture>
        )}
        {/* Very subtle vignette only at edges — preserves image brightness */}
        <div className={styles.bgVignette} />
      </motion.div>

      {/* ── Explore hint (top right) ── */}
      <p className={styles.lookHint} aria-hidden="true">
        ↔ Mueve el mouse para explorar
      </p>

      {/* ── HOTSPOT — golden pulsing dot ── */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            className={styles.hotspotBtn}
            onClick={() => setPanelOpen(true)}
            type="button"
            aria-label={`Ver información de ${dept.name}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Outer pulse ring */}
            <span className={styles.hotspotRing} aria-hidden="true" />
            {/* Outer pulse ring 2 */}
            <span className={`${styles.hotspotRing} ${styles.hotspotRing2}`} aria-hidden="true" />
            {/* Core dot */}
            <span className={styles.hotspotCore} aria-hidden="true" />
            {/* Tooltip */}
            <span className={styles.hotspotTooltip} role="tooltip">
              Toca para explorar
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Info panel — slides up when hotspot is clicked ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className={styles.infoPanel}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Close panel */}
            <button
              className={styles.closePanelBtn}
              onClick={() => setPanelOpen(false)}
              type="button"
              aria-label="Cerrar panel de información"
            >
              ✕
            </button>

            {/* Department badge + name */}
            <div className={styles.panelHeader}>
              <span
                className={styles.deptBadge}
                style={{ borderColor: dept.ambientColor, color: dept.ambientColor }}
              >
                Departamento {dept.id}
              </span>
              <h1 className={styles.deptName}>{dept.name}</h1>
              <p className={styles.deptTagline}>{dept.tagline}</p>
            </div>

            {/* Services chips */}
            <div className={styles.servicesRow}>
              {dept.services.map(s => (
                <div key={s.id} className={styles.serviceChip}>
                  <span className={styles.serviceChipDot} aria-hidden="true" />
                  {s.name}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className={styles.panelActions}>
              <motion.button
                className={styles.assistantBtn}
                onClick={() => { setPanelOpen(false); setShowAssistant(true) }}
                type="button"
                aria-label={`Hablar con el asistente de ${dept.name}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <span aria-hidden="true">💬</span>
                Hablar con el asistente
              </motion.button>

              <a
                href={dept.contactAction.url}
                className={styles.whatsappBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar a ${dept.name} por WhatsApp`}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {dept.contactAction.label}
              </a>

              <button
                className={styles.backBtn}
                onClick={() => navigate('/hallway')}
                type="button"
                aria-label="Volver al pasillo"
              >
                ← Volver al pasillo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Assistant modal ── */}
      <AnimatePresence>
        {showAssistant && flow && (
          <AIAssistant
            flow={flow}
            onClose={() => setShowAssistant(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
