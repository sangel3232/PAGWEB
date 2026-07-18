import { create } from 'zustand'
import type { AudioPlayerProps } from '../types'

interface AudioTrack extends AudioPlayerProps {}

interface AudioState {
  currentTrack: AudioTrack | null
  isPlaying: boolean
  volume: number
  play: (track: AudioTrack) => void
  pause: () => void
  setTrack: (track: AudioTrack) => void
  setVolume: (volume: number) => void
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,

  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setTrack: (track) => set({ currentTrack: track }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
}))
