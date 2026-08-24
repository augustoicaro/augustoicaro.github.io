import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MetronomeStandalone from './components/metronome/MetronomeStandalone.tsx'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isMetronomePage = normalizedPath === '/metronome'

if (isMetronomePage) {
  document.title = 'Metronome Trainer | Augusto Icaro'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isMetronomePage ? <MetronomeStandalone /> : <App />}
  </StrictMode>,
)
