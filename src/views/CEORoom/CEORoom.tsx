import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { CEO_PROFILE } from '../../data/ceo'
import styles from './CEORoom.module.css'

// ── Admin login state ──────────────────────────────────────────────────
const ADMIN_USER = 'zapata'
const ADMIN_PASS = 'ZC2025@admin'

type ActivePanel = null | 'video' | 'info' | 'admin-login' | 'admin-panel'

// ── Animated counter ───────────────────────────────────────────────────
function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className={styles.stat}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  )
}

export function CEORoom() {
  const navigate = useNavigate()
  const ceo = CEO_PROFILE

  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [adminError, setAdminError] = useState('')
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  // Parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = e.currentTarget.clientWidth / 2
    const cy = e.currentTarget.clientHeight / 2
    setOffset({ x: ((e.clientX - cx) / cx) * 12, y: ((e.clientY - cy) / cy) * 6 })
  }, [])
  const handleMouseLeave = useCallback(() => setOffset({ x: 0, y: 0 }), [])
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return
    setOffset({ x: (e.touches[0].clientX - touchRef.current.x) * 0.3, y: (e.touches[0].clientY - touchRef.current.y) * 0.15 })
  }, [])
  const handleTouchEnd = useCallback(() => { touchRef.current = null; setOffset({ x: 0, y: 0 }) }, [])

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      sessionStorage.setItem('zc_admin', '1')
      navigate('/admin')
    } else {
      setAdminError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div
      className={styles.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Parallax background ── */}
      <motion.div
        className={styles.bg}
        animate={{ x: -offset.x, y: -offset.y }}
        transition={{ x: { duration: 0.65, ease: 'easeOut' }, y: { duration: 0.65, ease: 'easeOut' } }}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/oficinaCEO-mobile-bg.jpeg" />
          <img src="/images/oficinaCEO-bg.jpg" alt="Oficina del CEO de Zapata Composiciones" className={styles.bgImg} draggable={false} />
        </picture>
        <div className={styles.bgVignette} />
      </motion.div>

      {/* Explore hint */}
      <p className={styles.lookHint} aria-hidden="true">↔ Mueve el mouse para explorar</p>

      {/* ── HOTSPOT 1 — Info desk (center of office) ── */}
      <AnimatePresence>
        {activePanel === null && (
          <>
            {/* Info hotspot */}
            <motion.button
              className={styles.hotspotBtn}
              style={{ left: '42%', top: '55%' }}
              onClick={() => setActivePanel('info')}
              type="button"
              aria-label="Ver información de la Oficina del CEO"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.4, duration: 0.35, ease: 'backOut' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className={styles.hotspotRing}  aria-hidden="true" />
              <span className={styles.hotspotRing2} aria-hidden="true" />
              <span className={styles.hotspotCore}  aria-hidden="true" />
              <span className={styles.hotspotTooltip} role="tooltip">Información</span>
            </motion.button>

            {/* CEO Chair hotspot — plays video first, then shows login */}
            <motion.button
              className={`${styles.hotspotBtn} ${styles.hotspotBtnGold}`}
              style={{ left: '58%', top: '48%' }}
              onClick={() => setActivePanel('video')}
              type="button"
              aria-label="Bienvenido CEO — ver video"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.6, duration: 0.35, ease: 'backOut' }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className={`${styles.hotspotRing} ${styles.hotspotRingGold}`}  aria-hidden="true" />
              <span className={`${styles.hotspotRing2} ${styles.hotspotRingGold}`} aria-hidden="true" />
              <span className={`${styles.hotspotCore} ${styles.hotspotCoreGold}`}  aria-hidden="true" />
              <span className={styles.hotspotTooltip} role="tooltip">Acceso CEO</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* ── PANEL 1 — Office info ── */}
      <AnimatePresence>
        {activePanel === 'info' && (
          <motion.div
            className={styles.infoPanel}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button className={styles.closeBtn} onClick={() => setActivePanel(null)} type="button" aria-label="Cerrar">✕</button>

            {/* Animated header */}
            <motion.div
              className={styles.panelHeader}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className={styles.ceoAvatarRow}>
                <div className={styles.ceoAvatarPlaceholder}>ESZ</div>
                <div>
                  <p className={styles.ceoTitle}>FUNDADOR &amp; CEO</p>
                  <h1 className={styles.ceoName}>{ceo.name}</h1>
                </div>
              </div>
              <p className={styles.welcomeMsg}>{ceo.welcomeMessage}</p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className={styles.statsRow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              {ceo.stats.map(s => (
                <StatCounter key={s.label} value={s.value} label={s.label} />
              ))}
            </motion.div>

            {/* Section tabs */}
            <motion.div
              className={styles.sectionTabs}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              {ceo.sections.map(s => (
                <div key={s.id} className={styles.sectionItem}>
                  <h3 className={styles.sectionItemTitle}>{s.title}</h3>
                  <p className={styles.sectionItemText}>{s.content}</p>
                </div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              className={styles.panelActions}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.35 }}
            >
              <a
                href={ceo.whatsappUrl}
                className={styles.whatsappBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hablar con el CEO por WhatsApp"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hablemos directo
              </a>
              <button className={styles.backBtn} onClick={() => navigate('/hallway')} type="button">
                ← Volver al pasillo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIDEO PANEL — plays before admin login ── */}
      <AnimatePresence>
        {activePanel === 'video' && (
          <motion.div
            className={styles.videoOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className={styles.videoBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Skip / close button */}
              <button
                className={styles.videoSkipBtn}
                onClick={() => setActivePanel('admin-login')}
                type="button"
                aria-label="Saltar video e ir al acceso CEO"
              >
                Saltar →
              </button>

              {/* The CEO video */}
              <video
                className={styles.video}
                src="/video/VIDEOCEO.mp4"
                autoPlay
                playsInline
                controls
                onEnded={() => setActivePanel('admin-login')}
                aria-label="Video de bienvenida del CEO Emmanuel Segura Zapata"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PANEL 2 — CEO Admin Login ── */}
      <AnimatePresence>
        {activePanel === 'admin-login' && (
          <motion.div
            className={styles.adminLoginOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.adminLoginBox}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
            >
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <span key={i} className={styles.loginParticle} style={{ '--i': i } as React.CSSProperties} aria-hidden="true" />
              ))}

              <button className={styles.closeBtn} onClick={() => { setActivePanel(null); setAdminError('') }} type="button" aria-label="Cerrar">✕</button>

              <div className={styles.loginHeader}>
                <div className={styles.loginLogoGlow} aria-hidden="true">♪</div>
                <h2 className={styles.loginTitle}>BIENVENIDO</h2>
                <p className={styles.loginSubtitle}>
                  CEO <strong>EMMANUEL SEGURA ZAPATA</strong>
                </p>
                <p className={styles.loginDesc}>Acceso exclusivo al Panel Administrativo</p>
              </div>

              <form className={styles.loginForm} onSubmit={handleAdminLogin} noValidate>
                <div className={styles.loginField}>
                  <label className={styles.loginLabel} htmlFor="ceo-user">Usuario</label>
                  <input
                    id="ceo-user"
                    className={styles.loginInput}
                    type="text"
                    value={adminUser}
                    onChange={e => setAdminUser(e.target.value)}
                    placeholder="Usuario"
                    autoComplete="username"
                    aria-label="Usuario"
                  />
                </div>
                <div className={styles.loginField}>
                  <label className={styles.loginLabel} htmlFor="ceo-pass">Contraseña</label>
                  <input
                    id="ceo-pass"
                    className={styles.loginInput}
                    type="password"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-label="Contraseña"
                  />
                </div>
                {adminError && (
                  <motion.p
                    className={styles.loginError}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    role="alert"
                  >
                    {adminError}
                  </motion.p>
                )}
                <motion.button
                  className={styles.loginBtn}
                  type="submit"
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(201,168,76,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  ACCEDER AL PANEL
                </motion.button>
              </form>

              <p className={styles.loginFooter}>Acceso restringido · Zapata Composiciones © 2025</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
