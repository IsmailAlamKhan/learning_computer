import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { applySettings } from './ui/applySettings'
import { store } from './state/store'
import { startPwa } from './pwa/offline'

applySettings(store.getSnapshot().settings)
store.subscribe(() => applySettings(store.getSnapshot().settings))

startPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
