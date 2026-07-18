import type React from 'react'

export function useKeyboardNav(
  onEnter: () => void,
  onEscape?: () => void
): { onKeyDown: React.KeyboardEventHandler } {
  const onKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEnter()
    } else if (event.key === 'Escape' && onEscape) {
      event.preventDefault()
      onEscape()
    }
  }

  return { onKeyDown }
}
