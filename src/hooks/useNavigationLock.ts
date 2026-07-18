import { useNavigate } from 'react-router-dom'
import type { NavigateOptions } from 'react-router-dom'
import { useNavigationStore } from '../store/navigationStore'

export function useNavigationLock() {
  const rawNavigate = useNavigate()
  const { isTransitioning, endTransition } = useNavigationStore()

  const navigate = (to: string, options?: NavigateOptions) => {
    if (isTransitioning) return // Bloquear si hay transición en curso
    rawNavigate(to, options)
  }

  return { navigate, isLocked: isTransitioning, endTransition }
}
