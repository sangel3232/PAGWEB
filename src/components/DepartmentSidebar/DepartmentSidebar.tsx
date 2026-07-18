import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { DepartmentSidebarProps, DepartmentId } from '../../types'
import { DEPARTMENTS } from '../../data/departments'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import styles from './DepartmentSidebar.module.css'

interface SidebarItemProps {
  id: DepartmentId
  number: number
  name: string
  isActive: boolean
  onNavigate: (id: DepartmentId) => void
}

function SidebarItem({ id, number, name, isActive, onNavigate }: SidebarItemProps) {
  const { onKeyDown } = useKeyboardNav(() => onNavigate(id))
  return (
    <li
      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`Ir a ${name}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onNavigate(id)}
      onKeyDown={onKeyDown}
    >
      <span className={styles.number}>{number}</span>
      <span className={styles.name}>{name}</span>
    </li>
  )
}

export function DepartmentSidebar({
  activeDepartmentId,
  onNavigate,
  isMobileCollapsed: _isMobileCollapsed,
}: DepartmentSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle arrow button — always visible on the left edge */}
      <button
        className={`${styles.toggleBtn} ${isOpen ? styles.toggleBtnOpen : ''}`}
        onClick={() => setIsOpen(v => !v)}
        type="button"
        aria-label={isOpen ? 'Ocultar menú de departamentos' : 'Mostrar menú de departamentos'}
        aria-expanded={isOpen}
      >
        <span className={styles.toggleArrow} aria-hidden="true">
          {isOpen ? '◀' : '▶'}
        </span>
        {!isOpen && (
          <span className={styles.toggleLabel} aria-hidden="true">MENÚ</span>
        )}
      </button>

      {/* Sidebar panel — slides in when open */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — click outside to close */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <motion.aside
              className={styles.sidebar}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              data-testid="dept-sidebar"
            >
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.headerNote} aria-hidden="true">♪</span>
                <div className={styles.headerText}>
                  <span className={styles.headerTitle}>NUESTRAS</span>
                  <span className={styles.headerSub}>OFICINAS</span>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                  type="button"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>

              {/* Nav list */}
              <nav aria-label="Navegación por departamentos">
                <ul className={styles.list}>
                  {DEPARTMENTS.map(dept => (
                    <SidebarItem
                      key={dept.id}
                      id={dept.id}
                      number={dept.id}
                      name={dept.name}
                      isActive={dept.id === activeDepartmentId}
                      onNavigate={(id) => { onNavigate(id); setIsOpen(false) }}
                    />
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
