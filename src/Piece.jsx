import { useMemo } from 'react'
import { chainOf, charmOf, formOf } from './data.js'

export const VIEW = 640

// --- geometry -------------------------------------------------------------
// Both forms are arcs of an ellipse, so one sampler serves the bracelet loop
// and the necklace drape. Points come back resampled by arc length, which is
// what makes the links read as a real chain instead of a dashed stroke.

const SHAPES = {
  bracelet: { cx: 320, cy: 296, rx: 198, ry: 206, from: -58, to: 238 },
  necklace: { cx: 320, cy: 58, rx: 192, ry: 424, from: 14, to: 166 },
}

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
  const points = sample(SHAPES[formId])
  const total = points[points.length - 1].s
  const linkCount = Math.max(8, Math.round(total / chain.linkLen))
  return {
    links: walk(points, linkCount),
    slots: walk(points, form.slots, total * 0.13),
    ends: [points[0], points[points.length - 1]],
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

function Charm({ id, p, held, onGrab, index }) {
  const charm = charmOf(id)
  if (!charm) return null
  const { w, h } = charm
  // The translate lives on an outer group: the sway animation writes a CSS
  // transform, which would otherwise overwrite a transform attribute here.
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <g
        className={`charm${held ? ' is-held' : ''}`}
        onPointerDown={onGrab ? (e) => onGrab(e, index) : undefined}
        style={{ ['--sway']: `${(index % 5) * -0.4}s` }}
      >
        <circle cx="0" cy="0" r="6.5" fill="none" stroke="url(#mr-gold)" strokeWidth="3.4" />
        <image href={charm.img} x={-w / 2} y={7} width={w} height={h} preserveAspectRatio="xMidYMin meet" />
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
        <Clasp p={g.ends[0]} gold="url(#mr-gold)" wire={g.chain.wire} />
        {form === 'necklace' && <Clasp p={g.ends[1]} gold="url(#mr-gold)" wire={g.chain.wire} />}
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
          <Charm key={i} id={id} p={g.slots[i]} index={i} onGrab={onGrab} />
        ) : null,
      )}

      {ghost && heldIndex > -1 && (
        <Charm id={charms[heldIndex]} p={ghost} index={heldIndex} held />
      )}
    </svg>
  )
}
