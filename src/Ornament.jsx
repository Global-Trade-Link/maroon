// Engraved scrollwork for the framed panels. All geometry, one stroke weight,
// drawn in currentColor so the frame takes the maroon from its parent.

// One arm of the corner: a leafy stem running along the top edge with scrolls
// curling off it. The corner mirrors it across the diagonal for the side edge.
const ARM = (
  <>
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M22 34C48 24 74 48 106 38C134 29 160 27 196 38" />
      <path d="M62 38C57 56 72 66 83 58C90 53 86 44 79 47" />
      <path d="M132 31C127 16 140 7 151 11C159 14 157 24 149 23" />
      <path d="M196 38C203 42 202 51 194 51C188 51 188 44 193 44" />
      <path d="M96 40C100 50 98 60 92 66" />
      <path d="M166 31C168 22 176 18 184 21" />
    </g>
    <g fill="currentColor">
      <path d="M88 41C97 50 109 52 118 47C109 42 97 38 88 41Z" opacity="0.5" />
      <path d="M150 28C158 20 171 17 180 22C171 28 160 30 150 28Z" opacity="0.5" />
      <path d="M38 30C44 19 55 14 64 16C58 23 49 29 38 30Z" opacity="0.5" />
      <path d="M110 36C114 26 122 22 130 23C126 30 119 35 110 36Z" opacity="0.35" />
      <circle cx="122" cy="40" r="2.2" />
      <circle cx="176" cy="33" r="1.8" />
      <circle cx="206" cy="40" r="1.6" />
    </g>
  </>
)

// Drawn for the top-left corner; the frame mirrors it into the other three.
function Corner({ at }) {
  return (
    <svg className={`corner corner-${at}`} viewBox="0 0 212 212" aria-hidden="true">
      {ARM}
      <g transform="matrix(0 1 1 0 0 0)">{ARM}</g>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M22 34C14 22 22 10 34 12C44 14 44 26 36 28C30 29 28 22 33 21" />
        <path d="M34 22C10 14 14 34 22 34" />
        <path d="M30 50C42 48 48 42 50 30" />
        <path d="M36 66C56 64 64 56 66 36" />
        <path d="M18 18L62 62" />
      </g>
      <path d="M16 16C40 22 58 40 64 64C40 58 22 40 16 16Z" fill="currentColor" opacity="0.22" />
      <path d="M16 16C40 22 58 40 64 64C40 58 22 40 16 16Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="3.2" fill="currentColor" />
      <circle cx="78" cy="78" r="1.8" fill="currentColor" />
    </svg>
  )
}

// Centre crest: a fleuron flanked by two scrolls with long tails.
export function Crest({ className = '' }) {
  return (
    <svg className={`crest ${className}`} viewBox="0 0 240 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M120 42C100 46 84 40 76 30C70 22 76 13 84 15C90 17 90 25 84 25" />
        <path d="M120 42C140 46 156 40 164 30C170 22 164 13 156 15C150 17 150 25 156 25" />
        <path d="M76 30C60 42 34 44 12 36" />
        <path d="M164 30C180 42 206 44 228 36" />
        <path d="M58 39C54 31 46 29 42 33" />
        <path d="M182 39C186 31 194 29 198 33" />
        <path d="M100 32C98 24 104 18 110 20" />
        <path d="M140 32C142 24 136 18 130 20" />
        <path d="M92 54H148" />
      </g>
      <path d="M120 4C111 17 111 31 120 42C129 31 129 17 120 4Z" fill="currentColor" opacity="0.18" />
      <path d="M120 4C111 17 111 31 120 42C129 31 129 17 120 4Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <g fill="currentColor">
        <circle cx="120" cy="54" r="2.6" />
        <circle cx="8" cy="35" r="1.8" />
        <circle cx="232" cy="35" r="1.8" />
      </g>
    </svg>
  )
}

// Hairline rule with a lozenge knot, used between headline and lede.
export function Flourish({ className = '' }) {
  return (
    <svg className={`flourish ${className}`} viewBox="0 0 320 20" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M4 10H118M202 10H316" />
        <path d="M118 10C126 2 139 2 141 9C142 15 135 16 133 12" />
        <path d="M202 10C194 2 181 2 179 9C178 15 185 16 187 12" />
        <path d="M141 10H151M169 10H179" />
      </g>
      <path d="M160 2L168 10L160 18L152 10Z" fill="currentColor" />
      <circle cx="4" cy="10" r="1.8" fill="currentColor" />
      <circle cx="316" cy="10" r="1.8" fill="currentColor" />
    </svg>
  )
}

// A hairline rule around a full-width section, scrollwork in each corner.
export function Frame({ className = '', children }) {
  return (
    <div className={`frame ${className}`}>
      {['tl', 'tr', 'bl', 'br'].map((at) => (
        <Corner key={at} at={at} />
      ))}
      {children}
    </div>
  )
}
