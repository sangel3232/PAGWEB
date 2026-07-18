import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { getCopyrightWorks, getCopyrightStats, type WorkRecord, type WorkStatus } from '../../data/copyright'
import { getPublicCatalog } from '../../data/catalog'
import styles from './CopyrightOffice.module.css'

type ActiveTab = 'obras' | 'logros' | 'contacto'

const STATUS_COLORS: Record<WorkStatus, string> = {
  'Registrada':  '#10b981',
  'Publicada':   '#3b82f6',
  'En proceso':  '#f59e0b',
  'Pendiente':   '#6b7280',
}

function WorkCard({ work, onSelect }: { work: WorkRecord; onSelect: (w: WorkRecord) => void }) {
  return (
    <motion.button
      className={styles.workCard}
      onClick={() => onSelect(work)}
      type="button"
      whileHover={{ scale: 1.02, borderColor: 'rgba(201,168,76,0.6)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.workCardTop}>
        <span className={styles.workTitle}>{work.title}</span>
        <span
          className={styles.workStatus}
          style={{ background: STATUS_COLORS[work.status] + '22', color: STATUS_COLORS[work.status], borderColor: STATUS_COLORS[work.status] + '55' }}
        >
          {work.status}
        </span>
      </div>
      <p className={styles.workGenre}>{work.genre}</p>
      <p className={styles.workDate}>
        Registro: {new Date(work.registrationDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      {work.registrationNumber && (
        <p className={styles.workCertificate}>Cert. {work.registrationNumber}</p>
      )}
    </motion.button>
  )
}

function WorkDetail({ work, onClose }: { work: WorkRecord; onClose: () => void }) {
  return (
    <motion.div
      className={styles.workDetailOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.workDetailBox}
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className={styles.detailHeader}>
          <h3 className={styles.detailTitle}>{work.title}</h3>
          <button className={styles.detailClose} onClick={onClose} type="button" aria-label="Cerrar">✕</button>
        </div>

        <div className={styles.detailScrollArea}>
          {/* Basic info */}
          <div className={styles.detailSection}>
            <h4 className={styles.detailSectionTitle}>📋 Información General</h4>
            <div className={styles.detailGrid}>
              <div><span className={styles.detailLabel}>Género</span><span className={styles.detailValue}>{work.genre}</span></div>
              <div><span className={styles.detailLabel}>Estado</span>
                <span style={{ color: STATUS_COLORS[work.status], fontWeight: 600 }}>{work.status}</span>
              </div>
              <div><span className={styles.detailLabel}>Fecha de registro</span>
                <span className={styles.detailValue}>{new Date(work.registrationDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {work.registrationNumber && (
                <div><span className={styles.detailLabel}>Certificado DNDA</span>
                  <span className={styles.detailValue}>{work.registrationNumber}</span>
                </div>
              )}
              {work.saycoRegistered !== undefined && (
                <div><span className={styles.detailLabel}>SAYCO</span>
                  <span className={styles.detailValue}>{work.saycoRegistered ? '✓ Registrada' : '✗ No registrada'}</span>
                </div>
              )}
              {work.asimproRegistered !== undefined && (
                <div><span className={styles.detailLabel}>ASIMPRO</span>
                  <span className={styles.detailValue}>{work.asimproRegistered ? '✓ Registrada' : '✗ No registrada'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Split Sheet */}
          {work.authors.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>👥 Split Sheet — Autores y Titulares</h4>
              <div className={styles.splitSheet}>
                {work.authors.map((a, i) => (
                  <div key={i} className={styles.splitRow}>
                    <div className={styles.splitInfo}>
                      <span className={styles.splitName}>{a.name}</span>
                      <span className={styles.splitRole}>{a.role}</span>
                    </div>
                    <div className={styles.splitPctWrapper}>
                      <div className={styles.splitPctBar} style={{ width: `${a.percentage}%` }} />
                      <span className={styles.splitPct}>{a.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {work.publishedPlatforms && work.publishedPlatforms.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>🎵 Plataformas Digitales</h4>
              <div className={styles.platformsList}>
                {work.publishedPlatforms.map(p => (
                  <span key={p} className={styles.platformChip}>{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Licenses */}
          {work.licenses && work.licenses.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>📄 Licencias Otorgadas</h4>
              {work.licenses.map(l => (
                <div key={l.id} className={styles.licenseCard}>
                  <div className={styles.licenseRow}>
                    <span className={styles.detailLabel}>Licenciatario</span>
                    <span className={styles.detailValue}>{l.licensee}</span>
                  </div>
                  <div className={styles.licenseRow}>
                    <span className={styles.detailLabel}>Tipo</span>
                    <span className={styles.detailValue}>{l.type}</span>
                  </div>
                  <div className={styles.licenseRow}>
                    <span className={styles.detailLabel}>Territorio</span>
                    <span className={styles.detailValue}>{l.territory}</span>
                  </div>
                  <div className={styles.licenseRow}>
                    <span className={styles.detailLabel}>Otorgada</span>
                    <span className={styles.detailValue}>{new Date(l.grantedDate).toLocaleDateString('es-CO')}</span>
                  </div>
                  {l.notes && <p className={styles.licenseNotes}>{l.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Modifications */}
          {work.modifications && work.modifications.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>📝 Historial de Modificaciones</h4>
              {work.modifications.map((m, i) => (
                <div key={i} className={styles.modRow}>
                  <span className={styles.modDate}>{new Date(m.date).toLocaleDateString('es-CO')}</span>
                  <span className={styles.modDesc}>{m.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          {work.documents && work.documents.length > 0 && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>📁 Documentos Legales</h4>
              <div className={styles.docsList}>
                {work.documents.map((d, i) => (
                  <a
                    key={i}
                    href={d.url || '#'}
                    className={styles.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${d.title}`}
                  >
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {d.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {work.notes && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailSectionTitle}>💬 Notas</h4>
              <p className={styles.workNotes}>{work.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function CopyrightOffice() {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('obras')
  const [selectedWork, setSelectedWork] = useState<WorkRecord | null>(null)
  const [works, setWorks] = useState<WorkRecord[]>([])
  const [stats, setStats] = useState(getCopyrightStats())
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const [filterStatus, setFilterStatus] = useState<WorkStatus | 'Todas'>('Todas')

  useEffect(() => {
    // Merge copyright registry with catalog songs
    const registeredWorks = getCopyrightWorks()
    const catalogSongs = getPublicCatalog()

    // Convert catalog songs to WorkRecord format if not already in registry
    const catalogAsWorks: WorkRecord[] = catalogSongs
      .filter(song => !registeredWorks.some(w => w.title === song.title))
      .map(song => ({
        id: `catalog-${song.id}`,
        title: song.title,
        genre: song.genre,
        registrationDate: song.year ? `${song.year}-01-01` : new Date().toISOString().split('T')[0],
        status: 'Registrada' as WorkStatus,
        authors: [
          { name: 'Emmanuel Segura Zapata', role: 'Compositor / Productor', percentage: 100 },
        ],
        publishedPlatforms: song.audioUrl ? ['Catálogo Digital ZC'] : undefined,
        notes: song.description,
      }))

    const allWorks = [...registeredWorks, ...catalogAsWorks]
    setWorks(allWorks)
    setStats(getCopyrightStats())
  }, [])

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

  const filteredWorks = filterStatus === 'Todas'
    ? works
    : works.filter(w => w.status === filterStatus)

  return (
    <div
      className={styles.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <motion.div
        className={styles.bg}
        animate={{ x: -offset.x, y: -offset.y }}
        transition={{ x: { duration: 0.65, ease: 'easeOut' }, y: { duration: 0.65, ease: 'easeOut' } }}
      >
        <img src="/images/derechos-autor-bg.jpg" alt="Oficina de Derechos de Autor" className={styles.bgImg} draggable={false} />
        <div className={styles.bgVignette} />
      </motion.div>

      <p className={styles.lookHint} aria-hidden="true">↔ Mueve el mouse para explorar</p>

      {/* Hotspot */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.button
            className={styles.hotspotBtn}
            style={{ left: '45%', top: '52%' }}
            onClick={() => setPanelOpen(true)}
            type="button"
            aria-label="Ver registros de derechos de autor"
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
            <span className={styles.hotspotTooltip} role="tooltip">Gestión de Obras</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className={styles.mainPanel}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Panel header */}
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <div>
                  <p className={styles.panelDept}>DEPARTAMENTO 6</p>
                  <h1 className={styles.panelTitle}>Derechos de Autor</h1>
                  <p className={styles.panelSubtitle}>Gestión y protección de la propiedad intelectual de Zapata Composiciones</p>
                </div>
                <button className={styles.closeBtn} onClick={() => setPanelOpen(false)} type="button" aria-label="Cerrar">✕</button>
              </div>

              {/* Tabs */}
              <div className={styles.tabs} role="tablist">
                {[
                  { id: 'obras' as ActiveTab, label: '📚 Registro de Obras' },
                  { id: 'logros' as ActiveTab, label: '🏆 Logros' },
                  { id: 'contacto' as ActiveTab, label: '📞 Consultar' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel body */}
            <div className={styles.panelBody}>

              {/* ── OBRAS TAB ── */}
              {activeTab === 'obras' && (
                <div className={styles.obrasTab}>
                  {/* Filters */}
                  <div className={styles.filters}>
                    {(['Todas', 'Registrada', 'Publicada', 'En proceso', 'Pendiente'] as const).map(s => (
                      <button
                        key={s}
                        className={`${styles.filterBtn} ${filterStatus === s ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilterStatus(s)}
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Works grid */}
                  {filteredWorks.length === 0
                    ? <p className={styles.emptyMsg}>No hay obras con ese filtro.</p>
                    : (
                      <div className={styles.worksGrid}>
                        {filteredWorks.map(work => (
                          <WorkCard key={work.id} work={work} onSelect={setSelectedWork} />
                        ))}
                      </div>
                    )
                  }
                </div>
              )}

              {/* ── LOGROS TAB ── */}
              {activeTab === 'logros' && (
                <motion.div
                  className={styles.logrosTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className={styles.statsGrid}>
                    {[
                      { icon: '📝', value: String(stats.totalRegistered), label: 'Obras registradas ante la DNDA' },
                      { icon: '🎵', value: String(stats.totalPublished), label: 'Canciones publicadas en plataformas' },
                      { icon: '🛡️', value: String(stats.protectedCatalog), label: 'Obras en catálogo protegido' },
                      { icon: '⚖️', value: '100%', label: 'Propiedad intelectual asegurada' },
                    ].map(s => (
                      <motion.div
                        key={s.label}
                        className={styles.statCard}
                        whileHover={{ scale: 1.03, borderColor: 'rgba(201,168,76,0.6)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={styles.statIcon} aria-hidden="true">{s.icon}</span>
                        <span className={styles.statValue}>{s.value}</span>
                        <span className={styles.statLabel}>{s.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.recognitionsSection}>
                    <h3 className={styles.recognitionsTitle}>Reconocimientos y Logros</h3>
                    <ul className={styles.recognitionsList}>
                      {stats.recognitions.map((r, i) => (
                        <li key={i} className={styles.recognitionItem}>
                          <span aria-hidden="true">✦</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* ── CONTACTO TAB ── */}
              {activeTab === 'contacto' && (
                <motion.div
                  className={styles.contactoTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className={styles.contactoInfo}>
                    <h3 className={styles.contactoTitle}>¿Necesitas registrar o proteger tu obra?</h3>
                    <p className={styles.contactoDesc}>
                      Nuestro equipo legal especializado en propiedad intelectual musical te acompañará en cada paso del proceso ante la DNDA, SAYCO y ASIMPRO.
                    </p>
                  </div>

                  <div className={styles.contactoOptions}>
                    <a
                      href="https://wa.me/573183592598?text=Hola%2C%20necesito%20información%20sobre%20registro%20de%20derechos%20de%20autor"
                      className={styles.whatsappBtn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Consultar por WhatsApp
                    </a>
                    <a
                      href="mailto:contacto@zapatacomposiciones.com?subject=Consulta%20Derechos%20de%20Autor"
                      className={styles.emailBtn}
                    >
                      ✉️ Enviar correo
                    </a>
                  </div>

                  <div className={styles.entitiesInfo}>
                    <h4 className={styles.entitiesTitle}>Entidades con las que trabajamos</h4>
                    <div className={styles.entitiesList}>
                      {[
                        { name: 'DNDA', full: 'Dirección Nacional de Derecho de Autor', country: '🇨🇴' },
                        { name: 'SAYCO', full: 'Sociedad de Autores y Compositores de Colombia', country: '🇨🇴' },
                        { name: 'ASIMPRO', full: 'Asociación Colombiana de Intérpretes y Productores Fonográficos', country: '🇨🇴' },
                      ].map(e => (
                        <div key={e.name} className={styles.entityCard}>
                          <span className={styles.entityFlag} aria-hidden="true">{e.country}</span>
                          <div>
                            <span className={styles.entityName}>{e.name}</span>
                            <span className={styles.entityFull}>{e.full}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Back button */}
            <div className={styles.panelFooter}>
              <button className={styles.backBtn} onClick={() => navigate('/hallway')} type="button">
                ← Volver al pasillo
              </button>

              {/* Developer credits — always visible at bottom */}
              <div className={styles.devCredits}>
                <span className={styles.devCreditsBadge}>⚙️ Desarrollo Web</span>
                <div className={styles.devCreditsInfo}>
                  <span className={styles.devName}>Sergio Luis Angel Romero</span>
                  <a href="mailto:sangel-2022a@corhuila.edu.co" className={styles.devEmail} aria-label="Correo del desarrollador">
                    sangel-2022a@corhuila.edu.co
                  </a>
                  <span className={styles.devRole}>Ingeniero de Sistemas · Corhuila 2025</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Work detail modal */}
      <AnimatePresence>
        {selectedWork && (
          <WorkDetail work={selectedWork} onClose={() => setSelectedWork(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
