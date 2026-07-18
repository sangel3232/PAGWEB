import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <main className={styles.page}>
      <span className={styles.code} aria-hidden="true">
        404
      </span>
      <span className={styles.icon} aria-hidden="true">
        ♪
      </span>
      <h1 className={styles.title}>Esta sala no existe</h1>
      <p className={styles.description}>
        La habitación que buscas no forma parte de la oficina. Regresa a la recepción
        para encontrar lo que necesitas.
      </p>
      <Link to="/" className={styles.homeLink}>
        Volver a la recepción
      </Link>
    </main>
  )
}
