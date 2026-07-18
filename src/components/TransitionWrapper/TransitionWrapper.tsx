import { motion } from 'motion/react'
import type { TransitionWrapperProps } from '../../types'
import styles from './TransitionWrapper.module.css'

const EASING = [0.25, 0.46, 0.45, 0.94] as const
const DURATION = 0.6

type VariantConfig = {
  initial: Record<string, number>
  animate: Record<string, number>
  exit: Record<string, number>
}

const variants: Record<NonNullable<TransitionWrapperProps['variant']>, VariantConfig> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-left': {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  },
  'slide-right': {
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 40, opacity: 0 },
  },
  'zoom-in': {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
}

const transition = {
  duration: DURATION,
  ease: EASING,
}

export function TransitionWrapper({
  children,
  variant = 'fade',
}: TransitionWrapperProps) {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    return <div className={styles.wrapper}>{children}</div>
  }

  const variantConfig = variants[variant]

  return (
    <motion.div
      className={styles.wrapper}
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
