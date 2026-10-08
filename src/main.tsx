import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { applySettings } from './ui/applySettings'
import { store } from './state/store'

applySettings(store.getSnapshot().settings)
store.subscribe(() => applySettings(store.getSnapshot().settings))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
