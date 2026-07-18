import type React from 'react'

// IDs
export type DepartmentId = 1 | 2 | 3 | 4 | 5 | 6
export type ViewId = 'reception' | 'hallway' | 'department' | 'ceo' | 'about'
export type RoomId = DepartmentId | 'ceo'

// Datos de departamentos
export interface Service {
  id: string
  name: string
  description?: string
}

export interface FeaturedWork {
  id: string
  title: string
  artist?: string
  type: 'audio' | 'visual'
  audioSrc?: string
  audioCover?: string
  thumbnailSrc?: string
  linkUrl?: string
}

export interface WorkStep {
  number: number
  title: string
  description: string
}

export interface ContactAction {
  label: string
  type: 'whatsapp' | 'email' | 'form'
  url: string
}

export interface DownloadableDocument {
  id: string
  title: string
  url: string
}

export interface DepartmentData {
  id: DepartmentId
  slug: string
  name: string
  tagline: string
  backgroundImage: string
  ambientColor: string
  services: Service[]
  featuredWorks: FeaturedWork[]
  workProcess: WorkStep[]
  contactAction: ContactAction
  documents?: DownloadableDocument[]
}

// CEO
export interface CEOStat {
  value: string
  label: string
}

export interface CEOSection {
  id: 'historia' | 'mision' | 'valores' | 'logros'
  title: string
  content: string
}

export interface CEOProfile {
  name: string
  title: string
  photo: string
  welcomeMessage: string
  signature: string
  stats: CEOStat[]
  sections: CEOSection[]
  whatsappUrl: string
}

// Empresa
export interface CompanyValue {
  id: string
  title: string
  description: string
  icon: string
}

// Props de componentes
export interface DoorProps {
  departmentId: DepartmentId
  label: string
  number: number
  onClick: () => void
}

export interface DepartmentSidebarProps {
  activeDepartmentId?: DepartmentId
  onNavigate: (id: DepartmentId) => void
  isMobileCollapsed: boolean
}

export interface AudioPlayerProps {
  src: string
  title: string
  artist?: string
  coverImage?: string
}

export interface OfficeMapProps {
  isOpen: boolean
  onClose: () => void
  activeRoomId?: RoomId
  onNavigate: (roomId: RoomId) => void
}

export interface TransitionWrapperProps {
  children: React.ReactNode
  variant?: 'fade' | 'slide-left' | 'slide-right' | 'zoom-in'
}

// Estado de navegación (para Zustand)
export interface NavigationState {
  activeView: ViewId
  activeDepartmentId: DepartmentId | null
  isTransitioning: boolean
  isMapOpen: boolean
  navigateTo: (viewId: ViewId, deptId?: DepartmentId) => void
  startTransition: () => void
  endTransition: () => void
  openMap: () => void
  closeMap: () => void
}
