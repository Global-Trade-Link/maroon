import test from 'node:test'
import assert from 'node:assert/strict'
import { addToCart, restoreCart, MAX_QUANTITY } from './cart.js'
import { isPaymentPending, pendingPayment, saveGuestOrder, forgetUnavailableOrder } from './guestOrders.js'
import { adminRedirectUrl } from './routing.js'
import { validatePaymentDetails } from './paymentValidation.js'
import { presentProducts, toCartProduct } from './productCatalog.js'

const product = { type: 'product', productId: 'pearl-hoops', name: 'Pearl hoops', total: 3200 }
test('detail options retain server identities, current prices and availability after catalog installation', () => {
  const records = [
    { kind: 'product', id: 'belt-black', name: 'Black belt', price: 2800, img: '/current-black.jpg' },
    { kind: 'product', id: 'belt-brown', name: 'Brown belt', price: 3100, img: '/current-brown.jpg' },
  ]
  const templates = [{ id: 'belt-slim', name: 'Slim Belt', price: 1, options: [
    { label: 'Black', productId: 'belt-black', price: 1 },
    { label: 'Dark brown', productId: 'belt-brown', price: 1 },
    { label: 'Unavailable', productId: 'not-published', price: 1 },
  ] }]
  const [group] = presentProducts(records, templates)
  assert.equal(group.id, 'belt-slim')
  assert.equal(group.options.length, 2)
  const choice = toCartProduct(group, group.options[1])
  assert.equal(choice.type, 'product')
  assert.equal(choice.productId, 'belt-brown')
  assert.equal(choice.total, 3100)
  assert.equal(choice.img, '/current-brown.jpg')
  const bag = addToCart(addToCart([], choice), choice)
  assert.equal(bag.length, 1)
  assert.equal(bag[0].quantity, 2)
  assert.equal(records[1].price, 3100)
})
test('payment identifies missing/short references while accepting either evidence option', () => {
  assert.match(validatePaymentDetails('  ', null).reference, /Enter the transaction reference/)
  assert.match(validatePaymentDetails('12', null).reference, /at least 3 characters/)
  assert.deepEqual(validatePaymentDetails(' TX-123 ', null), {})
  assert.deepEqual(validatePaymentDetails('', { size: 100, type: 'image/png' }), {})
  assert.deepEqual(validatePaymentDetails('1', { size: 100, type: 'image/png' }), {})
})
test('payment gives actionable screenshot errors even when a reference is supplied', () => {
  assert.match(validatePaymentDetails('TX-123', { size: 6 * 1024 * 1024, type: 'image/png' }).proof, /too large/)
  assert.match(validatePaymentDetails('TX-123', { size: 100, type: 'application/pdf' }).proof, /JPEG, PNG or WebP/)
  assert.ok(validatePaymentDetails('', { size: 0, type: 'image/png' }).reference)
})
const custom = { type: 'custom', form: 'bracelet', chain: 'link', rack: [null, 'cherry', 'cherry'], assembly: 'exact' }
const savedOrder = (paymentStatus = 'awaiting_payment', fulfillmentStatus = 'new') => ({ accessToken: 'local-test-capability', order: { id: 'MR-LOCAL', total: 3200, paymentStatus, fulfillmentStatus } })
function memoryStorage() {
  const data = new Map()
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }
}

