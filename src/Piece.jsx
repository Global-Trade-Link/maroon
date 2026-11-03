import { useMemo } from 'react'
import { chainOf, charmOf, formOf, slotsOf } from './data.js'

export const VIEW = 640

// --- geometry -------------------------------------------------------------
// Both forms are arcs of an ellipse, so one sampler serves the bracelet loop
// and the necklace drape. Points come back resampled by arc length, which is
// what makes the links read as a real chain instead of a dashed stroke.

const SHAPES = {
  // A bracelet is a closed loop: its two ends meet at the clasp at the top.
  bracelet: { cx: 320, cy: 312, rx: 206, ry: 214, from: -85, to: 265 },
  necklace: { cx: 320, cy: 46, rx: 222, ry: 456, from: 14, to: 166 },
}

// Hoops, keyring and pin are photographed bases, not drawn chains: each photo
// sits at a fixed spot and its charms hang from points measured off the photo.
const BASES = {
  earrings: { src: '/bases/hoop.webp', x: 140, y: 110, w: 360, h: 247 },
  keyring: { src: '/bases/keyring.webp', x: 125, y: 20, w: 322, h: 600 },
  brooch: { src: '/bases/pin.webp', x: 50, y: 150, w: 560, h: 185 },
}
const HOOP_SLOTS = [{ x: 211, y: 350 }, { x: 419, y: 350 }]
const PIN_LOOPS = [200, 285, 369]
// The keyring's dangling chain runs straight down x = 320 from y 210 to 600.
const KEY_TOP = 215
const KEY_BOTTOM = 495

const rad = (deg) => (deg * Math.PI) / 180

function sample(shape, steps = 900) {
  const { cx, cy, rx, ry, from, to } = shape
  const out = []
  let len = 0
  let prev = null
  for (let i = 0; i <= steps; i++) {
    const a = rad(from + ((to - from) * i) / steps)
    const p = {
      x: cx + rx * Math.cos(a),
      y: cy + ry * Math.sin(a),
      ang: (Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180) / Math.PI,
    }
    if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y)
    p.s = len
    out.push(p)
    prev = p
  }
  return out
}

function walk(points, count, pad = 0) {
  const total = points[points.length - 1].s
  const span = total - pad * 2
  const out = []
  let cursor = 0
  for (let i = 0; i < count; i++) {
    const target = pad + (span * (count === 1 ? 0.5 : i / (count - 1)))
    while (cursor < points.length - 1 && points[cursor].s < target) cursor++
    out.push(points[cursor])
  }
  return out
}

export function geometry(formId, chainId) {
  const form = formOf(formId)
  const chain = chainOf(chainId)
  if (formId === 'earrings') {
    return { links: [], ends: [], slots: HOOP_SLOTS.map((h) => ({ ...h, ang: 0 })), scale: 2, chain, form }
  }
  if (formId === 'brooch') {
    return { links: [], ends: [], slots: PIN_LOOPS.map((x) => ({ x, y: 322, ang: 0 })), scale: 1.4, chain, form }
  }
  if (formId === 'keyring') {
    const n = slotsOf(formId, chainId)
    // Charms alternate off either side of the links so a full chain doesn't stack into one column.
    const slots = Array.from({ length: n }, (_, i) => ({
      x: 320 + (i % 2 ? 9 : -9),
      y: KEY_TOP + ((KEY_BOTTOM - KEY_TOP) * i) / Math.max(1, n - 1),
      ang: 0,
    }))
    return { links: [], ends: [], slots, scale: 1, chain, form }
  }
  const points = sample(SHAPES[formId])
  const total = points[points.length - 1].s
  const linkCount = Math.max(8, Math.round(total / chain.linkLen))
  return {
    links: walk(points, linkCount),
    slots: walk(points, slotsOf(formId, chainId), total * { bracelet: 0.17, necklace: 0.13 }[formId]),
    ends: [points[0], points[points.length - 1]],
    scale: 1,
    clasp: { x: SHAPES[formId].cx, y: SHAPES[formId].cy - SHAPES[formId].ry, ang: 0 },
    chain,
    form,
  }
}

// --- rendering ------------------------------------------------------------

