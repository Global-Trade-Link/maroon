import { useMemo } from 'react'
import { chainOf, charmOf, formOf } from './data.js'

export const VIEW = 640

// --- geometry -------------------------------------------------------------
// Both forms are arcs of an ellipse, so one sampler serves the bracelet loop
// and the necklace drape. Points come back resampled by arc length, which is
// what makes the links read as a real chain instead of a dashed stroke.

const SHAPES = {
  // A bracelet is a closed loop: its two ends meet at the clasp at the top.
  bracelet: { cx: 320, cy: 312, rx: 206, ry: 214, from: -85, to: 265 },
  necklace: { cx: 320, cy: 58, rx: 192, ry: 424, from: 14, to: 166 },
  // A loop of chain whose two ends meet in the ring under the lobster clasp.
  keyring: { cx: 320, cy: 372, rx: 150, ry: 176, from: -86, to: 266 },
}

// Hoops and the pin are not chains: their charms hang from fixed points.
const HOOPS = [{ x: 196, y: 196 }, { x: 444, y: 196 }]
const HOOP_R = 92
const PIN_LOOPS = [208, 320, 432]

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
    return { links: [], ends: [], slots: HOOPS.map((h) => ({ x: h.x, y: h.y + HOOP_R, ang: 0 })), scale: 2, chain, form }
  }
  if (formId === 'brooch') {
    return { links: [], ends: [], slots: PIN_LOOPS.map((x) => ({ x, y: 296, ang: 0 })), scale: 1.4, chain, form }
  }
  const points = sample(SHAPES[formId])
  const total = points[points.length - 1].s
  const linkCount = Math.max(8, Math.round(total / chain.linkLen))
  return {
    links: walk(points, linkCount),
    slots: walk(points, form.slots, total * { bracelet: 0.17, necklace: 0.13, keyring: 0.2 }[formId]),
    ends: [points[0], points[points.length - 1]],
    // Fewer, larger spots on the keyring: charms read bigger there.
    scale: formId === 'keyring' ? 1.25 : 1,
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

function Hoops({ gold }) {
  return HOOPS.map((h, i) => (
    <g key={i}>
      <circle cx={h.x} cy={h.y} r={HOOP_R} fill="none" stroke={gold} strokeWidth="11" />
      <path d={`M${h.x - 7} ${h.y - HOOP_R - 9}h14`} stroke="#a87b1d" strokeWidth="3" strokeLinecap="round" />
    </g>
  ))
}

// A split ring, a swivel, then a lobster clasp whose bottom ring takes both chain ends.
// No perfectly straight strokes: a gradient stroke on a flat box draws nothing.
function KeyTop({ gold, wire }) {
  return (
    <g fill="none" stroke={gold} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="320" cy="76" r="52" strokeWidth="9" />
      <circle cx="320" cy="76" r="44" strokeWidth="2.5" opacity="0.7" />
      <ellipse cx="320" cy="134" rx="8" ry="13" strokeWidth={wire * 1.5} />
      <path d="M320 148c-18 2-24 24-14 40 6 9 22 9 28 0 10-16 4-38-14-40z" strokeWidth={wire * 2} />
      <path d="M327 157c7 9 8 21 2 30" strokeWidth={wire * 1.2} />
      <circle cx="320" cy="200" r="11" strokeWidth={wire * 1.5} />
    </g>
  )
}

function Pin({ gold }) {
  return (
    <g fill="none" stroke={gold} strokeLinecap="round" strokeLinejoin="round">
      {/* One path: a gradient stroke on a perfectly flat line has no box and draws nothing. */}
      <path d="M132 246H500M132 276H530" strokeWidth="7" />
      <circle cx="122" cy="261" r="17" strokeWidth="7" />
      <rect x="492" y="232" width="48" height="58" rx="18" strokeWidth="7" />
      {PIN_LOOPS.map((x) => (
        <circle key={x} cx={x} cy={286} r="9" strokeWidth="5" />
      ))}
    </g>
  )
}

function Charm({ id, p, held, onGrab, index, scale = 1 }) {
  const charm = charmOf(id)
  if (!charm) return null
  const { w, h } = charm
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
        {form === 'earrings' ? (
          <Hoops gold="url(#mr-gold)" />
        ) : form === 'brooch' ? (
          <Pin gold="url(#mr-gold)" />
        ) : form === 'keyring' ? (
          <KeyTop gold="url(#mr-gold)" wire={g.chain.wire} />
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
