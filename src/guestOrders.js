export const ORDER_CHANGED = 'maroon-order-changed'
export const isPaymentPending = (saved) => !!saved?.accessToken && !!saved?.order?.id
  && ['awaiting_payment', 'rejected'].includes(saved.order.paymentStatus)
  && saved.order.fulfillmentStatus !== 'cancelled'

const read = (storage, key) => { try { return JSON.parse(storage.getItem(key)) } catch { return null } }
export function pendingPayment(storage = localStorage) {
  const pending = read(storage, 'maroon-pending-payment')
  if (isPaymentPending(pending)) return pending
  const latest = read(storage, 'maroon-last-order')
  return isPaymentPending(latest) ? latest : null
}
export function saveGuestOrder(saved, storage = localStorage) {
  storage.setItem('maroon-last-order', JSON.stringify(saved))
  if (isPaymentPending(saved)) storage.setItem('maroon-pending-payment', JSON.stringify(saved))
  else if (read(storage, 'maroon-pending-payment')?.order?.id === saved.order.id) storage.removeItem('maroon-pending-payment')
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(ORDER_CHANGED))
}
export function forgetUnavailableOrder(id, storage = localStorage) {
  for (const key of ['maroon-pending-payment', 'maroon-last-order']) {
    if (read(storage, key)?.order?.id === id) storage.removeItem(key)
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(ORDER_CHANGED))
}
