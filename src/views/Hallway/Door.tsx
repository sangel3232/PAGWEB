import { motion } from 'motion/react'
import type { DoorProps } from '../../types'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import styles from './Hallway.module.css'

export function Door({ departmentId: _departmentId, label, number, onClick }: DoorProps) {
  const { onKeyDown } = useKeyboardNav(onClick)

  return (
    <motion.div
      className={styles.door}
      role="button"
      tabIndex={0}
      aria-label={`Entrar al departamento ${label}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      whileHover={{ scale: 1.05 }}
      whileFocus={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Door number */}
      <div className={styles.doorNumber} aria-hidden="true">
        {number}
      </div>

      {/* Door knocker / decoration */}
      <div className={styles.doorKnocker} aria-hidden="true">
        <svg viewBox="0 0 24 32" width="20" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="0" width="6" height="4" rx="2" fill="#C9A84C" />
          <path d="M12 4 Q6 10 6 16 Q6 24 12 26 Q18 24 18 16 Q18 10 12 4Z" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="28" r="2" fill="#C9A84C" />
        </svg>
      </div>

      {/* Door label */}
      <div className={styles.doorLabel}>
        <span className={styles.doorLabelText}>{label}</span>
      </div>

      {/* Door frame glow effect */}
      <div className={styles.doorGlow} aria-hidden="true" />
    </motion.div>
  )
}
