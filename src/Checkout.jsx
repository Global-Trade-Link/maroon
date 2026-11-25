import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Mail, Minus, Pencil, Plus, ShoppingBag, Truck } from 'lucide-react'
import { api, freshKey } from './api.js'
import { saveGuestOrder } from './guestOrders.js'
import { validatePaymentDetails } from './paymentValidation.js'
import { STORE, npr, chainOf, charmOf, isAvailable } from './data.js'
import Piece from './Piece.jsx'
import { Flourish } from './Ornament.jsx'
import './commerce.css'
import './checkout.css'

const stored = (key) => { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } }
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const policyText = (text) => text?.startsWith('LOCAL TEST') ? '' : text
const placeholderQr = (order) => order.fonepayQr?.endsWith('/local-test-payment.svg')
export const checkoutItems = (cart) => cart.map((item) => item.type === 'custom'
  ? { type: 'custom', form: item.form, chain: item.chain, rack: item.rack, assembly: item.assembly, quantity: item.quantity }
  : { type: 'product', productId: item.productId, quantity: item.quantity })

function Heading({ title, children }) {
  return <div className="commerce-heading"><h1 className="commerce-title">{title}</h1><Flourish />{children && <p>{children}</p>}</div>
}
function Field({ label, children, hint, hintId, error, errorId }) {
  return <label className="shop-field"><span>{label}</span>{children}{hint && <small id={hintId}>{hint}</small>}{error && <span id={errorId} className="shop-field-error" role="alert">{error}</span>}</label>
}
function Steps({ current }) {
  return <nav className="checkout-steps" aria-label="Checkout progress">{[['cart', 'Your bag'], ['checkout', 'Delivery'], ['payment', 'Payment']].map(([id, label], i) =>
    <span key={id}>{i > 0 && <span className="step-rule" aria-hidden="true" />}{id === 'payment' || current === 'payment'
      ? <span aria-current={current === id ? 'step' : undefined}>{label}</span>
      : <a href={`#/${id}`} aria-current={current === id ? 'step' : undefined}>{label}</a>}</span>)}</nav>
}
export function Policies({ policy }) {
  const names = { deliveryPolicy: 'Delivery policy', returnsPolicy: 'Returns policy', privacyPolicy: 'Privacy policy', terms: 'Terms and conditions', contact: 'Contact Maroon' }
  return <main className="commerce shop-commerce"><a className="shop-back" href="#top"><ArrowLeft size={16} />Back to the store</a><Heading title={names[policy] || 'Store policies'} />
    {policy === 'contact' ? <div className="policy-copy"><p>{STORE.businessAddress}</p><p>{STORE.contactPhone && <a href={`tel:${STORE.contactPhone}`}>{STORE.contactPhone}</a>}</p><p>{STORE.contactEmail && <a href={`mailto:${STORE.contactEmail}`}>{STORE.contactEmail}</a>}</p></div>
      : <div className="policy-copy">{policyText(STORE[policy]) || 'Please contact Maroon for the details of this policy.'}</div>}
    <nav className="policy-links">{Object.entries(names).map(([id, name]) => <a href={`#/policy/${id}`} key={id}>{name}</a>)}</nav></main>
}
function Summary({ totals, cart = [], children, showItems = true }) {
  return <aside className="shop-summary"><h2>A little something for you</h2>
    {showItems && totals?.lines && <ul className="shop-summary-lines">{totals.lines.map((line, i) => {
      const image = cart[i]?.img || line.img || line.base?.img
      return <li key={i}><div className="summary-media">{line.type === 'custom' && chainOf(line.base.id)
        ? <Piece form={line.form} chain={line.base.id} charms={line.charms.map((charm) => charmOf(charm?.id) ? charm.id : null)} idle={false} />
        : image ? <img src={image} alt="" /> : <ShoppingBag size={22} />}</div>
        <div><span className="shop-product-name">{line.name}</span><small>Quantity {line.quantity}</small>{line.type === 'custom' && <small>{line.assembly === 'exact' ? 'Your exact charm layout' : 'Arranged by the studio'}</small>}</div><strong>{npr(line.total)}</strong></li>
    })}</ul>}
    <div className="shop-totals" aria-live="polite">{totals ? <><p>Subtotal<span>{npr(totals.subtotal)}</span></p><p>Delivery<span>{npr(totals.shippingFee)}</span></p><p className="shop-total">Total<strong>{npr(totals.total)}</strong></p></> : <p>Calculating your total…</p>}</div>{children}</aside>
}
function Empty() {
  return <main className="commerce shop-commerce"><div className="shop-empty"><ShoppingBag size={34} strokeWidth={1.2} /><Heading title="Your story starts here">Choose a favorite piece, or create something only you could make.</Heading><a className="btn" href="#build">Explore the charm bar<ArrowRight size={16} /></a></div></main>
}
function ResumePayment({ saved }) {
  return <main className="commerce shop-commerce"><Heading title="Your pieces are waiting">Your order is saved. Pick up where you left off.</Heading><section className="resume-payment"><div><h2>Finish your payment</h2><p>Order <strong>{saved.order.id}</strong> · {npr(saved.order.total)}</p><p>Your pieces and delivery details are already saved. Any new items in your bag will stay there.</p></div><a href="#/payment" className="btn">Resume payment<ArrowRight size={16} /></a></section><a href="#top" className="shop-back"><ArrowLeft size={16} />Keep exploring</a></main>
}
function Confirmation({ saved }) {
  const order = saved?.order
  if (!order) return <Empty />
  if (!['submitted', 'paid'].includes(order.paymentStatus)) return <main className="commerce shop-commerce"><Heading title="One last little step">Submit your payment details to complete your order.</Heading><a className="btn" href="#/payment">Continue to payment<ArrowRight size={16} /></a></main>
  return <main className="commerce shop-commerce confirmation-page"><div className="confirmation-intro"><span className="confirmation-check"><Check size={28} strokeWidth={1.4} /></span>
    <Heading title="Your story is in good hands">Thank you, {order.customer.name.split(' ')[0]}. Your order is with us.</Heading><p className="confirmation-reference">Order {order.id}</p>
    <p>We’ve received your payment details. Once we’ve checked the payment, we’ll send your order confirmation to <strong>{order.customer.email}</strong>.</p><p>You’re all done here. We’ll keep you updated by email.</p><a href="#top" className="btn">Continue shopping<ArrowRight size={16} /></a>
    </div><div className="confirmation-details"><Summary totals={order} /><section className="confirmation-delivery"><Truck size={22} strokeWidth={1.3} /><div><h2>Chosen by you. Sent with love.</h2><p>{order.customer.name}<br />{order.customer.address}<br />{order.customer.area}</p>{order.customer.notes && <p>{order.customer.notes}</p>}<p>Need a hand? <a href="#/policy/contact">Contact Maroon</a> with your order number.</p></div></section></div></main>
}
function Payment({ saved }) {
  const [order, setOrder] = useState(saved?.order)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(!!saved)
  const [fieldErrors, setFieldErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const referenceRef = useRef(null)
  const proofRef = useRef(null)
  const errorRef = useRef(null)
  const focusField = (field) => requestAnimationFrame(() => {
    const input = field === 'reference' ? referenceRef.current : proofRef.current
    input?.focus({ preventScroll: true })
    input?.closest('label')?.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
  const updateValidation = () => {
    setError('')
    if (attempted) setFieldErrors(validatePaymentDetails(referenceRef.current?.value, proofRef.current?.files?.[0]))
  }
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])
  useEffect(() => {
    if (!saved) return
    let active = true
    api(`/api/orders/${saved.order.id}`, { headers: { Authorization: `Bearer ${saved.accessToken}` } }).then((next) => {
      if (!active) return
      setOrder(next); saveGuestOrder({ ...saved, order: next })
      if (['submitted', 'paid'].includes(next.paymentStatus)) location.replace('#/confirmation')
    }).catch((e) => { if (active) setError(e.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  if (!order) return <Empty />
  const cancelled = order.fulfillmentStatus === 'cancelled'
  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    const file = form.get('proof')
    setAttempted(true)
    setError('')
    const problems = validatePaymentDetails(form.get('transactionReference'), file)
    setFieldErrors(problems)
    if (Object.keys(problems).length) { focusField(problems.reference ? 'reference' : 'proof'); return }
    if (!file?.size) form.delete('proof')
    setBusy(true); setError('')
    try {
      const next = await api(`/api/orders/${order.id}/payment`, { method: 'POST', headers: { Authorization: `Bearer ${saved.accessToken}` }, body: form })
      saveGuestOrder({ ...saved, order: next }); location.replace('#/confirmation')
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return <main className="commerce shop-commerce"><Steps current="payment" /><Heading title={cancelled ? 'Please get in touch' : 'One last little step'}>{cancelled ? 'This order has been cancelled. Contact us before making a payment.' : 'Scan, send, and leave the rest to us.'}</Heading>
    <div className="shop-checkout-grid"><section className="shop-panel payment-panel"><h2>{cancelled ? 'Order cancelled' : 'Pay with Fonepay'}</h2>
    {!cancelled && <><p>Order <strong>{order.id}</strong></p>{placeholderQr(order)
      ? <div className="qr-placeholder"><ShoppingBag size={28} strokeWidth={1.2} /><p>The merchant QR hasn’t been added yet.</p><a href="#/policy/contact">Contact Maroon for payment details</a></div>
      : <><p className="payment-merchant">Merchant: <strong>{order.merchantName}</strong></p><img className="payment-qr" src={order.fonepayQr} alt={`Fonepay QR for ${order.merchantName}`} /><a className="shop-link" href={order.fonepayQr} target="_blank" rel="noreferrer">Open QR image</a></>}
      <p className="payment-total">{npr(order.total)}</p><p className="payment-reference">Use <strong>{order.id}</strong> in your payment remarks.</p>{!placeholderQr(order) && <p>{order.paymentInstructions}</p>}
      {order.paymentStatus === 'rejected' && <p className="shop-alert">We couldn’t confirm your previous payment. Please check the reference or contact us.</p>}
      <form onSubmit={submit} noValidate><p className="payment-evidence-help">Add a transaction reference or a payment screenshot to continue.</p>
        <Field label="Transaction reference" hint="Find this on the receipt in your banking app. You can upload a screenshot instead." hintId="payment-reference-help" error={fieldErrors.reference} errorId="payment-reference-error"><input ref={referenceRef} name="transactionReference" defaultValue={order.transactionReference} maxLength={160} aria-invalid={!!fieldErrors.reference} aria-describedby={`payment-reference-help${fieldErrors.reference ? ' payment-reference-error' : ''}`} onChange={updateValidation} /></Field>
        <Field label="Payment screenshot (optional)" hint="JPEG, PNG or WebP, up to 5 MB. Shared privately with Maroon." hintId="payment-proof-help" error={fieldErrors.proof} errorId="payment-proof-error"><input ref={proofRef} name="proof" type="file" accept="image/jpeg,image/png,image/webp" aria-invalid={!!fieldErrors.proof} aria-describedby={`payment-proof-help${fieldErrors.proof ? ' payment-proof-error' : ''}`} onChange={updateValidation} /></Field>
        {error && <div ref={errorRef} className="shop-alert payment-submit-error" role="alert" tabIndex={-1}><strong>We couldn’t submit your payment details.</strong><p>{error}</p></div>}
        <button className="btn shop-full" disabled={busy || loading}>{busy ? 'Submitting…' : 'Submit payment details'}<ArrowRight size={16} /></button><p className="shop-fine-print">We check every payment before confirming your order. Confirmation will be sent to {order.customer.email}.</p></form></>}
    </section><Summary totals={order}><p className="shop-fine-print"><LockKeyhole size={15} />Your payment details stay private.</p></Summary></div></main>
}

export default function Checkout({ cart, setCart, mode, onEdit, pendingPayment }) {
  const [totals, setTotals] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const quoteVersion = useRef(0)
  const pending = useRef(stored('maroon-pending-checkout'))
  const [locked, setLocked] = useState(!!pending.current)
  const saved = stored('maroon-last-order')
  const [customer, setCustomer] = useState(pending.current?.body.customer || { name: '', phone: '', email: '', address: '', area: STORE.deliveryAreas[0], notes: '', acceptTerms: false })
  const loadQuote = async () => {
    const version = ++quoteVersion.current
    setError(''); setTotals(null)
    if (!cart.length || !['cart', 'checkout'].includes(mode)) return
    try {
      const quote = await api('/api/checkout/quote', { method: 'POST', body: { items: checkoutItems(cart) } })
      if (version === quoteVersion.current) setTotals(quote)
    } catch (e) { if (version === quoteVersion.current) setError(e.message) }
  }
  useEffect(() => { loadQuote(); return () => { quoteVersion.current++ } }, [cart, mode])
  if (mode === 'payment') return <Payment saved={pendingPayment || saved} />
  if (mode === 'confirmation') return <Confirmation saved={saved} />
  if (pendingPayment && (mode === 'checkout' || !cart.length) && !locked) return <ResumePayment saved={pendingPayment} />
  if (!cart.length && !locked) return <Empty />
  const update = (index, quantity) => setCart((items) => items.map((item, i) => i === index ? { ...item, quantity } : item))
  const set = (key, value) => setCustomer((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    if (busy || (!totals && !pending.current)) return
    setBusy(true); setError('')
    const attempt = pending.current || { key: freshKey(), body: { customer, items: checkoutItems(cart), acceptedTotal: totals.total } }
    pending.current = attempt; save('maroon-pending-checkout', attempt); setLocked(true)
    try {
      const result = await api('/api/orders', { method: 'POST', headers: { 'Idempotency-Key': attempt.key }, body: attempt.body })
      saveGuestOrder(result); localStorage.removeItem('maroon-pending-checkout'); pending.current = null
      setLocked(false); setCart([]); location.hash = '#/payment'
    } catch (e) {
      if (e.status && e.status < 500) { pending.current = null; localStorage.removeItem('maroon-pending-checkout'); setLocked(false); await loadQuote() }
      setError(e.message)
    } finally { setBusy(false) }
  }
  const checkout = mode === 'checkout'
  return <main className="commerce shop-commerce"><Steps current={mode} /><Heading title={checkout ? 'The final little details' : 'Your bag'}>{checkout ? 'A few details, and your story is ready to travel.' : 'Little things, chosen with meaning.'}</Heading>
    {error && <p className="shop-alert" role="alert">{error}</p>}{locked && <p className="shop-alert" role="status">Your order submission needs confirmation. Continue below to recover the same order.</p>}
    <div className="shop-checkout-grid">{!checkout ? <section className="shop-bag" aria-label="Items in your bag">{cart.map((item, i) => <article className="shop-bag-item" key={item.cartId}>
      <div className="shop-bag-media">{item.type === 'custom' && chainOf(item.chain) ? <Piece form={item.form} chain={item.chain} charms={item.rack} idle={false} /> : item.img ? <img src={item.img} alt={item.name} /> : <ShoppingBag size={28} strokeWidth={1.2} />}</div>
      <div className="shop-bag-info"><h2 className="shop-product-name">{item.name}</h2>{item.type === 'custom' && <><p>{chainOf(item.chain)?.name}</p><p>{item.rack.filter(Boolean).map((id) => charmOf(id)?.name || id).join(', ') || 'Base only'}</p><p>{item.assembly === 'exact' ? 'Your exact charm layout' : 'Arranged by the studio'}</p></>}
        <div className="shop-bag-actions"><div className="quantity-control"><button aria-label={`Decrease ${item.name} quantity`} disabled={locked || item.quantity <= 1} onClick={() => update(i, item.quantity - 1)}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} disabled={locked || item.quantity >= 20} onClick={() => update(i, item.quantity + 1)}><Plus size={14} /></button></div>
          {item.type === 'custom' && <button className="shop-link" disabled={locked || !isAvailable(chainOf(item.chain))} onClick={() => onEdit(item)}><Pencil size={14} />Edit design</button>}<button className="shop-link" disabled={locked} onClick={() => setCart((items) => items.filter((p) => p.cartId !== item.cartId))}>Remove</button></div>
      </div><strong className="shop-bag-price">{totals?.lines[i] ? npr(totals.lines[i].total) : 'Updating…'}</strong></article>)}<a href="#top" className="shop-back"><ArrowLeft size={16} />Keep exploring</a></section>
      : <form id="guest-checkout" className="shop-checkout-form" onSubmit={submit}>
        <section className="shop-panel"><div className="shop-section-title"><Mail size={21} strokeWidth={1.3} /><h2>How can we reach you?</h2></div><fieldset disabled={busy || locked}>
          <div className="shop-field-row"><Field label="Full name"><input required autoComplete="name" minLength={2} maxLength={120} value={customer.name} onChange={(e) => set('name', e.target.value)} /></Field><Field label="Phone number"><input required type="tel" autoComplete="tel" minLength={7} maxLength={25} value={customer.phone} onChange={(e) => set('phone', e.target.value)} /></Field></div>
          <Field label="Email address" hint="Your order confirmation and delivery updates will come here."><input required type="email" autoComplete="email" maxLength={160} value={customer.email} onChange={(e) => set('email', e.target.value)} /></Field></fieldset></section>
        <section className="shop-panel"><div className="shop-section-title"><Truck size={22} strokeWidth={1.3} /><h2>Where shall we send it?</h2></div><fieldset disabled={busy || locked}>
          <Field label="Delivery area"><select value={customer.area} onChange={(e) => set('area', e.target.value)}>{STORE.deliveryAreas.map((area) => <option key={area}>{area}</option>)}</select></Field><Field label="Street address & nearby landmark"><textarea required rows={3} autoComplete="street-address" minLength={8} maxLength={500} value={customer.address} onChange={(e) => set('address', e.target.value)} /></Field><Field label="A note for us (optional)"><textarea rows={2} maxLength={1000} value={customer.notes} onChange={(e) => set('notes', e.target.value)} /></Field></fieldset></section>
        <section className="shop-checkout-consent"><label><input required type="checkbox" disabled={busy || locked} checked={customer.acceptTerms} onChange={(e) => set('acceptTerms', e.target.checked)} /><span>I agree to the <a href="#/policy/terms" target="_blank" rel="noreferrer">terms</a> and <a href="#/policy/privacyPolicy" target="_blank" rel="noreferrer">privacy policy</a>.</span></label></section></form>}
      <Summary totals={totals} cart={cart} showItems={checkout}>
        {pendingPayment && !checkout && <div className="saved-payment-summary"><p><strong>Payment to finish</strong><strong>{npr(pendingPayment.order.total)}</strong></p><small>Order {pendingPayment.order.id}. The new bag items above are not included in this payment.</small></div>}
        {checkout
        ? <button className="btn shop-full" type="submit" form="guest-checkout" disabled={busy || (!totals && !locked) || !STORE.checkoutEnabled}>{busy ? 'Placing your order…' : locked ? 'Retry order submission' : 'Continue to payment'}<ArrowRight size={16} /></button>
        : pendingPayment ? <a className="btn shop-full" href="#/payment">Resume payment<ArrowRight size={16} /></a> : totals && STORE.checkoutEnabled ? <a className="btn shop-full" href="#/checkout">Checkout<ArrowRight size={16} /></a> : <button className="btn shop-full" disabled>{STORE.checkoutEnabled ? 'Updating your bag…' : 'Checkout opens soon'}</button>}
        {pendingPayment && <p className="shop-fine-print">Order {pendingPayment.order.id} is saved and waiting for payment. New bag items are kept separately.</p>}
        <p className="shop-fine-print"><LockKeyhole size={15} />Fonepay payment, checked personally by Maroon.</p>{checkout && <a className="shop-back" href="#/cart"><ArrowLeft size={15} />Back to your bag</a>}{locked && !checkout && <a className="shop-link" href="#/checkout">Recover pending order</a>}
        <nav className="shop-policy-links"><a href="#/policy/deliveryPolicy" target="_blank" rel="noreferrer">Delivery</a><a href="#/policy/returnsPolicy" target="_blank" rel="noreferrer">Returns</a></nav></Summary>
    </div></main>
}
