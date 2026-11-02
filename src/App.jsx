import { useEffect, useRef, useState } from 'react'
import Landing from './Landing.jsx'
import Builder from './Builder.jsx'
import { PAGES, npr } from './data.js'

export default function App() {
  const [start, setStart] = useState(null)
  const [cart, setCart] = useState([])
  const [receipt, setReceipt] = useState(null)
  const [hash, setHash] = useState(window.location.hash)

  // #/<page> is a shop page, #/<page>/<id> jumps to a part of it; any other hash
  // is an anchor on the home page.
  const [path, part] = hash.startsWith('#/') ? hash.slice(2).split('/') : []
  const page = PAGES[path] ? path : null

  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash)
      setStart(null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // New page or builder: jump to the top, or to the anchor once it has rendered.
  // Moving between sections of the home page glides instead.
  const view = useRef(null)
  useEffect(() => {
    const now = start ? 'builder' : page || 'home'
    const glide = view.current === now
    view.current = now
    const el = now === 'home' ? hash.length > 1 && document.getElementById(hash.slice(1)) : part && document.getElementById(part)
    const bar = document.querySelector('.masthead')?.offsetHeight || 0
    window.scrollTo({
      top: el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - bar) : 0,
      behavior: glide ? 'smooth' : 'instant',
    })
  }, [start, page, hash])

  useEffect(() => {
    if (!receipt) return
    const t = setTimeout(() => setReceipt(null), 4200)
    return () => clearTimeout(t)
  }, [receipt])

  return (
    <div className="shell">
      {start ? (
        <Builder
          key={start.form}
          start={start}
          cart={cart.length}
          onSwitch={setStart}
          onBack={() => setStart(null)}
          onAdd={(design) => {
            setCart((c) => [...c, design])
            setReceipt(design)
          }}
        />
      ) : (
        <Landing
          page={page}
          onOpen={setStart}
          onAdd={(item) => {
            setCart((c) => [...c, item])
            setReceipt(item)
          }}
          cart={cart.length}
        />
      )}

      {receipt && (
        <p className="receipt" role="status">
          Added — {receipt.charms
            ? `${receipt.charms.length} charm${receipt.charms.length === 1 ? '' : 's'} on a ${receipt.form}`
            : receipt.name}
          , {npr(receipt.total)}. Demo cart, nothing charged.
        </p>
      )}
    </div>
  )
}
