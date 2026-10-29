// MAROON demo catalogue.
// Prices are illustrative placeholders for the demo, not real pricing.
// All amounts are Nepalese rupees, stored as plain integers.

// Every form opens its own builder. Bracelet and necklace pick a chain; the
// rest come on one fixed base (hoops, keyring, pin).
export const FORMS = [
  { id: 'bracelet', name: 'Bracelet', length: '17 + 5 cm', slots: 9 },
  { id: 'necklace', name: 'Necklace', length: '40 + 5 cm', slots: 9 },
  { id: 'earrings', name: 'Charm Hoops', length: 'One pair', slots: 2 },
  { id: 'keyring', name: 'Keyring', length: 'Lobster clasp', slots: 5 },
  { id: 'brooch', name: 'Brooch', length: '50 mm pin', slots: 3 },
]

// A "chain" is whatever the charms hang from, so the fixed bases live here too.
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
    forms: ['necklace'],
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
    forms: ['necklace'],
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
    forms: ['bracelet', 'necklace'],
    note: 'Long flat links. Charms sit wide and swing loud.',
  },
  {
    id: 'link',
    name: 'Classic Link Chain',
    gauge: '4.0 mm',
    price: 4200,
    img: '/chains/link.jpg',
    link: 'cable',
    linkLen: 22,
    wire: 4.2,
    forms: ['bracelet'],
    note: 'Open oval links with a lobster clasp. Every link takes a charm.',
  },
  {
    id: 'knot',
    name: 'Knot Bar Chain',
    gauge: '3.94 mm',
    price: 5600,
    img: '/chains/knot.jpg',
    link: 'cable',
    linkLen: 18,
    wire: 3.8,
    forms: ['bracelet'],
    note: 'Twisted knots between short bars. Dressier, with a heart tag on the extender.',
  },
  {
    id: 'hoop',
    name: 'Gold Huggie Hoops',
    gauge: 'One pair',
    price: 2400,
    img: '/bases/hoop.webp',
    link: 'cable',
    linkLen: 12,
    wire: 3,
    forms: ['earrings'],
    note: 'Hinged hoops that click shut. One charm swings from each.',
  },
  {
    id: 'keyring',
    name: 'Lobster Keyring',
    gauge: 'Split ring + chain',
    price: 1600,
    img: '/bases/keyring.webp',
    link: 'cable',
    linkLen: 14,
    wire: 3,
    forms: ['keyring'],
    note: 'Clip it to a bag, a belt loop or the keys. Five charms along the chain.',
  },
  {
    id: 'pin',
    name: 'Charm Safety Pin',
    gauge: '50 mm · 3 loops',
    price: 1900,
    img: '/bases/pin.jpg',
    link: 'cable',
    linkLen: 12,
    wire: 3,
    forms: ['brooch'],
    note: 'Three loops under the bar. Pin it to a lapel, a tote or a hat band.',
  },
]

export const chainsFor = (formId) => CHAINS.filter((c) => c.forms.includes(formId))

// The four charm sizes, small to bulky. Sizes are the studio's own sorting.
export const CHARM_SIZES = [
  { id: 'small', name: 'Small', line: 'Dainty drops, about 15 mm. Good for stacking.' },
  { id: 'medium', name: 'Medium', line: 'The everyday size, around 18 mm.' },
  { id: 'big', name: 'Big', line: 'Statement charms, 20 mm and over.' },
  { id: 'bulky', name: 'Bulky', line: 'Heavy and loud. One is often enough.' },
]

