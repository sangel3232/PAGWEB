import { create } from 'zustand'
import type { NavigationState, ViewId, DepartmentId } from '../types'

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: 'reception',
  activeDepartmentId: null,
  isTransitioning: false,
  isMapOpen: false,

  navigateTo: (viewId: ViewId, deptId?: DepartmentId) => {
    set({
      isTransitioning: true,
      activeView: viewId,
      activeDepartmentId: deptId ?? null,
    })
  },

  startTransition: () => set({ isTransitioning: true }),

  endTransition: () => set({ isTransitioning: false }),

  openMap: () => set({ isMapOpen: true }),

  closeMap: () => set({ isMapOpen: false }),
}))
