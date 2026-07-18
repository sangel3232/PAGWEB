import { useState, useRef, useEffect } from 'react'
import type { AudioPlayerProps } from '../../types'
import { useAudioStore } from '../../store/audioStore'
import styles from './AudioPlayer.module.css'

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ src, title, artist, coverImage }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)

  const { play: storePlay, pause: storePause, setTrack } = useAudioStore()

  useEffect(() => {
    setTrack({ src, title, artist, coverImage })
  }, [src, title, artist, coverImage, setTrack])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      storePause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => setHasError(true))
      storePlay({ src, title, artist, coverImage })
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    storePause()
    setCurrentTime(0)
  }

  const handleError = () => {
    setHasError(true)
    setIsPlaying(false)
    storePause()
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setCurrentTime(value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  const containerLabel = artist
    ? `Reproductor: ${title} - ${artist}`
    : `Reproductor: ${title}`

  return (
    <div
      className={styles.player}
      aria-label={containerLabel}
      role="region"
    >
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
      />

      {/* Cover + info */}
      <div className={styles.info}>
        {coverImage && (
          <img
            src={coverImage}
            alt={`Portada de ${title}`}
            className={styles.cover}
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        )}
        <div className={styles.meta}>
          <span className={styles.title}>{title}</span>
          {artist && <span className={styles.artist}>{artist}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={handlePlayPause}
          aria-label={isPlaying ? `Pausar ${title}` : `Reproducir ${title}`}
          disabled={hasError}
        >
          {isPlaying ? (
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Progress bar */}
        <div className={styles.progressWrapper}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            className={styles.progressBar}
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progreso de reproducción"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Error state */}
      {hasError && (
        <div
          className={styles.error}
          aria-live="polite"
          role="alert"
        >
          No se pudo cargar el audio. Verifica tu conexión e intenta de nuevo.
        </div>
      )}
    </div>
  )
}