// The first three were the original studio charms; the landing hero uses them.
export const CHARMS = [
  { id: 'mushroom', size: 'medium', name: 'Red Mushroom', price: 2900, img: '/charms/mushroom.png', w: 64, h: 98, story: 'Hand-enamelled cap, polished gold stem.' },
  { id: 'hamsa', size: 'medium', name: 'Evil Palm', price: 2500, img: '/charms/hamsa.png', w: 48, h: 96, story: 'Cast hamsa, crystal set eye. Worn against the bad look.' },
  { id: 'ballet', size: 'big', name: 'Dance Shoe', price: 3200, img: '/charms/ballet.png', w: 78, h: 53, story: 'A pair of pointe shoes, ribbons crossed.' },
  { id: 'bar', size: 'small', name: 'Emerald Baguette', price: 1200, img: '/charms/bar.webp', w: 20, h: 62, story: 'Three square stones stepping from clear to deep green.' },
  { id: 'tear', size: 'small', name: 'Pink Teardrop', price: 1200, img: '/charms/tear.webp', w: 28, h: 62, story: 'A pink stone in a ring of tiny clear ones.' },
  { id: 'pearl', size: 'small', name: 'Baroque Pearl', price: 1200, img: '/charms/pearl.webp', w: 38, h: 62, story: 'Lumpy, glossy, never two the same.' },
  { id: 'letter', size: 'small', name: 'Love Letter', price: 1200, img: '/charms/letter.webp', w: 62, h: 54, story: 'A sealed envelope with a red heart stamp.' },
  { id: 'cube', size: 'small', name: 'Blue Porcelain Cube', price: 1200, img: '/charms/cube.webp', w: 30, h: 62, story: 'Hand-painted blue florals on white ceramic.' },
  { id: 'mopheart', size: 'small', name: 'Mother-of-Pearl Heart', price: 1200, img: '/charms/mopheart.webp', w: 45, h: 62, story: 'Cut shell with a soft milky shine.' },
  { id: 'beads', size: 'small', name: 'Ruby Bead Trio', price: 1200, img: '/charms/beads.webp', w: 19, h: 62, story: 'Three faceted red beads on a gold pin.' },
  { id: 'cherry', size: 'medium', name: 'Cherries', price: 1800, img: '/charms/cherry.webp', w: 48, h: 76, story: 'Two enamel cherries on one stem.' },
  { id: 'bow', size: 'medium', name: 'Gold Bow', price: 1800, img: '/charms/bow.webp', w: 76, h: 72, story: 'A loose ribbon bow in polished gold.' },
  { id: 'sunheart', size: 'medium', name: 'Sunburst Heart', price: 1800, img: '/charms/sunheart.webp', w: 76, h: 72, story: 'Rays around a milky glass heart.' },
  { id: 'rose', size: 'medium', name: 'Rose Cameo', price: 1800, img: '/charms/rose.webp', w: 54, h: 76, story: 'A gold rose on white enamel in a scalloped frame.' },
  { id: 'turtle', size: 'medium', name: 'Sea Turtle', price: 1800, img: '/charms/turtle.webp', w: 76, h: 72, story: 'Chunky shell, four paddling flippers.' },
  { id: 'fish', size: 'medium', name: 'Little Fish', price: 1800, img: '/charms/fish.webp', w: 26, h: 76, story: 'A slim scaled fish, nose up.' },
  { id: 'puffheart', size: 'medium', name: 'Puffed Heart', price: 1800, img: '/charms/puffheart.webp', w: 76, h: 72, story: 'A domed heart with a beaded border.' },
  { id: 'porcheart', size: 'medium', name: 'Porcelain Heart', price: 1800, img: '/charms/porcheart.webp', w: 46, h: 76, story: 'Blue flowers painted on a ceramic heart.' },
  { id: 'blossom', size: 'big', name: 'Pink Blossom', price: 2400, img: '/charms/blossom.webp', w: 88, h: 82, story: 'Five enamel petals and gold stamens.' },
  { id: 'peachflower', size: 'big', name: 'Peach Pearl Flower', price: 2400, img: '/charms/peachflower.webp', w: 88, h: 87, story: 'Peach enamel petals around a pearl.' },
  { id: 'mauveflower', size: 'big', name: 'Mauve Pearl Flower', price: 2400, img: '/charms/mauveflower.webp', w: 88, h: 87, story: 'The same flower, a shade cooler.' },
  { id: 'shell', size: 'big', name: 'Scallop Shell', price: 2400, img: '/charms/shell.webp', w: 79, h: 88, story: 'Ridged gold, straight from the coast.' },
  { id: 'boot', size: 'big', name: 'Cowboy Boot', price: 2400, img: '/charms/boot.webp', w: 57, h: 88, story: 'Tooled shaft, stacked heel.' },
  { id: 'starfish', size: 'big', name: 'Starfish', price: 2400, img: '/charms/starfish.webp', w: 79, h: 88, story: 'Five textured arms, a little uneven.' },
  { id: 'ace', size: 'big', name: 'Ace of Spades', price: 2400, img: '/charms/ace.webp', w: 75, h: 88, story: 'A playing card in white enamel.' },
  { id: 'darkheart', size: 'bulky', name: 'Onyx Heart', price: 3200, img: '/charms/darkheart.webp', w: 100, h: 98, story: 'A black enamel heart inside a hammered one.' },
  { id: 'spiral', size: 'bulky', name: 'Gold Spiral', price: 3200, img: '/charms/spiral.webp', w: 89, h: 100, story: 'A heavy coil, 30 mm across.' },
  { id: 'silverspiral', size: 'bulky', name: 'Silver Spiral', price: 3200, img: '/charms/silverspiral.webp', w: 88, h: 100, story: 'The coil in bright steel.' },
  { id: 'locket', size: 'bulky', name: 'Engraved Locket', price: 3200, img: '/charms/locket.webp', w: 98, h: 100, story: 'A scrolled heart that opens for a photo.' },
]

