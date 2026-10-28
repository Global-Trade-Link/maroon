import { useEffect, useState } from 'react'
import Landing from './Landing.jsx'
import Builder from './Builder.jsx'
import { npr } from './data.js'

export default function App() {
  const [start, setStart] = useState(null)
  const [cart, setCart] = useState([])
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [start])

  useEffect(() => {
    if (!receipt) return
    const t = setTimeout(() => setReceipt(null), 4200)
    return () => clearTimeout(t)
  }, [receipt])

  return (
    <div className="shell">
      {start ? (
        <Builder
          start={start}
          onBack={() => setStart(null)}
          onAdd={(design) => {
            setCart((c) => [...c, design])
            setReceipt(design)
          }}
        />
      ) : (
        <Landing
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
