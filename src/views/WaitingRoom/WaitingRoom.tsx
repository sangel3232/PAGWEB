import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { getPublicCatalog, type CatalogSong } from '../../data/catalog'
import styles from './WaitingRoom.module.css'

// Mini audio player for each song
function SongPlayer({ song }: { song: CatalogSong }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  const toggle = () => {
    if (error || !song.audioUrl) return
    if (!audioRef.current) {
      const a = new Audio(song.audioUrl)
      a.ontimeupdate = () => setProgress((a.currentTime / (a.duration || 1)) * 100)
      a.onended = () => { setIsPlaying(false); setProgress(0) }
      a.onerror = () => { setError(true); setIsPlaying(false) }
      audioRef.current = a
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => setError(true))
      setIsPlaying(true)
    }
  }

  const canPlay = !!song.audioUrl && !error

  return (
    <div className={styles.songPlayer}>
      <button
        className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
        onClick={toggle}
        type="button"
        aria-label={isPlaying ? `Pausar ${song.title}` : `Reproducir ${song.title}`}
        disabled={!canPlay}
        title={!canPlay ? 'Audio no disponible' : undefined}
      >
        {isPlaying
          ? <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        }
      </button>
      {canPlay && (
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}
      {!canPlay && (
        <span className={styles.noAudio}>Sin audio</span>
      )}
    </div>
  )
}

export function WaitingRoom() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [songs, setSongs] = useState<CatalogSong[]>([])
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setSongs(getPublicCatalog())
  }, [])

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
      {/* Background */}
      <motion.div
        className={styles.bg}
        animate={{ x: -offset.x, y: -offset.y }}
        transition={{ x: { duration: 0.65, ease: 'easeOut' }, y: { duration: 0.65, ease: 'easeOut' } }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/salaespera-mobile-bg.svg" />
          <img src="/images/salaespera-bg.jpg" alt="Sala de espera" className={styles.bgImg} draggable={false} />
        </picture>
        <div className={styles.bgVignette} />
      </motion.div>

      <p className={styles.lookHint} aria-hidden="true">↔ Mueve el mouse para explorar</p>

      {/* Hotspot */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            className={styles.hotspotBtn}
            style={{ left: '50%', top: '55%' }}
            onClick={() => setPanelOpen(true)}
            type="button"
            aria-label="Ver catálogo musical y sala de espera"
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

      {/* Info + catalog panel */}
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

            {/* Room info */}
            <div className={styles.roomInfo}>
              <div className={styles.roomHeader}>
                <span className={styles.floorBadge}>SEGUNDO PISO</span>
                <h1 className={styles.roomTitle}>SALA DE ESPERA</h1>
                <p className={styles.roomDesc}>Mientras esperas, descubre el catálogo musical de Zapata Composiciones. Haz clic en ▶ para escuchar.</p>
              </div>
              <div className={styles.amenities}>
                {[
                  { icon: '☕', text: 'Café disponible' },
                  { icon: '📶', text: 'WiFi gratis' },
                  { icon: '🎵', text: 'Catálogo musical' },
                ].map(a => (
                  <div key={a.text} className={styles.amenityItem}>
                    <span aria-hidden="true">{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Song catalog */}
            <div className={styles.catalogSection}>
              <h2 className={styles.catalogTitle}>
                <span aria-hidden="true">♪</span> Catálogo Musical
              </h2>
              {songs.length === 0 ? (
                <p className={styles.emptyCatalog}>Próximamente — las canciones se están cargando.</p>
              ) : (
                <div className={styles.songsList}>
                  {songs.map((song, i) => (
                    <motion.div
                      key={song.id}
                      className={styles.songCard}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <div className={styles.songNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                      <div className={styles.songInfo}>
                        <p className={styles.songTitle}>{song.title}</p>
                        <p className={styles.songArtist}>{song.artist}</p>
                        <div className={styles.songMeta}>
                          <span className={styles.songGenre}>{song.genre}</span>
                          {song.duration && <span className={styles.songDuration}>{song.duration}</span>}
                          {song.year && <span className={styles.songYear}>{song.year}</span>}
                        </div>
                      </div>
                      <SongPlayer song={song} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.panelActions}>
              <a
                href="https://wa.me/573183592598?text=Hola%2C%20ya%20llegué%20a%20la%20sala%20de%20espera"
                className={styles.notifyBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Avisar que llegué
              </a>
              <button className={styles.backBtn} onClick={() => navigate('/second-floor')} type="button">← Volver</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