export const ASSEMBLY = [
  { id: 'exact', name: 'Keep my exact layout', note: 'We solder each charm to the link you placed it on.' },
  { id: 'studio', name: 'Let the studio balance it', note: 'We keep your charms, space them evenly by weight.' },
]

// The shop range. Charm pieces open their own builder; the rest are photographed.
export const CATEGORIES = [
  { id: 'charm-bracelet', name: 'Charm Bracelet', line: 'Nine links to fill, slowly or all at once.', form: 'bracelet' },
  { id: 'charm-necklace', name: 'Charm Necklace', line: 'One fine chain, the charms you choose.', form: 'necklace' },
  { id: 'charm-earrings', name: 'Charm Hoops', line: 'A small charm swinging at each ear.', form: 'earrings' },
  { id: 'charm-keyring', name: 'Charm Keyring', line: 'Your charms, on every set of keys.', form: 'keyring' },
  { id: 'charm-brooch', name: 'Charm Brooch', line: 'Pinned to a lapel, a bag strap, a hat band.', form: 'brooch' },
  { id: 'belts', name: 'Belts', line: 'Western buckles, hearts and leopard.', img: '/shop/belt3.jpg', href: '#belts' },
  { id: 'armcuffs', name: 'Armcuffs', line: 'Wire-wrapped by hand, worn high on the arm.', img: '/shop/cuff1.jpg', focus: '50% 52%', href: '#armcuffs' },
]

