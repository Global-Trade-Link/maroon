export const MAX_QUANTITY = 20

export function addToCart(items, design) {
  const existing = design.type === 'product' && items.find((item) => item.type === 'product' && item.productId === design.productId)
  if (existing) return items.map((item) => item === existing ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1) } : item)
  return [...items, { ...design, quantity: 1, cartId: crypto.randomUUID() }]
}

// Consolidate rows saved by older versions as well as future repeated adds.
export function restoreCart(value) {
  const items = []
  let limited = false
  for (const item of Array.isArray(value) ? value : []) {
    if (!item || !['product', 'custom'].includes(item.type) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) continue
    const existing = item.type === 'product' && items.find((row) => row.type === 'product' && row.productId === item.productId)
    if (existing) {
      const quantity = existing.quantity + item.quantity
      limited ||= quantity > MAX_QUANTITY
      existing.quantity = Math.min(MAX_QUANTITY, quantity)
    } else items.push({ ...item, cartId: item.cartId || crypto.randomUUID() })
  }
  return { items, limited }
}
