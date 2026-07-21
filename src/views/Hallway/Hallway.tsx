import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { getDepartmentRoute } from '../../data/departments'
import { OfficeMap } from '../../components/OfficeMap/OfficeMap'
import type { DepartmentId, RoomId } from '../../types'
import styles from './Hallway.module.css'

// ── Door data ──────────────────────────────────────────────────────────
interface DoorConfig {
  id?: DepartmentId
  slug: string
  label: string
  sublabel?: string
  doorImage: string          // photo of the door
  hotspotLeft: string        // hotspot position
  hotspotTop: string
  hotspotLeftMobile?: string // mobile-specific hotspot position
  hotspotTopMobile?: string
  side: 'left' | 'right' | 'center'
  route: string
  color?: string
}

const DOORS: DoorConfig[] = [
  // LEFT SIDE — 3 doors (Composición, Producción, Proyectos y Remixes)
  {
    id: 1, slug: 'composicion-musical', label: 'Composición Musical', sublabel: 'Departamento 1',
    doorImage: '/images/puerta-composicionmusical-bg.jpg',
    hotspotLeft: '6%', hotspotTop: '32%', hotspotLeftMobile: '14%', hotspotTopMobile: '14%', side: 'left',
    route: '/department/composicion-musical',
  },
  {
    id: 3, slug: 'produccion-musical', label: 'Producción Musical', sublabel: 'Departamento 3',
    doorImage: '/images/puerta-produccionmusical-bg.jpg',
    hotspotLeft: '17%', hotspotTop: '43%', hotspotLeftMobile: '22%', hotspotTopMobile: '24%', side: 'left',
    route: '/department/produccion-musical',
  },
  {
    // Proyectos y Remixes replaces Relaciones Artísticas on left side
    id: 2, slug: 'proyectos-remixes', label: 'Proyectos y Remixes', sublabel: 'Departamento 2',
    doorImage: '/images/puerta-proyectosyremix-bg.jpg',
    hotspotLeft: '27%', hotspotTop: '54%', hotspotLeftMobile: '30%', hotspotTopMobile: '34%', side: 'left',
    route: '/department/proyectos-remixes',
  },
  // RIGHT SIDE — 3 doors (Derechos, Marketing, CEO)
  {
    id: 6, slug: 'derechos-autor', label: 'Derechos de Autor', sublabel: 'Departamento 6',
    doorImage: '/images/puerta-derechosdeautor-bg.jpg',
    hotspotLeft: '83%', hotspotTop: '34%', hotspotLeftMobile: '76%', hotspotTopMobile: '16%', side: 'right',
    route: '/department/derechos-autor',
  },
  {
    id: 4, slug: 'marketing-lanzamientos', label: 'Marketing y Lanzamientos', sublabel: 'Departamento 4',
    doorImage: '/images/puerta-marketingylanzamientos-bg.jpg',
    hotspotLeft: '72%', hotspotTop: '44%', hotspotLeftMobile: '68%', hotspotTopMobile: '28%', side: 'right',
    route: '/department/marketing-lanzamientos',
  },
  {
    // CEO door is on the right side of the hallway (3rd door from front-right)
    slug: 'ceo', label: 'Oficina del CEO', sublabel: 'Emmanuel Segura Zapata',
    doorImage: '/images/puertas-oficinadelCEO-bg.jpg',
    hotspotLeft: '62%', hotspotTop: '54%', hotspotLeftMobile: '56%', hotspotTopMobile: '38%', side: 'right',
    route: '/ceo',
    color: '#E8C96A',
  },
]

// ── Parallax hook ──────────────────────────────────────────────────────
function useParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = e.currentTarget.clientWidth / 2
    const cy = e.currentTarget.clientHeight / 2
    setOffset({ x: ((e.clientX - cx) / cx) * 14, y: ((e.clientY - cy) / cy) * 6 })
  }, [])
  const handleMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return
    setOffset({ x: (e.touches[0].clientX - touchRef.current.x) * 0.35, y: (e.touches[0].clientY - touchRef.current.y) * 0.18 })
  }, [])
  const handleTouchEnd = useCallback(() => { touchRef.current = null; setOffset({ x: 0, y: 0 }) }, [])

  return { offset, handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd } }
}

