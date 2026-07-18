// Public song catalog — managed from Admin Panel
// Displayed in the Waiting Room for visitors to browse and play

export interface CatalogSong {
  id: string
  title: string
  artist: string
  genre: string
  duration?: string       // e.g. "3:45"
  audioUrl: string        // URL to MP3 file (can be external or /audio/...)
  coverUrl?: string       // Optional cover image
  year?: string
  description?: string
  available: boolean       // Show/hide in public catalog
}

const STORAGE_KEY = 'zc_catalog'

// Default songs — mapped to real audio files in /audio/
const DEFAULT_CATALOG: CatalogSong[] = [
  {
    id: 'song-001',
    title: 'Brindo por tu olvido',
    artist: 'Zapata Composiciones',
    genre: 'Balada / Regional',
    audioUrl: '/audio/Brindo por tu olvido.mp4',
    year: '2024',
    description: 'Una canción que celebra la libertad después de dejar ir.',
    available: true,
  },
  {
    id: 'song-002',
    title: 'El camino del rey',
    artist: 'Zapata Composiciones',
    genre: 'Regional / Corrido',
    audioUrl: '/audio/El camino del rey.mpeg',
    year: '2024',
    description: 'Un tema poderoso sobre el camino hacia el éxito.',
    available: true,
  },
  {
    id: 'song-003',
    title: 'Promesas en el cielo',
    artist: 'Zapata Composiciones',
    genre: 'Balada',
    audioUrl: '/audio/Promesas en el cielo.mpeg',
    year: '2024',
    description: 'Una promesa eterna convertida en canción.',
    available: true,
  },
]

export function getCatalog(): CatalogSong[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CatalogSong[]
  } catch { /* ignore */ }
  return DEFAULT_CATALOG
}

export function getPublicCatalog(): CatalogSong[] {
  return getCatalog().filter(s => s.available)
}

export function saveSong(song: CatalogSong): void {
  const catalog = getCatalog()
  const idx = catalog.findIndex(s => s.id === song.id)
  if (idx >= 0) catalog[idx] = song
  else catalog.push(song)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
}

export function deleteSong(id: string): void {
  const catalog = getCatalog().filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
}

export function toggleSongAvailability(id: string): void {
  const catalog = getCatalog()
  const song = catalog.find(s => s.id === id)
  if (song) {
    song.available = !song.available
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  }
}
