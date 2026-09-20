// House ornaments. Everything here is geometry — arcs, rings, leaves — drawn to
// the same 1.4–1.8 stroke so the page reads as one engraved plate.

export function Laurel({ flip = false }) {
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8
    return {
      x: 6 + t * 96,
      y: 26 - Math.sin(t * Math.PI) * 15,
      a: -46 + t * 92,
      r: 1 - Math.abs(t - 0.5) * 0.7,
    }
  })
  return (
    <svg
      className="laurel"
      viewBox="0 0 108 34"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path
        d={`M4 27 ${leaves.map((l) => `L${l.x.toFixed(1)} ${l.y.toFixed(1)}`).join(' ')}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a})`}>
          <ellipse rx={7 * l.r} ry={2.6 * l.r} cx={6 * l.r} fill="currentColor" opacity="0.9" />
          <ellipse rx={6 * l.r} ry={2.2 * l.r} cx={-5 * l.r} cy="3" fill="currentColor" opacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

export function Rule({ children }) {
  return (
    <div className="rule">
      <Laurel />
      <span>{children}</span>
      <Laurel flip />
    </div>
  )
}

// Fixed vine running down both page edges, the way an engraved card is bordered.
export function VineEdge({ side }) {
  const id = `vine-${side}`
  return (
    <svg className={`edge edge-${side}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="30" height="132" patternUnits="userSpaceOnUse">
          <path
            d="M15 0 C6 22 24 44 15 66 C6 88 24 110 15 132"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.75"
          />
          {[12, 34, 56, 78, 100, 122].map((y, i) => (
            <g key={y} transform={`translate(15 ${y}) rotate(${i % 2 ? 34 : -34})`}>
              <ellipse rx="8" ry="2.9" cx={i % 2 ? 8 : -8} fill="currentColor" opacity="0.7" />
            </g>
          ))}
          {[23, 67, 111].map((y) => (
            <circle key={y} cx="15" cy={y} r="2" fill="currentColor" opacity="0.55" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Guilloché: the interlaced arc engraving on the back of a watch case.
export function Guilloche({ id = 'guilloche' }) {
  return (
    <svg className="guilloche" aria-hidden="true">
      <defs>
        <pattern id={id} width="54" height="54" patternUnits="userSpaceOnUse">
          {[10, 18, 26].map((r) => (
            <circle key={r} cx="27" cy="27" r={r} fill="none" stroke="currentColor" strokeWidth="0.9" />
          ))}
          {[10, 18, 26].map((r) => (
            <circle key={`o${r}`} cx="0" cy="0" r={r} fill="none" stroke="currentColor" strokeWidth="0.9" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Scalloped edge between two bands — the cut of a jeweller's display card.
export function Scallop({ tone, flip = false }) {
  const id = `scallop-${tone}${flip ? '-f' : ''}`
  return (
    <svg
      className={`scallop${flip ? ' is-flip' : ''}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width="44" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 0 Q22 30 44 0 Z" fill={tone} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function Seal({ label = 'Est.' }) {
  return (
    <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="43" fill="none" stroke="currentColor" strokeWidth="0.9" />
      {Array.from({ length: 36 }, (_, i) => (
        <circle
          key={i}
          cx={60 + 52.5 * Math.cos((i * Math.PI) / 18)}
          cy={60 + 52.5 * Math.sin((i * Math.PI) / 18)}
          r="1.5"
          fill="currentColor"
        />
      ))}
      <text x="60" y="73" textAnchor="middle" className="seal-mark">
        M
      </text>
      <text x="60" y="94" textAnchor="middle" className="seal-label">
        {label}
      </text>
    </svg>
  )
}

const ICONS = {
  cast: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
      <path d="M12 7.5 13.7 11l3.8.4-2.8 2.6.8 3.7L12 15.9 8.5 17.7l.8-3.7L6.5 11.4 10.3 11z" />
    </>
  ),
  solder: (
    <>
      <path d="M4 19.5 10 13.5" />
      <path d="M9 12.5a4.5 4.5 0 1 1 6.4 4.1" />
      <path d="M14.5 3.5 20.5 9.5 17 13 11 7z" />
    </>
  ),
  pouch: (
    <>
      <path d="M6.5 9.5h11l2 10.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M6.5 13.5h11" />
    </>
  ),
}

export function Icon({ name }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}