// ── Door preview modal ─────────────────────────────────────────────────
interface DoorPreviewProps {
  door: DoorConfig
  onEnter: () => void
  onClose: () => void
  entering: boolean
}

// ── Door preview — FULL SCREEN immersive view ─────────────────────────
function DoorPreview({ door, onEnter, onClose, entering }: DoorPreviewProps) {
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = e.currentTarget.clientWidth / 2
    const cy = e.currentTarget.clientHeight / 2
    setImgOffset({ x: ((e.clientX - cx) / cx) * 18, y: ((e.clientY - cy) / cy) * 10 })
  }, [])
  const handleMouseLeave = useCallback(() => setImgOffset({ x: 0, y: 0 }), [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return
    setImgOffset({ x: (e.touches[0].clientX - touchRef.current.x) * 0.45, y: (e.touches[0].clientY - touchRef.current.y) * 0.25 })
  }, [])
  const handleTouchEnd = useCallback(() => { touchRef.current = null; setImgOffset({ x: 0, y: 0 }) }, [])

  return (
    <motion.div
      className={styles.doorView}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen door image with parallax */}
      <motion.div
        className={styles.doorViewBg}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{
          scale: entering ? 1.25 : 1.04,
          opacity: entering ? 0 : 1,
          x: -imgOffset.x,
          y: -imgOffset.y,
        }}
        transition={{
          scale: { duration: entering ? 0.65 : 0.55, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: entering ? 0.5 : 0.5 },
          x: { duration: 0.55, ease: 'easeOut' },
          y: { duration: 0.55, ease: 'easeOut' },
        }}
      >
        {door.doorImage
          ? <img src={door.doorImage} alt={`Puerta de ${door.label}`} className={styles.doorViewImg} fetchPriority="high" />
          : <div className={styles.doorViewFallback} style={{ background: `radial-gradient(ellipse at center, ${door.color || '#C9A84C'}22, #0a0805)` }} />
        }
        {/* Atmospheric overlay — bottom only */}
        <div className={styles.doorViewOverlay} />
      </motion.div>

      {/* Content overlay — slides up */}
      <motion.div
        className={styles.doorViewContent}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
      >
        {door.sublabel && (
          <p className={styles.doorViewSublabel} style={{ color: door.color || '#C9A84C' }}>
            {door.sublabel}
          </p>
        )}
        <h1 className={styles.doorViewTitle}>{door.label}</h1>

        <div className={styles.doorViewActions}>
          <motion.button
            className={styles.doorEnterBtn}
            style={{ background: door.color || '#C9A84C' } as React.CSSProperties}
            onClick={onEnter}
            type="button"
            disabled={entering}
            whileHover={!entering ? { scale: 1.05, boxShadow: `0 0 30px ${door.color || '#C9A84C'}80` } : {}}
            whileTap={!entering ? { scale: 0.97 } : {}}
            transition={{ duration: 0.2 }}
          >
            {entering
              ? <span className={styles.enteringDots}><span /><span /><span /></span>
              : <><span aria-hidden="true">→</span> ENTRAR A LA OFICINA</>
            }
          </motion.button>
          <button
            className={styles.doorCloseBtn}
            onClick={onClose}
            type="button"
            aria-label="Volver al pasillo"
          >
            ← VOLVER AL PASILLO
          </button>
        </div>
      </motion.div>

      {/* Close X top-right */}
      <button
        className={styles.doorViewClose}
        onClick={onClose}
        type="button"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </motion.div>
  )
}