// Starting points on the landing page. Same renderer as the builder.
export const PRESETS = [
  {
    id: 'lucky',
    name: 'The Lucky Hand',
    form: 'bracelet',
    chain: 'link',
    charms: ['hamsa', 'mushroom', 'hamsa'],
    line: 'Protection, twice over, with one small bit of luck between.',
  },
  {
    id: 'coast',
    name: 'Coastline',
    form: 'bracelet',
    chain: 'paperclip',
    charms: ['fish', 'pearl', 'turtle', 'starfish', 'shell'],
    line: 'Everything the tide leaves behind, on wide flat links.',
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

// The "Build your own" row: one card per builder.
export const BUILDS = [
  { id: 'b-bracelet', name: 'Charm Bracelet', form: 'bracelet', chain: 'link', charms: ['cherry', 'pearl', 'blossom', 'letter', 'bow'] },
  { id: 'b-necklace', name: 'Charm Necklace', form: 'necklace', chain: 'cable', charms: ['shell', 'starfish', 'porcheart'] },
  { id: 'b-hoops', name: 'Charm Hoops', form: 'earrings', chain: 'hoop', charms: ['cube', 'cube'] },
  { id: 'b-keyring', name: 'Charm Keyring', form: 'keyring', chain: 'keyring', charms: ['locket', 'cherry', 'blossom'] },
  { id: 'b-brooch', name: 'Charm Brooch', form: 'brooch', chain: 'pin', charms: ['shell', 'porcheart', 'fish'] },
]

// More ready-made arrangements for the bracelet shelf.
export const BRACELETS = [
  PRESETS[0],
  PRESETS[1],
  { id: 'garden', name: 'Garden Party', form: 'bracelet', chain: 'knot', charms: ['blossom', 'cherry', 'peachflower', 'bow', 'mauveflower'] },
  { id: 'sweet', name: 'Sweetheart', form: 'bracelet', chain: 'link', charms: ['letter', 'puffheart', 'ace', 'sunheart'] },
  { id: 'porcelain', name: 'Blue & White', form: 'bracelet', chain: 'paperclip', charms: ['cube', 'porcheart', 'pearl', 'mopheart'] },
]

// Photographed pieces. Names and prices are demo placeholders.
export const BESTSELLERS = [
  { id: 'best-pearl-hoops', name: 'Pearl Drop Hoops', price: 3200, img: '/shop/best1.jpg', form: 'earrings', chain: 'hoop', charms: ['pearl', 'pearl'] },
  { id: 'best-porcelain-hoops', name: 'Porcelain Hoops', price: 3600, img: '/shop/best2.jpg', form: 'earrings', chain: 'hoop', charms: ['cube', 'cube'] },
  { id: 'best-seaside', name: 'Seaside Charm Necklace', price: 14800, img: '/shop/best4.jpg', form: 'necklace', chain: 'cable', charms: ['shell', 'pearl', 'starfish', 'mopheart', 'turtle'] },
  { id: 'best-pin', name: 'Shell & Fish Brooch', price: 6200, img: '/shop/best5.jpg', form: 'brooch', chain: 'pin', charms: ['shell', 'porcheart', 'fish'] },
  { id: 'best-paperclip', name: 'Western Charm Necklace', price: 16400, img: '/shop/best7.jpg', form: 'necklace', chain: 'paperclip', charms: ['shell', 'peachflower', 'boot', 'pearl'] },
  { id: 'best-bust', name: 'Garden Charm Bracelet', price: 12900, img: '/shop/best8.jpg', form: 'bracelet', chain: 'paperclip', charms: ['shell', 'blossom', 'peachflower'] },
  { id: 'best-citrus', name: 'Citrus Drop Earrings', price: 2800, img: '/shop/best3.jpg' },
  { id: 'best-bag-pin', name: 'Bag Pin Trio', price: 5400, img: '/shop/best6.jpg', form: 'brooch', chain: 'pin', charms: ['cube', 'puffheart', 'pearl'] },
]

export const EARRINGS = [
  { id: 'ear-coral', name: 'Coral Bell Earrings', price: 2600, img: '/shop/ear1.jpg' },
  { id: 'ear-citrine', name: 'Citrine Bell Earrings', price: 2600, img: '/shop/ear2.jpg' },
  { id: 'ear-aqua', name: 'Aqua Bell Earrings', price: 2600, img: '/shop/ear3.jpg' },
  { id: 'ear-rose', name: 'Rose Chain Earrings', price: 2900, img: '/shop/ear4.jpg' },
  { id: 'ear-amethyst', name: 'Amethyst Bell Earrings', price: 2600, img: '/shop/ear5.jpg' },
]

export const BELTS = [
  { id: 'belt-lace', name: 'Lace Belt', price: 3400, img: '/shop/belt1.jpg' },
  { id: 'belt-star', name: 'Red Star Belt', price: 3800, img: '/shop/belt2.jpg' },
  { id: 'belt-western', name: 'Western Buckle Belt', price: 4200, img: '/shop/belt3.jpg' },
  { id: 'belt-heart', name: 'Heart Buckle Belt', price: 4200, img: '/shop/belt4.jpg' },
  { id: 'belt-heart-wide', name: 'Wide Heart Belt', price: 4400, img: '/shop/belt5.jpg' },
  { id: 'belt-western-slim', name: 'Slim Western Belt', price: 3600, img: '/shop/belt6.jpg' },
  { id: 'belt-black', name: 'Slim Black Belt', price: 2800, img: '/shop/belt7.jpg' },
  { id: 'belt-brown', name: 'Slim Brown Belt', price: 2800, img: '/shop/belt8.jpg' },
  { id: 'belt-concho', name: 'Concho Belt', price: 4600, img: '/shop/belt9.jpg' },
  { id: 'belt-leopard', name: 'Leopard Shell Belt', price: 3900, img: '/shop/belt10.jpg' },
  { id: 'belt-leopard-slim', name: 'Slim Leopard Belt', price: 3400, img: '/shop/belt11.jpg' },
]

export const ARMCUFFS = [
  { id: 'cuff-worn', name: 'Ivory Bloom Armcuff', price: 4800, img: '/shop/cuff1.jpg', focus: '50% 52%' },
  { id: 'cuff-ivory', name: 'Pearl Flower Armcuff', price: 4800, img: '/shop/cuff2.jpg' },
  { id: 'cuff-silver', name: 'Silver Flower Armcuff', price: 4600, img: '/shop/cuff3.jpg' },
  { id: 'cuff-pink', name: 'Pink Flower Armcuff', price: 4600, img: '/shop/cuff4.jpg' },
  { id: 'cuff-peach', name: 'Peach Flower Armcuff', price: 4600, img: '/shop/cuff5.jpg' },
  { id: 'cuff-pearl', name: 'Pearl Vine Armcuff', price: 4400, img: '/shop/cuff6.jpg' },
  { id: 'cuff-leaf', name: 'Green Leaf Armcuff', price: 4400, img: '/shop/cuff7.jpg' },
  { id: 'cuff-crystal', name: 'Crystal Swirl Armcuff', price: 4200, img: '/shop/cuff8.jpg' },
]

// Customer photographs for "Styled by you".
export const STYLED = [
  { img: '/styled/s5.jpg', alt: 'Porcelain heart and pearl on a fine necklace, worn' },
  { img: '/styled/s4.jpg', alt: 'Seaside charm bracelet in a gift box' },
  { img: '/styled/s1.jpg', alt: 'Paperclip charm necklace with matching flower earrings' },
  { img: '/styled/s6.jpg', alt: 'Keyring with locket, cherries and pink blossom' },
  { img: '/styled/s10.jpg', alt: 'Initial charm bracelet with heart, ace and starfish' },
  { img: '/styled/s3.jpg', alt: 'Peach pearl flower earrings among dried flowers' },
  { img: '/styled/s8.jpg', alt: 'Starfish pendant on a Maroon card' },
  { img: '/styled/s7.jpg', alt: 'Charm bracelet in a Maroon box' },
  { img: '/styled/s2.jpg', alt: 'Keyring with shell and porcelain charms in a box' },
  { img: '/styled/s9.jpg', alt: 'Four charm bracelets boxed and ready to send' },
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
