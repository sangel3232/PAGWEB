import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            background: '#0A0A0A',
            textAlign: 'center',
            gap: '1.5rem',
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            color: '#F0EAD6',
          }}
        >
          <span
            style={{ fontSize: '4rem', lineHeight: 1, color: '#C9A84C' }}
            aria-hidden="true"
          >
            ♪
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.875rem',
              fontWeight: 700,
              color: '#F0EAD6',
              margin: 0,
            }}
          >
            Algo salió mal en esta sala
          </h2>
          <p style={{ color: '#9A8C6E', maxWidth: '400px', lineHeight: 1.7 }}>
            No pudimos cargar este departamento. Por favor intenta de nuevo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#C9A84C',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
            <a
              href="/"
              style={{
                padding: '0.5rem 1.5rem',
                background: 'transparent',
                color: '#C9A84C',
                border: '1px solid #C9A84C',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Volver a la recepción
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