// ── Main Hallway ───────────────────────────────────────────────────────
export function Hallway() {
  const navigate = useNavigate()
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [selectedDoor, setSelectedDoor] = useState<DoorConfig | null>(null)
  const [entering, setEntering] = useState(false)
  const [hallwayVisible, setHallwayVisible] = useState(false)
  const { offset, handlers } = useParallax()

  useEffect(() => {
    const t = setTimeout(() => setHallwayVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const handleDoorClick = (door: DoorConfig) => {
    setSelectedDoor(door)
    setEntering(false)
  }

  const handleEnter = () => {
    if (!selectedDoor || entering) return
    setEntering(true)
    // Navigate immediately — no lock needed
    setTimeout(() => navigate(selectedDoor.route), 600)
  }

  const handleMapNavigate = (roomId: RoomId) => {
    setIsMapOpen(false)
    if (roomId === 'ceo') navigate('/ceo')
    else navigate(getDepartmentRoute(roomId as DepartmentId))
  }

  const bgScale = selectedDoor ? 1.08 : (hallwayVisible ? 1.04 : 1.0)

  return (
    <div className={styles.hallway} data-testid="doors-grid" {...handlers}>

      {/* ── Parallax background — explicit initial to avoid dark flash ── */}
      <motion.div
        className={styles.bgLayer}
        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={{ x: -offset.x, y: -offset.y, scale: bgScale, opacity: 1 }}
        transition={{
          x: { duration: 0.6, ease: 'easeOut' },
          y: { duration: 0.6, ease: 'easeOut' },
          scale: { duration: 0.8, ease: 'easeOut' },
          opacity: { duration: 0 },
        }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/pasillo-mobile-bg.jpg" />
          <img
            src="/images/pasillo-bg.jpg"
            alt="Pasillo principal de Zapata Composiciones"
            className={styles.bgImg}
            draggable={false}
            fetchPriority="high"
          />
        </picture>
        <div className={styles.bgVignette} />
      </motion.div>

      {/* ── Explore hint ── */}
      <p className={styles.lookHint} aria-hidden="true">↔ Mueve el mouse para explorar el pasillo</p>

      {/* ── Door hotspots — only visible when no door is selected ── */}
      <AnimatePresence>
        {hallwayVisible && !selectedDoor && DOORS.map((door, i) => (
          <motion.button
            key={door.slug}
            className={styles.hotspotWrapper}
            style={{
              left: door.hotspotLeft,
              top: door.hotspotTop,
              '--hotspot-left-mobile': door.hotspotLeftMobile ?? door.hotspotLeft,
              '--hotspot-top-mobile': door.hotspotTopMobile ?? door.hotspotTop,
            } as React.CSSProperties}
            onClick={() => handleDoorClick(door)}
            type="button"
            aria-label={`Ver puerta de ${door.label}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: 'backOut' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className={styles.hotspotRing}  style={{ borderColor: door.color || '#C9A84C' }} aria-hidden="true" />
            <span className={styles.hotspotRing2} style={{ borderColor: door.color || '#C9A84C' }} aria-hidden="true" />
            <span className={styles.hotspotCore}  style={{ background: door.color || '#C9A84C', boxShadow: `0 0 16px ${door.color || '#C9A84C'}80` }} aria-hidden="true" />
          </motion.button>
        ))}
      </AnimatePresence>

      {/* ── Stairs card ── */}
      <AnimatePresence>
        {hallwayVisible && !selectedDoor && (
          <motion.button
            className={styles.stairsBtn}
            onClick={() => navigate('/second-floor')}
            type="button"
            aria-label="Subir al segundo piso"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.35 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <img src="/images/escaleras-bg.jpg" alt="Escaleras" className={styles.stairsImg} loading="lazy" />
            <div className={styles.stairsOverlay} />
            <div className={styles.stairsLabel}>
              <span aria-hidden="true">↑</span>
              <span>SEGUNDO PISO</span>
              <span className={styles.stairsSub}>Sala de espera · Reuniones</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Bottom bar ── */}
      <AnimatePresence>
        {hallwayVisible && !selectedDoor && (
          <motion.div
            className={styles.bottomBar}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
          >
            <button className={styles.mapBtn} onClick={() => setIsMapOpen(true)} type="button" data-testid="open-map-button">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              MAPA
            </button>
            <button className={styles.backBtn} onClick={() => navigate('/reception')} type="button">
              ← RECEPCIÓN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Door preview modal ── */}
      <AnimatePresence>
        {selectedDoor && (
          <DoorPreview
            door={selectedDoor}
            onEnter={handleEnter}
            onClose={() => { setSelectedDoor(null); setEntering(false) }}
            entering={entering}
          />
        )}
      </AnimatePresence>

      <OfficeMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        activeRoomId={undefined}
        onNavigate={handleMapNavigate}
      />
    </div>
  )
}
