// MAROON demo catalogue.
// Prices are illustrative placeholders for the demo, not real pricing.
// All amounts are Nepalese rupees, stored as plain integers.

export const FORMS = [
  { id: 'bracelet', name: 'Bracelet', length: '18 cm', slots: 9 },
  { id: 'necklace', name: 'Necklace', length: '45 cm', slots: 9 },
]

export const CHAINS = [
  {
    id: 'fine',
    name: 'Fine Cable Chain',
    gauge: '2.0 mm',
    price: 4800,
    img: '/chains/fine.jpg',
    link: 'cable',
    linkLen: 12,
    wire: 2.6,
    note: 'Barely there. Lets one charm carry the whole piece.',
  },
  {
    id: 'cable',
    name: 'Rolo Cable Chain',
    gauge: '4.14 mm',
    price: 6900,
    img: '/chains/cable.jpg',
    link: 'cable',
    linkLen: 26,
    wire: 5.4,
    note: 'The house standard. Takes a full row of charms.',
  },
  {
    id: 'paperclip',
    name: 'Paperclip Chain',
    gauge: '9.9 mm',
    price: 8500,
    img: '/chains/paperclip.jpg',
    link: 'paperclip',
    linkLen: 44,
    wire: 5,
    note: 'Long flat links. Charms sit wide and swing loud.',
  },
]

export const CHARMS = [
  {
    id: 'mushroom',
    name: 'Red Mushroom',
    price: 2900,
    img: '/charms/mushroom.png',
    w: 64, h: 98,
    story: 'Hand-enamelled cap, polished gold stem.',
  },
  {
    id: 'hamsa',
    name: 'Evil Palm',
    price: 2500,
    img: '/charms/hamsa.png',
    w: 48, h: 96,
    story: 'Cast hamsa, crystal set eye. Worn against the bad look.',
  },
  {
    id: 'ballet',
    name: 'Dance Shoe',
    price: 3200,
    img: '/charms/ballet.png',
    w: 78, h: 53,
    story: 'A pair of pointe shoes, ribbons crossed.',
  },
]

export const ASSEMBLY = [
  { id: 'exact', name: 'Keep my exact layout', note: 'We solder each charm to the link you placed it on.' },
  { id: 'studio', name: 'Let the studio balance it', note: 'We keep your charms, space them evenly by weight.' },
]

// Starting points on the landing page. Same renderer as the builder.
export const PRESETS = [
  {
    id: 'lucky',
    name: 'The Lucky Hand',
    form: 'bracelet',
    chain: 'cable',
    charms: ['hamsa', 'mushroom', 'hamsa'],
    line: 'Protection, twice over, with one small bit of luck between.',
  },
  {
    id: 'forest',
    name: 'Forest Floor',
    form: 'bracelet',
    chain: 'paperclip',
    charms: ['mushroom', 'mushroom', 'mushroom'],
    line: 'Three caps on wide flat links. Nothing subtle about it.',
  },
  {
    id: 'stage',
    name: 'Stage Door',
    form: 'necklace',
    chain: 'fine',
    charms: ['ballet'],
    line: 'One pair of shoes on the finest chain we cut.',
  },
]

// Nepal groups digits the Indian way: 1,20,000 rather than 120,000.
export const npr = (n) => `Rs ${n.toLocaleString('en-IN')}`

export const chainOf = (id) => CHAINS.find((c) => c.id === id)
export const charmOf = (id) => CHARMS.find((c) => c.id === id)
export const formOf = (id) => FORMS.find((f) => f.id === id)

export function priceOf(chainId, charmIds) {
  return (
    chainOf(chainId).price +
    charmIds.reduce((sum, id) => (id ? sum + charmOf(id).price : sum), 0)
  )
}

// Centre a charm list on the drape so a seeded piece reads as finished.
export function nextFreeSlot(rack) {
  // Fill outward from the middle of the drape: that is where a charm reads best.
  const mid = (rack.length - 1) / 2
  const order = rack.map((_, i) => i).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))
  return order.find((i) => !rack[i]) ?? -1
}

export function seedRack(formId, charms) {
  const out = Array(formOf(formId).slots).fill(null)
  const list = charms.slice(0, out.length)
  const offset = Math.floor((out.length - list.length) / 2)
  list.forEach((id, i) => (out[offset + i] = id))
  return out
}
