import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { api } from './api.js'
import { installCatalog } from './data.js'
import { adminRedirectUrl } from './routing.js'

// Lazy photos sit on a shimmer until they arrive, then fade in (see .is-loaded).
// Load/error don't bubble, so catch them on the way down.
const settle = (e) => e.target.tagName === 'IMG' && e.target.classList.add('is-loaded')
document.addEventListener('load', settle, true)
document.addEventListener('error', settle, true)

const root = createRoot(document.getElementById('root'))
async function boot() {
  const adminRedirect = adminRedirectUrl(window.location.href)
  if (adminRedirect) { window.location.replace(adminRedirect); return }
  const adminHost = window.location.hostname.startsWith('admin.')
  if (adminHost) {
    document.title = 'Maroon · Owner studio'
    const { default: Admin } = await import('./Admin.jsx')
    root.render(<StrictMode><Admin /></StrictMode>)
  } else {
    installCatalog(await api('/api/storefront'))
    const { default: App } = await import('./App.jsx')
    root.render(<StrictMode><App /></StrictMode>)
  }
}
boot().catch(() => root.render(<main className="boot-error"><h1>We’ll be right back</h1><p>Maroon could not connect to the store. Please try again.</p><button className="btn" onClick={() => location.reload()}>Try again</button></main>))
