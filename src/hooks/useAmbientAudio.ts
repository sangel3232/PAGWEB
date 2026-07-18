// Ambient audio hook — plays a local three-song playlist in order.
// The playlist starts when the user enters the office and can also be toggled via the floating control.

import { useCallback, useEffect, useState } from 'react'

const PLAYLIST = [
  '/audiofondo/float-night-drift-main-version-34575-01-59.mp3',
  '/audiofondo/light-and-easy-christian-larssen-main-version-24114-01-48.mp3',
  '/audiofondo/soothing-moments-monument-music-main-version-21364-01-58.mp3',
]

let audioInstance: HTMLAudioElement | null = null
let currentTrackIndex = 0
let isMuted = true
let isPlaying = false
let isReady = false
const listeners = new Set<(value: { isMuted: boolean; isPlaying: boolean; isReady: boolean }) => void>()

function notify() {
  const snapshot = { isMuted, isPlaying, isReady }
  listeners.forEach((listener) => listener(snapshot))
}

function ensureAudio() {
  if (audioInstance) return audioInstance

  const audio = new Audio()
  audio.volume = 0.12
  audio.preload = 'auto'
  audio.muted = true

  const handleCanPlayThrough = () => {
    isReady = true
    notify()
  }

  const handleEnded = () => {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length
    audio.src = PLAYLIST[currentTrackIndex]
    audio.currentTime = 0

    if (!isMuted) {
      audio.play().catch(() => {
        isPlaying = false
        notify()
      })
    } else {
      isPlaying = false
      notify()
    }
  }

  audio.addEventListener('canplaythrough', handleCanPlayThrough)
  audio.addEventListener('ended', handleEnded)
  audioInstance = audio

  return audio
}

export function useAmbientAudio() {
  const [state, setState] = useState({ isMuted, isPlaying, isReady })

  useEffect(() => {
    const listener = (value: { isMuted: boolean; isPlaying: boolean; isReady: boolean }) => {
      setState(value)
    }

    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const startPlayback = useCallback(() => {
    const audio = ensureAudio()
    currentTrackIndex = 0
    audio.src = PLAYLIST[currentTrackIndex]
    audio.currentTime = 0
    audio.muted = false
    isMuted = false
    isPlaying = false
    isReady = false
    notify()

    audio.play()
      .then(() => {
        isPlaying = true
        notify()
      })
      .catch(() => {
        isPlaying = false
        notify()
      })
  }, [])

  const stopPlayback = useCallback(() => {
    const audio = audioInstance
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    isPlaying = false
    isMuted = true
    audio.muted = true
    notify()
  }, [])

  const toggleMute = useCallback(() => {
    const audio = ensureAudio()

    if (isMuted) {
      audio.muted = false
      isMuted = false
      if (!isPlaying) {
        startPlayback()
      } else {
        audio.play().catch(() => {
          isPlaying = false
          notify()
        })
        notify()
      }
    } else {
      audio.pause()
      audio.muted = true
      isMuted = true
      isPlaying = false
      notify()
    }
  }, [startPlayback])

  return {
    isMuted: state.isMuted,
    isReady: state.isReady,
    isPlaying: state.isPlaying,
    startPlayback,
    stopPlayback,
    toggleMute,
  }
}
