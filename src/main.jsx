import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Lazy photos sit on a shimmer until they arrive, then fade in (see .is-loaded).
// Load/error don't bubble, so catch them on the way down.
const settle = (e) => e.target.tagName === 'IMG' && e.target.classList.add('is-loaded')
document.addEventListener('load', settle, true)
document.addEventListener('error', settle, true)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
