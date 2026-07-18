import { useState, useEffect } from 'react'
import { getSubmissionsLocal, type Submission, type SubmissionStatus } from '../../lib/submissions'
import { getCatalog, saveSong, deleteSong, toggleSongAvailability, type CatalogSong } from '../../data/catalog'
import styles from './Admin.module.css'

const STATUSES: SubmissionStatus[] = ['Pendiente', 'En revisión', 'Aprobado', 'Finalizado']

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  'Pendiente':    '#f59e0b',
  'En revisión':  '#3b82f6',
  'Aprobado':     '#10b981',
  'Finalizado':   '#6b7280',
}

const DEPT_LABELS: Record<string, string> = {
  'composicion-musical':    'Composición Musical',
  'produccion-musical':     'Producción Musical',
  'proyectos-remixes':      'Proyectos y Remixes',
  'marketing-lanzamientos': 'Marketing y Lanzamientos',
  'derechos-autor':         'Derechos de Autor',
  'ceo':                    'Oficina del CEO',
}

type AdminView = 'solicitudes' | 'catalogo'

// ── Catalog Editor ─────────────────────────────────────────────────────
function CatalogEditor() {
  const [songs, setSongs] = useState<CatalogSong[]>([])
  const [editing, setEditing] = useState<CatalogSong | null>(null)
  const [form, setForm] = useState<Partial<CatalogSong>>({})
  const [audioFile, setAudioFile] = useState<File | null>(null)

  useEffect(() => { setSongs(getCatalog()) }, [])

  const refresh = () => setSongs(getCatalog())

  const startEdit = (song: CatalogSong) => {
    setEditing(song)
    setForm({ ...song })
    setAudioFile(null)
  }

  const startNew = () => {
    const blank: Partial<CatalogSong> = {
      id: `song-${Date.now()}`,
      title: '', artist: '', genre: '',
      audioUrl: '', year: String(new Date().getFullYear()),
      description: '', available: true,
    }
    setEditing(blank as CatalogSong)
    setForm(blank)
    setAudioFile(null)
  }

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAudioFile(file)
    setForm(p => ({ ...p, audioUrl: `/audio/${file.name}` }))
  }

  const handleSave = () => {
    if (!form.id || !form.title || !form.artist) return
    saveSong(form as CatalogSong)
    setEditing(null)
    refresh()
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar esta canción del catálogo?')) return
    deleteSong(id)
    refresh()
  }

  const handleToggle = (id: string) => {
    toggleSongAvailability(id)
    refresh()
  }

  return (
    <div className={styles.catalogEditor}>
      <div className={styles.catalogHeader}>
        <h3 className={styles.catalogEditorTitle}>🎵 Catálogo Musical — Sala de Espera</h3>
        <button className={styles.addSongBtn} onClick={startNew} type="button">+ Agregar canción</button>
      </div>

      <p className={styles.catalogNote}>
        Las canciones <strong>Visible</strong> aparecerán en la Sala de Espera para el público.
        Coloca los archivos MP3/MPEG en <code>public/audio/</code> y escribe la ruta aquí.
      </p>

      <div className={styles.catalogList}>
        {songs.length === 0 && <p className={styles.emptyMsg}>No hay canciones en el catálogo.</p>}
        {songs.map(song => (
          <div key={song.id} className={`${styles.catalogRow} ${!song.available ? styles.catalogRowHidden : ''}`}>
            <div className={styles.catalogSongInfo}>
              <span className={styles.catalogSongTitle}>{song.title || '(sin título)'}</span>
              <span className={styles.catalogSongArtist}>{song.artist}</span>
              <span className={styles.catalogSongGenre}>{song.genre} {song.year ? `· ${song.year}` : ''}</span>
              {song.audioUrl && (
                <audio src={song.audioUrl} controls className={styles.catalogAudioPreview} aria-label={`Preview de ${song.title}`} />
              )}
            </div>
            <div className={styles.catalogActions}>
              <button
                className={`${styles.catalogToggleBtn} ${song.available ? styles.catalogToggleBtnOn : styles.catalogToggleBtnOff}`}
                onClick={() => handleToggle(song.id)}
                type="button"
              >
                {song.available ? '👁 Visible' : '🚫 Oculto'}
              </button>
              <button className={styles.catalogEditBtn} onClick={() => startEdit(song)} type="button">✏️ Editar</button>
              <button className={styles.catalogDeleteBtn} onClick={() => handleDelete(song.id)} type="button">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className={styles.catalogForm}>
          <h4 className={styles.catalogFormTitle}>
            {songs.find(s => s.id === editing.id) ? 'Editar canción' : 'Nueva canción'}
          </h4>
          <div className={styles.catalogFormGrid}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Título *</label>
              <input className={styles.formInput} value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Nombre de la canción" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Artista *</label>
              <input className={styles.formInput} value={form.artist || ''} onChange={e => setForm(p => ({ ...p, artist: e.target.value }))} placeholder="Artista / productor" />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Género</label>
              <input className={styles.formInput} value={form.genre || ''} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))} placeholder="Pop, Balada, Regional..." />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Año</label>
              <input className={styles.formInput} value={form.year || ''} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2025" />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Descripción</label>
              <textarea className={styles.formTextarea} value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descripción breve..." rows={2} />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label className={styles.formLabel}>Ruta del audio</label>
              <input className={styles.formInput} value={form.audioUrl || ''} onChange={e => setForm(p => ({ ...p, audioUrl: e.target.value }))} placeholder="/audio/nombre.mp3" />
              <p className={styles.formHint}>O selecciona un archivo para obtener su nombre:</p>
              <input type="file" accept="audio/*" onChange={handleAudioSelect} className={styles.formFileInput} />
              {audioFile && <p className={styles.formHint}>✓ Archivo: <strong>{audioFile.name}</strong> — colócalo en <code>public/audio/</code></p>}
            </div>
          </div>
          <div className={styles.catalogFormActions}>
            <button className={styles.saveBtn} onClick={handleSave} type="button" disabled={!form.title || !form.artist}>✓ Guardar</button>
            <button className={styles.cancelBtn} onClick={() => setEditing(null)} type="button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Admin Panel ────────────────────────────────────────────────────────
interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selected, setSelected] = useState<Submission | null>(null)
  const [filterDept, setFilterDept] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [reply, setReply] = useState('')
  const [adminView, setAdminView] = useState<AdminView>('solicitudes')

  useEffect(() => {
    const raw = getSubmissionsLocal() as Submission[]
    setSubmissions(raw.reverse())
  }, [])

  const filtered = submissions.filter(s => {
    const deptOk = filterDept === 'all' || s.departmentSlug === filterDept
    const statusOk = filterStatus === 'all' || s.status === filterStatus
    return deptOk && statusOk
  })

  const updateStatus = (id: string | undefined, status: SubmissionStatus) => {
    if (!id) return
    const updated = submissions.map(s => (s.id === id ? { ...s, status } : s))
    setSubmissions(updated)
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev)
    localStorage.setItem('zc_submissions', JSON.stringify([...updated].reverse()))
  }

  const fmt = (d: unknown) => {
    if (!d) return '-'
    if (d instanceof Date) return d.toLocaleString('es-CO')
    if (typeof d === 'object' && d !== null && 'seconds' in d) return new Date((d as { seconds: number }).seconds * 1000).toLocaleString('es-CO')
    if (typeof d === 'string') return new Date(d).toLocaleString('es-CO')
    return '-'
  }

  return (
    <div className={styles.adminPage}>
      {/* Sidebar */}
      <aside className={styles.adminSidebar}>
        <div className={styles.adminLogo}><span aria-hidden="true">♪</span> ZC Admin</div>

        <nav className={styles.adminNav}>
          <p className={styles.navSection}>DEPARTAMENTOS</p>
          {[['all', 'Todos'], ...Object.entries(DEPT_LABELS)].map(([slug, label]) => (
            <button
              key={slug}
              className={`${styles.navItem} ${filterDept === slug && adminView === 'solicitudes' ? styles.navItemActive : ''}`}
              onClick={() => { setFilterDept(slug); setSelected(null); setAdminView('solicitudes') }}
              type="button"
            >
              {label}
              {slug !== 'all' && (
                <span className={styles.navBadge}>{submissions.filter(s => s.departmentSlug === slug).length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.adminLogoutWrapper}>
          <button className={styles.logoutBtn} onClick={onLogout} type="button">Cerrar sesión</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <h2 className={styles.adminTitle}>
            {adminView === 'catalogo' ? 'Catálogo Musical'
              : filterDept === 'all' ? 'Todas las solicitudes' : DEPT_LABELS[filterDept]}
          </h2>

          {/* View tabs */}
          <div className={styles.adminViewTabs}>
            <button
              className={`${styles.viewTab} ${adminView === 'solicitudes' ? styles.viewTabActive : ''}`}
              onClick={() => setAdminView('solicitudes')}
              type="button"
            >
              📋 Solicitudes
            </button>
            <button
              className={`${styles.viewTab} ${adminView === 'catalogo' ? styles.viewTabActive : ''}`}
              onClick={() => setAdminView('catalogo')}
              type="button"
            >
              🎵 Catálogo Musical
            </button>
          </div>

          {adminView === 'solicitudes' && (
            <div className={styles.statusFilters}>
              {['all', ...STATUSES].map(s => (
                <button
                  key={s}
                  className={`${styles.statusFilter} ${filterStatus === s ? styles.statusFilterActive : ''}`}
                  onClick={() => setFilterStatus(s)}
                  type="button"
                >
                  {s === 'all' ? 'Todos' : s}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Catalog view */}
        {adminView === 'catalogo' && (
          <div className={styles.catalogContainer}>
            <CatalogEditor />
          </div>
        )}

        {/* Solicitudes view */}
        {adminView === 'solicitudes' && (
          <div className={styles.adminBody}>
            {/* List */}
            <div className={styles.submissionsList}>
              {filtered.length === 0 && <p className={styles.emptyMsg}>No hay solicitudes que coincidan.</p>}
              {filtered.map(sub => (
                <button
                  key={sub.id}
                  className={`${styles.submissionCard} ${selected?.id === sub.id ? styles.submissionCardActive : ''}`}
                  onClick={() => setSelected(sub)}
                  type="button"
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardName}>{sub.clientName || 'Sin nombre'}</span>
                    <span
                      className={styles.cardStatus}
                      style={{ background: STATUS_COLORS[sub.status] + '22', color: STATUS_COLORS[sub.status], borderColor: STATUS_COLORS[sub.status] + '55' }}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className={styles.cardDept}>{sub.department}</p>
                  <p className={styles.cardDate}>{fmt(sub.createdAt)}</p>
                </button>
              ))}
            </div>

            {/* Detail */}
            {selected ? (
              <div className={styles.submissionDetail}>
                <div className={styles.detailHeader}>
                  <h3 className={styles.detailName}>{selected.clientName}</h3>
                  <div className={styles.detailStatusRow}>
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        className={`${styles.statusBtn} ${selected.status === s ? styles.statusBtnActive : ''}`}
                        style={selected.status === s ? { background: STATUS_COLORS[s] + '22', borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
                        onClick={() => updateStatus(selected.id, s)}
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailField}><span className={styles.detailLabel}>Departamento</span><span className={styles.detailValue}>{selected.department}</span></div>
                  <div className={styles.detailField}><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{selected.clientEmail || '-'}</span></div>
                  <div className={styles.detailField}><span className={styles.detailLabel}>Teléfono</span><span className={styles.detailValue}>{selected.clientPhone || '-'}</span></div>
                  <div className={styles.detailField}><span className={styles.detailLabel}>Fecha</span><span className={styles.detailValue}>{fmt(selected.createdAt)}</span></div>
                </div>

                {selected.conversation && selected.conversation.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailSectionTitle}>Historial de conversación</h4>
                    <div className={styles.conversationLog}>
                      {selected.conversation.map((msg, i) => (
                        <div key={i} className={`${styles.logMsg} ${msg.role === 'assistant' ? styles.logMsgAssistant : styles.logMsgUser}`}>
                          <span className={styles.logRole}>{msg.role === 'assistant' ? 'Asistente' : 'Cliente'}</span>
                          <p className={styles.logText}>{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.replySection}>
                  <h4 className={styles.detailSectionTitle}>Responder al cliente</h4>
                  <textarea className={styles.replyTextarea} value={reply} onChange={e => setReply(e.target.value)} placeholder="Escribe tu respuesta..." rows={4} />
                  <div className={styles.replyActions}>
                    <a href={`https://wa.me/${selected.clientPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(reply)}`} className={styles.replyWhatsappBtn} target="_blank" rel="noopener noreferrer">
                      💬 Responder por WhatsApp
                    </a>
                    <a href={`mailto:${selected.clientEmail}?body=${encodeURIComponent(reply)}`} className={styles.replyEmailBtn}>
                      ✉️ Responder por Email
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.detailEmpty}>
                <span aria-hidden="true">📂</span>
                <p>Selecciona una solicitud para ver el detalle</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
