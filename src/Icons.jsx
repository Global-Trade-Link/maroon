// Line icons for the promise strip. One stroke weight, drawn on a 64 grid.
const PATHS = {
  dispatch: (
    <>
      <path d="M4 16h32v26H4z" />
      <path d="M36 25h12l9 10v7H36" />
      <path d="M40 29h7l5 6H40z" />
      <path d="M10 24h18M14 29h16M10 34h12" />
      <circle cx="15" cy="46" r="4.5" />
      <circle cx="47" cy="46" r="4.5" />
    </>
  ),
  waterproof: (
    <>
      <path d="M28 5c-8 13-17 22-17 33a17 17 0 0 0 22 16" />
      <path d="M28 5c6 10 12 17 15 24" />
      <path d="M46 32l10 3.5v8c0 7-4.5 10.5-10 13-5.5-2.5-10-6-10-13v-8z" />
      <path d="M41.5 44.5l3.2 3.2 6-6.4" />
    </>
  ),
  hypoallergenic: (
    <>
      <path d="M52 8C28 9 12 24 13 52c25 0 39-17 39-44z" />
      <path d="M13 52C22 40 33 26 47 13" />
    </>
  ),
  gold: (
    <>
      <path d="M27 30h10l2 8H25zM20 38h10l2 8H18zM34 38h10l2 8H32zM13 46h10l2 8H11zM27 46h10l2 8H25zM41 46h10l2 8H39z" />
      <path d="M32 9v9M19 13l4.5 6.5M45 13l-4.5 6.5M10 23l7 3M54 23l-7 3" />
    </>
  ),
  payments: (
    <>
      <path d="M24 14.5l26-5.5a2.5 2.5 0 0 1 3 2l3 14a2.5 2.5 0 0 1-2 3l-26 5.5" />
      <path d="M24.8 19l30-6.3M26 25l30-6.4" />
      <path d="M6 44c5-3 9-6 15-6h11c2.5 0 3 3.5 0 4l-9 1.5" />
      <path d="M6 54c9 0 15 1.5 22-.5l18-8.5c2.6-1.3 1.5-5-1.5-4.2L33 44" />
      <path d="M55 5l3-3M58 10h4" />
    </>
  ),
}

export function PromiseIcon({ name }) {
  return (
    <svg
      className="promise-icon"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
