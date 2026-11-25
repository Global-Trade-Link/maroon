import { useEffect, useRef, useState } from 'react'
import Landing, { Footer, Masthead } from './Landing.jsx'
import Builder from './Builder.jsx'
import { PAGES, npr, BUILDS, chainsFor, isAvailable, charmOf } from './data.js'
import Checkout, { Policies } from './Checkout.jsx'
import { addToCart, MAX_QUANTITY, restoreCart } from './cart.js'
import { ORDER_CHANGED, pendingPayment, saveGuestOrder, forgetUnavailableOrder } from './guestOrders.js'
import { PaymentContext } from './PaymentContext.js'
import { api } from './api.js'

export default function App() {
  const [start, setStart] = useState(null)
  const [editing, setEditing] = useState(null)
  const [initialCart] = useState(() => { try { return restoreCart(JSON.parse(localStorage.getItem('maroon-cart') || '[]')) } catch { return { items: [], limited: false } } })
  const [cart, setCart] = useState(initialCart.items)
  const [receipt, setReceipt] = useState(initialCart.limited ? { limitNotice: true } : null)
  const [unpaid, setUnpaid] = useState(() => pendingPayment())
  const [hash, setHash] = useState(window.location.hash)

  // #/<page> is a shop page, #/<page>/<id> jumps to a part of it; any other hash
  // is an anchor on the home page.
  const [path, part] = hash.startsWith('#/') ? hash.slice(2).split('/') : []
  const page = PAGES[path] ? path : null
  const commerce = ['cart', 'checkout', 'payment', 'confirmation', 'order', 'policy'].includes(path)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  useEffect(() => { localStorage.setItem('maroon-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { document.title = page ? `${PAGES[page].name} · Maroon` : commerce ? `${path[0].toUpperCase() + path.slice(1)} · Maroon` : 'Maroon · Charms that carry a story' }, [page, path, commerce])
  const openBuilder = (config, keepEditing = false) => {
    if (!keepEditing) setEditing(null)
    const candidate = config || BUILDS[0]
    if (!candidate) return
    const base = chainsFor(candidate.form).find((c) => c.id === candidate.chain) || chainsFor(candidate.form)[0]
    if (!base) return
    setStart({ ...candidate, chain: base.id, charms: (candidate.charms || []).filter((id) => isAvailable(charmOf(id)) && charmOf(id).compatibleForms.includes(candidate.form)) })
  }
  const edit = (item) => {
    setEditing(item.cartId)
    setStart({ ...item, charms: item.rack.filter(Boolean) })
    setReceipt(null)
  }
  const add = (design) => {
    if (editing) {
      setCart((items) => items.map((item) => item.cartId === editing ? { ...design, quantity: item.quantity, cartId: item.cartId } : item))
      setStart(null); setEditing(null); location.hash = '#/cart'
      setReceipt({ ...design, updated: true })
    } else {
      setCart((items) => addToCart(items, design))
      setReceipt({ ...design, limitNotice: design.type === 'product' && cart.some((item) => item.type === 'product' && item.productId === design.productId && item.quantity >= MAX_QUANTITY) })
    }
  }

  useEffect(() => {
    let active = true
    const sync = () => setUnpaid(pendingPayment())
    const refresh = async () => {
      sync()
      const saved = pendingPayment()
      if (!saved) return
      try {
        const order = await api(`/api/orders/${saved.order.id}`, { headers: { Authorization: `Bearer ${saved.accessToken}` } })
        if (active && pendingPayment()?.order.id === order.id) saveGuestOrder({ ...saved, order })
      } catch (error) {
        if (active && error.status === 404 && pendingPayment()?.order.id === saved.order.id) forgetUnavailableOrder(saved.order.id)
        // Transient network errors keep the saved payment available.
      }
    }
    window.addEventListener(ORDER_CHANGED, sync)
    window.addEventListener('storage', sync)
    window.addEventListener('focus', refresh)
    refresh()
    return () => {
      active = false
      window.removeEventListener(ORDER_CHANGED, sync)
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  useEffect(() => {
    const onHash = () => {
      setHash(window.location.hash)
      setStart(null)
      setEditing(null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // New page or builder: jump to the top, or to the anchor once it has rendered.
  // Moving between sections of the home page glides instead.
  const view = useRef(null)
  useEffect(() => {
      const now = start ? 'builder' : commerce ? path : page || 'home'
    const glide = view.current === now
    view.current = now
    const el = now === 'home' ? hash.length > 1 && document.getElementById(hash.slice(1)) : part && document.getElementById(part)
    const bar = document.querySelector('.masthead')?.offsetHeight || 0
    window.scrollTo({
      top: el ? Math.max(0, el.getBoundingClientRect().top + window.scrollY - bar) : 0,
      behavior: glide ? 'smooth' : 'instant',
    })
  }, [start, page, hash, commerce, path])

  useEffect(() => {
    if (!receipt) return
    const t = setTimeout(() => setReceipt(null), 4200)
    return () => clearTimeout(t)
  }, [receipt])

  return (
    <PaymentContext.Provider value={unpaid}><div className="shell">
      {unpaid && (start || !['payment', 'order'].includes(path)) && <aside className="payment-reminder" aria-label="Unfinished payment"><span>Your order <strong>{unpaid.order.id}</strong> is waiting for payment.</span><a href="#/payment">Resume payment</a></aside>}
      {start ? (
        <Builder
          key={`${start.form}-${editing || 'new'}`}
          start={start}
          editing={!!editing}
          cart={cartCount}
          onSwitch={(config) => openBuilder(config, !!editing)}
          onBack={() => { setStart(null); setEditing(null) }}
          onAdd={add}
        />
      ) : commerce ? <><Masthead cart={cartCount} />{path === 'policy' ? <Policies policy={part} /> : <Checkout key={path} cart={cart} setCart={setCart} mode={path === 'order' ? 'payment' : path} onEdit={edit} pendingPayment={unpaid} />}<Footer /></> : (
        <Landing
          page={page}
          onOpen={openBuilder}
          onAdd={add}
          cart={cartCount}
        />
      )}

      {receipt && (
        <p className="receipt" role="status">
          {receipt.limitNotice ? `Maximum ${MAX_QUANTITY} of each item per order. Review quantities in your bag.` : <>{receipt.updated ? 'Updated' : 'Added'} — {receipt.charms
            ? `${receipt.charms.length} charm${receipt.charms.length === 1 ? '' : 's'} on a ${receipt.form}`
            : receipt.name}
          , {npr(receipt.total)}.</>} <a href="#/cart" onClick={() => setReceipt(null)}>View bag</a> · <a href={unpaid ? '#/payment' : '#/checkout'} onClick={() => setReceipt(null)}>{unpaid ? 'Resume payment' : 'Checkout'}</a>
        </p>
      )}
    </div></PaymentContext.Provider>
  )
}
