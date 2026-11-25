// Detail-page groups are presentation only. Every selectable option must map to
// a published server product so checkout retains its real ID and current price.
export function presentProducts(records, templates) {
  const byId = new Map(records.map((item) => [item.id, item]))
  const metadata = new Map(templates.map((item) => [item.id, item]))
  const memberGroups = new Map()
  for (const template of templates.filter((item) => item.options?.length)) {
    const options = template.options.flatMap((option) => {
      const record = byId.get(option.productId)
      return record ? [{ ...option, productId: record.id, price: record.price, img: record.img }] : []
    })
    if (!options.length) continue
    const primary = byId.get(options[0].productId)
    const group = { ...template, ...primary, id: template.id, productId: primary.id, name: template.id === primary.id ? primary.name : template.name, options }
    for (const option of options) memberGroups.set(option.productId, group)
  }
  const shown = new Set()
  return records.flatMap((record) => {
    const group = memberGroups.get(record.id)
    if (!group) return [{ ...metadata.get(record.id), ...record, options: undefined }]
    if (shown.has(group.id)) return []
    shown.add(group.id)
    return [group]
  })
}

export function toCartProduct(product, option) {
  return {
    type: 'product',
    productId: option?.productId || product.productId || product.id,
    name: option ? `${product.name}, ${option.label}` : product.name,
    total: option?.price ?? product.price,
    img: option?.img || product.img,
  }
}