test('repeated shelf clicks increase one product row without losing other items', () => {
  let items = addToCart([], product)
  const id = items[0].cartId
  items = addToCart(items, { ...product, productId: 'another' })
  items = addToCart(addToCart(items, product), product)
  assert.equal(items.length, 2)
  assert.equal(items[0].quantity, 3)
  assert.equal(items[0].cartId, id)
  assert.equal(items[1].quantity, 1)
})
test('custom designs remain separate editable bag lines', () => {
  const items = addToCart(addToCart([], custom), custom)
  assert.equal(items.length, 2)
  assert.notEqual(items[0].cartId, items[1].cartId)
  assert.deepEqual(items[0].rack, custom.rack)
})
test('older duplicate product rows consolidate on reload, preserving the first identity', () => {
  const saved = [{ ...product, quantity: 2, cartId: 'first' }, { ...custom, quantity: 2, cartId: 'custom' }, { ...product, quantity: 3, cartId: 'second' }]
  const result = restoreCart(saved)
  assert.equal(result.items.length, 2)
  assert.equal(result.items[0].quantity, 5)
  assert.equal(result.items[0].cartId, 'first')
  assert.deepEqual(result.items[1], saved[1])
  assert.equal(saved[0].quantity, 2)
  assert.equal(result.limited, false)
})
test('repeated adds and restored duplicates respect the server quantity limit', () => {
  const items = [{ ...product, quantity: MAX_QUANTITY, cartId: 'first' }]
  assert.equal(addToCart(items, product)[0].quantity, MAX_QUANTITY)
  const restored = restoreCart([...items, { ...product, quantity: 1 }])
  assert.equal(restored.items[0].quantity, MAX_QUANTITY)
  assert.equal(restored.limited, true)
})
test('legacy saved guest orders can be resumed without accounts', () => {
  const storage = memoryStorage()
  storage.setItem('maroon-last-order', JSON.stringify(savedOrder()))
  assert.deepEqual(pendingPayment(storage), savedOrder())
  saveGuestOrder(savedOrder('rejected'), storage)
  assert.equal(pendingPayment(storage).order.paymentStatus, 'rejected')
})
test('submitting, paying or cancelling clears recovery so it does not remain stuck', () => {
  for (const [status, fulfillment] of [['submitted', 'new'], ['paid', 'new'], ['awaiting_payment', 'cancelled']]) {
    const storage = memoryStorage()
    saveGuestOrder(savedOrder(), storage)
    assert.ok(pendingPayment(storage))
    saveGuestOrder(savedOrder(status, fulfillment), storage)
    assert.equal(pendingPayment(storage), null)
    assert.equal(storage.getItem('maroon-pending-payment'), null)
  }
  assert.equal(isPaymentPending({ order: { id: 'MR-LOCAL', paymentStatus: 'awaiting_payment' } }), false)
})
test('recovery survives new page reads and malformed unrelated stored JSON', () => {
  const storage = memoryStorage()
  saveGuestOrder(savedOrder(), storage)
  storage.setItem('maroon-last-order', 'broken JSON')
  assert.deepEqual(pendingPayment(storage), savedOrder())
})
test('a definitively unavailable order can be cleared without deleting another saved order', () => {
  const storage = memoryStorage()
  saveGuestOrder(savedOrder(), storage)
  storage.setItem('maroon-last-order', JSON.stringify({ ...savedOrder('submitted'), order: { ...savedOrder('submitted').order, id: 'MR-OTHER' } }))
  forgetUnavailableOrder('MR-LOCAL', storage)
  assert.equal(pendingPayment(storage), null)
  assert.equal(JSON.parse(storage.getItem('maroon-last-order')).order.id, 'MR-OTHER')
})
test('legacy admin URLs redirect to the admin subdomain with route and query preserved', () => {
  assert.equal(adminRedirectUrl('http://localhost:5173/admin#/orders'), 'http://admin.localhost:5173/#/orders')
  assert.equal(adminRedirectUrl('http://127.0.0.1:5173/admin'), 'http://admin.localhost:5173/')
  assert.equal(adminRedirectUrl('http://[::1]:5173/admin'), 'http://admin.localhost:5173/')
  assert.equal(adminRedirectUrl('https://www.maroon.com.np/admin?next=orders#/orders'), 'https://admin.maroon.com.np/?next=orders#/orders')
  assert.equal(adminRedirectUrl('https://admin.maroon.com.np/admin'), 'https://admin.maroon.com.np/')
  assert.equal(adminRedirectUrl('https://admin.maroon.com.np/'), null)
  assert.equal(adminRedirectUrl('http://localhost:5173/administrator'), null)
})
