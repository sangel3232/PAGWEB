import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.note} aria-hidden="true">
        ♪
      </div>
      <div className={styles.spinner} aria-hidden="true" />
      <p
        className={styles.text}
        aria-live="polite"
        role="status"
      >
        Cargando...
      </p>
    </div>
  )
}
