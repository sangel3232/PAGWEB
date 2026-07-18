import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { OfficeMapProps, RoomId, DepartmentId } from '../../types'
import { DEPARTMENTS } from '../../data/departments'
import styles from './OfficeMap.module.css'

// Office interior images for thumbnails
const OFFICE_IMAGES: Record<string, string> = {
  'composicion-musical':    '/images/composition-musical-bg.jpg',
  'produccion-musical':     '/images/production-musical-bg.jpg',
  'proyectos-remixes':      '/images/proyect-remix-bg.jpg',
  'marketing-lanzamientos': '/images/marquetin-lanzamiento-bg.jpg',
  'derechos-autor':         '/images/derechos-autor-bg.jpg',
}

const CEO_IMAGE = '/images/oficinaCEO-bg.jpg'

interface RoomCardProps {
  roomId: RoomId
  label: string
  image: string
  number?: string
  isActive: boolean
  onNavigate: (roomId: RoomId) => void
}

function RoomCard({ roomId, label, image, number, isActive, onNavigate }: RoomCardProps) {
  return (
    <button
      className={`${styles.room} ${isActive ? styles.roomActive : ''}`}
      data-roomid={roomId}
      onClick={() => onNavigate(roomId)}
      aria-label={`Ir a ${label}`}
      aria-pressed={isActive}
      type="button"
    >
      <div className={styles.roomThumb}>
        {image
          ? <img src={image} alt={label} className={styles.roomThumbImg} loading="lazy" />
          : <div className={styles.roomThumbFallback} />
        }
        <div className={styles.roomThumbOverlay} />
        {number && <span className={styles.roomNumber} aria-hidden="true">{number}</span>}
      </div>
      <span className={styles.roomLabel}>{label}</span>
    </button>
  )
}

export function OfficeMap({ isOpen, onClose, activeRoomId, onNavigate }: OfficeMapProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const modal = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content} role="dialog" aria-modal="true" aria-label="Mapa de la oficina">

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span aria-hidden="true">♪</span> Mapa de la Oficina
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar mapa" type="button">✕</button>
        </div>

        {/* Department grid — excludes relaciones-artisticas (discontinued) */}
        <div className={styles.grid}>
          {DEPARTMENTS.filter(d => d.slug !== 'relaciones-artisticas').map(dept => (
            <RoomCard
              key={dept.id}
              roomId={dept.id as DepartmentId}
              label={dept.name}
              image={OFFICE_IMAGES[dept.slug] || ''}
              number={String(dept.id)}
              isActive={activeRoomId === dept.id}
              onNavigate={onNavigate}
            />
          ))}

          {/* CEO Room */}
          <RoomCard
            roomId="ceo"
            label="Oficina del CEO"
            image={CEO_IMAGE}
            number="CEO"
            isActive={activeRoomId === 'ceo'}
            onNavigate={onNavigate}
          />
        </div>

      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
