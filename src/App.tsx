import './styles/tokens.css'
import './styles/global.css'
import { AppRouter } from './router/AppRouter'
import { useAmbientAudio } from './hooks/useAmbientAudio'

function App() {
  useAmbientAudio()

  return <AppRouter />
}

export default App