function Link({ p, i, chain, gold }) {
  const L = chain.linkLen
  const flat = i % 2 === 1
  if (chain.link === 'paperclip') {
    const h = flat ? L * 0.16 : L * 0.46
    return (
      <rect
        x={-L * 0.48}
        y={-h / 2}
        width={L * 0.96}
        height={h}
        rx={h / 2}
        fill="none"
        stroke={gold}
        strokeWidth={chain.wire}
        transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`}
      />
    )
  }
  // Oval knot chain: big upright ovals, every other link a short coiled bar.
  if (chain.link === 'knot' && flat) {
    return (
      <g stroke={gold} transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`}>
        <path d={`M${-L * 0.42} 0H${L * 0.42}`} strokeWidth={chain.wire} strokeLinecap="round" />
        {[-0.14, 0, 0.14].map((k) => (
          <ellipse key={k} cx={L * k} cy="0" rx={L * 0.05} ry={chain.wire * 1.15} fill={gold} strokeWidth="0.6" />
        ))}
      </g>
    )
  }
  return (
    <ellipse
      cx="0"
      cy="0"
      rx={L * 0.58}
      ry={flat ? L * 0.19 : L * 0.46}
      fill="none"
      stroke={gold}
      strokeWidth={chain.wire}
      transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`}
    />
  )
}

function Clasp({ p, gold, wire }) {
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`}>
      <path
        d="M-19 0a19 19 0 1 1 38 0 19 19 0 0 1-38 0"
        fill="none"
        stroke={gold}
        strokeWidth={wire * 1.3}
      />
      <path d="M-8 -11 L-8 11" stroke={gold} strokeWidth={wire} strokeLinecap="round" />
    </g>
  )
}

function Charm({ id, p, held, onGrab, index, scale = 1 }) {
  const charm = charmOf(id)
  if (!charm) return null
  // ax: where the charm's own loop sits across its width (most are centred).
  const { w, h, ax = 0.5 } = charm
  // The translate lives on an outer group: the sway animation writes a CSS
  // transform, which would otherwise overwrite a transform attribute here.
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${scale})`}>
      <g
        className={`charm${held ? ' is-held' : ''}`}
        onPointerDown={onGrab ? (e) => onGrab(e, index) : undefined}
        style={{ ['--sway']: `${(index % 5) * -0.4}s` }}
      >
        <circle cx="0" cy="0" r="6.5" fill="none" stroke="url(#mr-gold)" strokeWidth="3.4" />
        <image href={charm.img} x={-w * ax} y={7} width={w} height={h} preserveAspectRatio="xMidYMin meet" />
        {onGrab && <circle className="charm-grab" cx="0" cy={7 + h * 0.5} r={Math.max(w, h) * 0.52} />}
      </g>
    </g>
  )
}

export default function Piece({
  form,
  chain,
  charms,
  onGrab,
  heldIndex = -1,
  showSlots = false,
  hoverSlot = -1,
  ghost = null,
  idle = true,
}) {
  const g = useMemo(() => geometry(form, chain), [form, chain])

  return (
    <svg
      className={`piece${idle ? ' is-idle' : ''}`}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label={`${g.form.name} on ${g.chain.name} with ${charms.filter(Boolean).length} charms`}
    >
      <defs>
        <linearGradient id="mr-gold" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#f6e2a8" />
          <stop offset="0.38" stopColor="#d5ab3c" />
          <stop offset="0.72" stopColor="#a87b1d" />
          <stop offset="1" stopColor="#efd68f" />
        </linearGradient>
      </defs>

      <g className="piece-chain">
        {g.links.map((p, i) => (
          <Link key={i} p={p} i={i} chain={g.chain} gold="url(#mr-gold)" />
        ))}
        {BASES[form] ? (
          <image href={BASES[form].src} x={BASES[form].x} y={BASES[form].y} width={BASES[form].w} height={BASES[form].h} />
        ) : form === 'bracelet' ? (
          <Clasp p={g.clasp} gold="url(#mr-gold)" wire={g.chain.wire} />
        ) : (
          <>
            <Clasp p={g.ends[0]} gold="url(#mr-gold)" wire={g.chain.wire} />
            <Clasp p={g.ends[1]} gold="url(#mr-gold)" wire={g.chain.wire} />
          </>
        )}
      </g>

      {showSlots &&
        g.slots.map((p, i) => (
          <circle
            key={i}
            className={`slot${hoverSlot === i ? ' is-hot' : ''}${charms[i] ? ' is-full' : ''}`}
            cx={p.x}
            cy={p.y + 22}
            r="27"
          />
        ))}

      {charms.map((id, i) =>
        id && i !== heldIndex ? (
          <Charm key={i} id={id} p={g.slots[i]} index={i} onGrab={onGrab} scale={g.scale} />
        ) : null,
      )}

      {ghost && heldIndex > -1 && (
        <Charm id={charms[heldIndex]} p={ghost} index={heldIndex} held scale={g.scale} />
      )}
    </svg>
  )
}
