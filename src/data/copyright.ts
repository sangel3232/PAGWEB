// ── Copyright Office Data ────────────────────────────────────────────
// This data is managed from the Admin Panel (/admin)
// and displayed in the Derechos de Autor office

export type WorkStatus = 'Registrada' | 'En proceso' | 'Pendiente' | 'Publicada'
export type LicenseType = 'Exclusiva' | 'No exclusiva' | 'Sincronización' | 'Mecánica'

export interface SplitSheetEntry {
  name: string
  role: string   // Compositor, Productor, Arreglista, etc.
  percentage: number
}

export interface License {
  id: string
  licensee: string
  type: LicenseType
  grantedDate: string
  expiryDate?: string
  territory: string
  notes?: string
}

export interface WorkRecord {
  id: string
  title: string
  genre: string
  registrationDate: string
  registrationNumber?: string     // DNDA certificate number
  status: WorkStatus
  authors: SplitSheetEntry[]
  publishedPlatforms?: string[]   // Spotify, Apple Music, etc.
  saycoRegistered?: boolean
  asimproRegistered?: boolean
  licenses?: License[]
  modifications?: { date: string; description: string }[]
  documents?: { title: string; url: string }[]
  notes?: string
}

export interface CopyrightStats {
  totalRegistered: number
  totalPublished: number
  protectedCatalog: number
  recognitions: string[]
}

// ── Default data (populated from Admin Panel) ────────────────────────
// Admin can add/edit works via /admin → Derechos de Autor section
export const COPYRIGHT_STATS: CopyrightStats = {
  totalRegistered: 12,
  totalPublished: 8,
  protectedCatalog: 12,
  recognitions: [
    'Registro ante la DNDA (Dirección Nacional de Derecho de Autor)',
    'Afiliación activa a SAYCO',
    'Catálogo en distribución digital a través de plataformas certificadas',
  ],
}

export const WORKS_REGISTRY: WorkRecord[] = [
  {
    id: 'obra-001',
    title: 'Corazón de Noche',
    genre: 'Pop / Balada',
    registrationDate: '2024-03-15',
    registrationNumber: 'DNDA-2024-0315-001',
    status: 'Publicada',
    authors: [
      { name: 'Emmanuel Segura Zapata', role: 'Compositor / Letra', percentage: 70 },
      { name: 'Valentina Cruz', role: 'Intérprete / Co-compositora', percentage: 30 },
    ],
    publishedPlatforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'],
    saycoRegistered: true,
    asimproRegistered: false,
    licenses: [
      {
        id: 'lic-001', licensee: 'Distribuidora Digital XYZ',
        type: 'No exclusiva', grantedDate: '2024-04-01',
        territory: 'Latinoamérica', notes: 'Distribución digital únicamente',
      },
    ],
    modifications: [
      { date: '2024-05-10', description: 'Actualización de arreglos de producción — versión extendida' },
    ],
    documents: [
      { title: 'Certificado DNDA', url: '' },
      { title: 'Contrato de distribución', url: '' },
    ],
  },
  {
    id: 'obra-002',
    title: 'Entre Luces',
    genre: 'Pop',
    registrationDate: '2024-06-20',
    registrationNumber: 'DNDA-2024-0620-002',
    status: 'Registrada',
    authors: [
      { name: 'Emmanuel Segura Zapata', role: 'Compositor / Productor', percentage: 100 },
    ],
    saycoRegistered: true,
    asimproRegistered: true,
    documents: [
      { title: 'Certificado DNDA', url: '' },
    ],
  },
  {
    id: 'obra-003',
    title: 'Alma de Cristal',
    genre: 'R&B',
    registrationDate: '2024-09-05',
    status: 'En proceso',
    authors: [
      { name: 'Emmanuel Segura Zapata', role: 'Compositor', percentage: 60 },
      { name: 'Isabela Montoya', role: 'Co-compositora / Intérprete', percentage: 40 },
    ],
    notes: 'Registro en trámite ante la DNDA. Documentación enviada.',
  },
  {
    id: 'obra-004',
    title: 'Sombras del Norte',
    genre: 'Folk / Regional',
    registrationDate: '2024-11-12',
    status: 'Pendiente',
    authors: [
      { name: 'Emmanuel Segura Zapata', role: 'Compositor', percentage: 80 },
      { name: 'Los Tres Caminos', role: 'Intérpretes', percentage: 20 },
    ],
  },
]

// Admin saves/updates to localStorage key 'zc_copyright'
const STORAGE_KEY = 'zc_copyright'

export function getCopyrightWorks(): WorkRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as WorkRecord[]
  } catch { /* ignore */ }
  return WORKS_REGISTRY
}

export function saveCopyrightWork(work: WorkRecord): void {
  const works = getCopyrightWorks()
  const idx = works.findIndex(w => w.id === work.id)
  if (idx >= 0) works[idx] = work
  else works.push(work)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
}

export function deleteCopyrightWork(id: string): void {
  const works = getCopyrightWorks().filter(w => w.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
}

export function getCopyrightStats(): CopyrightStats {
  const works = getCopyrightWorks()
  return {
    totalRegistered: works.filter(w => w.status === 'Registrada' || w.status === 'Publicada').length,
    totalPublished: works.filter(w => w.status === 'Publicada').length,
    protectedCatalog: works.length,
    recognitions: COPYRIGHT_STATS.recognitions,
  }
}
