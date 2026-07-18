import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './Admin.module.css'

// Simple local auth — replace with Firebase Auth for production
const ADMIN_USER = 'zapata'
const ADMIN_PASS = 'ZC2025@admin'

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('zc_admin', '1')
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.loginLogo}>
          <span className={styles.loginNote} aria-hidden="true">♪</span>
          <h1 className={styles.loginTitle}>ZAPATA<br />COMPOSICIONES</h1>
          <p className={styles.loginSub}>Panel Administrativo</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-user">Usuario</label>
            <input
              id="admin-user"
              className={styles.input}
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="Usuario"
              autoComplete="username"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-pass">Contraseña</label>
            <input
              id="admin-pass"
              className={styles.input}
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.loginError} role="alert">{error}</p>}
          <button className={styles.loginBtn} type="submit">
            Ingresar al Panel
          </button>
        </form>
      </motion.div>
    </div>
  )
}
