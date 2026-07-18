import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { NotFound } from '../views/NotFound/NotFound'
import { DepartmentSidebar } from '../components/DepartmentSidebar/DepartmentSidebar'
import { ContactFooter } from '../components/ContactFooter/ContactFooter'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary'
import { AmbientAudioButton } from '../components/AmbientAudioButton/AmbientAudioButton'
import { useNavigationStore } from '../store/navigationStore'
import { getDepartmentRoute } from '../data/departments'
import type { DepartmentId } from '../types'

// ── Lazy views ────────────────────────────────────────────────────────
const Exterior       = React.lazy(() => import('../views/Exterior/Exterior').then(m => ({ default: m.Exterior })))
const Reception      = React.lazy(() => import('../views/Reception/Reception').then(m => ({ default: m.Reception })))
const Hallway        = React.lazy(() => import('../views/Hallway/Hallway').then(m => ({ default: m.Hallway })))
const DepartmentOffice = React.lazy(() => import('../views/DepartmentOffice/DepartmentOffice').then(m => ({ default: m.DepartmentOffice })))
const CEORoom        = React.lazy(() => import('../views/CEORoom/CEORoom').then(m => ({ default: m.CEORoom })))
const AboutSection   = React.lazy(() => import('../views/AboutSection/AboutSection').then(m => ({ default: m.AboutSection })))
const SecondFloor    = React.lazy(() => import('../views/SecondFloor/SecondFloor').then(m => ({ default: m.SecondFloor })))
const WaitingRoom    = React.lazy(() => import('../views/WaitingRoom/WaitingRoom').then(m => ({ default: m.WaitingRoom })))
const MeetingRoom    = React.lazy(() => import('../views/MeetingRoom/MeetingRoom').then(m => ({ default: m.MeetingRoom })))
const CopyrightOffice = React.lazy(() =>
  import('../views/CopyrightOffice/CopyrightOffice').then(m => ({ default: m.CopyrightOffice }))
)

const Admin          = React.lazy(() => import('../views/Admin/Admin').then(m => ({ default: m.Admin })))
const BARE_ROUTES = ['/', '/reception']

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function wrap(el: React.ReactElement) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{el}</Suspense>
    </ErrorBoundary>
  )
}

function AppLayout() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { activeDepartmentId } = useNavigationStore()
  const isMobile  = useIsMobile()

  const isBare = BARE_ROUTES.includes(location.pathname)
    || location.pathname.startsWith('/admin')

  return (
    <>
      {!isBare && (
        <DepartmentSidebar
          activeDepartmentId={activeDepartmentId ?? undefined}
          onNavigate={(id: DepartmentId) => navigate(getDepartmentRoute(id))}
          isMobileCollapsed={isMobile}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Entry */}
          <Route path="/"                 element={wrap(<Exterior />)} />
          <Route path="/reception"        element={wrap(<Reception />)} />

          {/* Ground floor hallway */}
          <Route path="/hallway"          element={wrap(<Hallway />)} />

          {/* Department offices — derechos-autor gets the specialized view */}
          <Route path="/department/derechos-autor" element={wrap(<CopyrightOffice />)} />
          <Route path="/department/:slug"          element={wrap(<DepartmentOffice />)} />
          <Route path="/ceo"              element={wrap(<CEORoom />)} />
          <Route path="/about"            element={wrap(<AboutSection />)} />

          {/* Second floor */}
          <Route path="/second-floor"     element={wrap(<SecondFloor />)} />
          <Route path="/sala-espera"      element={wrap(<WaitingRoom />)} />
          <Route path="/sala-reuniones"   element={wrap(<MeetingRoom />)} />

          {/* Admin panel (private) */}
          <Route path="/admin"            element={wrap(<Admin />)} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {!isBare && <ContactFooter />}
      {/* Ambient audio control — visible on all non-bare routes */}
      {!isBare && !location.pathname.startsWith('/admin') && <AmbientAudioButton />}
    </>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
