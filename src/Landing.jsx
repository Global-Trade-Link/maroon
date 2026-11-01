import { useEffect, useState } from 'react'
import Piece from './Piece.jsx'
import { PromiseIcon } from './Icons.jsx'
import { Crest, Flourish, Frame } from './Ornament.jsx'
import {
  ARMCUFFS,
  BELTS,
  BESTSELLERS,
  BRACELETS,
  BUILDS,
  CATEGORIES,
  PAGES,
  CHAINS,
  CHARMS,
  CHARM_SIZES,
  EARRINGS,
  PRESETS,
  STYLED,
  chainOf,
  npr,
  priceOf,
  seedRack,
} from './data.js'

const PROMISES = [
  ['dispatch', 'Fast dispatch and express delivery'],
  ['waterproof', 'Waterproof'],
  ['hypoallergenic', 'Hypoallergenic'],
  ['gold', '18K gold PVD plated'],
  ['payments', 'Safe payments'],
]

// Each buildable category shows its "Build your own" arrangement.
const buildFor = (form) => BUILDS.find((b) => b.form === form)

const SHOWS = [PRESETS[0], BRACELETS[4], BRACELETS[2], PRESETS[1]]

// One face for each charm size; the builder opens on that size's tab.
const SIZE_FACES = [['small', 'pearl'], ['medium', 'cherry'], ['big', 'blossom'], ['bulky', 'locket']]


// Charms scattered around the closing call, and strung along the footer.
const CLOSE_CHARMS = ['cherry', 'starfish', 'blossom', 'letter']
const GARLAND = ['pearl', 'cherry', 'shell', 'bow', 'blossom', 'letter', 'turtle', 'porcheart', 'starfish', 'tear', 'locket', 'cube', 'boot']

// Chains you can choose; the fixed bases (hoops, keyring, pin) live in their own builders.
const REAL_CHAINS = CHAINS.filter((c) => c.forms.includes('bracelet') || c.forms.includes('necklace'))

// Gold line with charms hanging off it; shared by the masthead and the footer.
function Garland({ className = '' }) {
  return (
    <ul className={`foot-garland ${className}`} aria-hidden="true">
      {GARLAND.map((id, i) => (
        <li key={i} style={{ '--sway': `${(i % 4) * -0.6}s` }}>
          <img src={`/charms/${id}.webp`} alt="" loading="lazy" />
        </li>
      ))}
    </ul>
  )
}

// The masthead skips Chains for room; the footer lists every page.
const NAV_PAGES = ['bracelets', 'earrings', 'charms', 'belts', 'armcuffs']

function Shelf({ id, title, line, children }) {
  return (
    <section className="shelf" id={id}>
      <header className="shelf-head">
        <h2>{title}</h2>
        {line && <p>{line}</p>}
      </header>
      <div className="shelf-row">{children}</div>
    </section>
  )
}

// One product on a shelf: media, plain black name and price, line button.
function Item({ media, name, price, onMedia, onAdd, label }) {
  return (
    <article className="item">
      {onMedia ? (
        <button className="item-media" onClick={onMedia} aria-label={`Open ${name} in the builder`}>
          {media}
        </button>
      ) : (
        <span className="item-media">{media}</span>
      )}
      <h3>{name}</h3>
      <span className="price">{price}</span>
      <button className="btn btn-line btn-sm" onClick={onAdd}>
        {label || 'Add to cart'}
      </button>
    </article>
  )
}

export default function Landing({ page, onOpen, onAdd, cart }) {
  const [show, setShow] = useState(0)
  const [hold, setHold] = useState(false) // pointer or focus is on the piece
  const [paused, setPaused] = useState(false) // visitor stopped the slideshow
  const [picked, setPicked] = useState(false) // visitor chose a piece; only then announce it
  const [menu, setMenu] = useState(false) // mobile menu panel

  // Mobile menu closes on page change, Escape, or a tap outside the masthead.
  useEffect(() => setMenu(false), [page])
  useEffect(() => {
    if (!menu) return
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    const onDown = (e) => !e.target.closest('.masthead') && setMenu(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [menu])
  const hero = SHOWS[show]
  const [onHero, setOnHero] = useState(true)

  // Masthead goes maroon while it sits over a maroon section.
  useEffect(() => {
    const check = () => {
      // Probe a pixel just under the masthead's edge; rects are fractional, so no exact compare.
      const bar = document.querySelector('.masthead')
      // Anchor jumps (even repeat clicks on the same #link) stop under the sticky bar.
      document.documentElement.style.setProperty('--bar', `${bar.offsetHeight}px`)
      const y = bar.getBoundingClientRect().bottom + 1
      setOnHero(
        [...document.querySelectorAll('.hero, .build, .styled, .page-hero')].some((el) => {
          const r = el.getBoundingClientRect()
          return r.top <= y && r.bottom > y
        })
      )
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [page])

  // The hero turns through the bracelets. Hover or focus holds it; a touch, a dot,
  // or the pause button stops it for good (WCAG 2.2.2).
  useEffect(() => {
    if (hold || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setShow((i) => (i + 1) % SHOWS.length), 5200)
    return () => clearTimeout(t)
  }, [show, hold, paused])

  const photo = (p) => ({
    media: <img className="item-photo" src={p.img} alt="" loading="lazy" style={{ '--focus': p.focus }} />,
    name: p.name,
    price: npr(p.price),
    onMedia: p.form ? () => onOpen(p) : undefined,
    onAdd: () => onAdd({ name: p.name, total: p.price }),
  })

  const piece = (p) => ({
    media: <Piece form={p.form} chain={p.chain} charms={seedRack(p.form, p.charms)} idle={false} />,
    name: p.name,
    price: npr(priceOf(p.chain, p.charms)),
    onMedia: () => onOpen(p),
    onAdd: () => onAdd({ name: p.name, total: priceOf(p.chain, p.charms) }),
  })

  // Each shop page: a photographed banner, then its pieces.
  const pages = {
    bracelets: BRACELETS.map((p) => <Item key={p.id} {...piece(p)} />),
    earrings: [
      <Item
        key="hoops"
        {...piece(buildFor('earrings'))}
        name="Charm Hoops"
        price={`From ${npr(chainOf('hoop').price)}`}
        onAdd={() => onOpen(buildFor('earrings'))}
        label="Build your own"
      />,
      ...EARRINGS.map((e) => <Item key={e.id} {...photo(e)} />),
    ],
    charms: CHARMS.map((c) => (
      <Item
        key={c.id}
        media={<img className="item-charm" src={c.img} alt="" loading="lazy" />}
        name={c.name}
        price={npr(c.price)}
        onMedia={() => onOpen({ form: 'bracelet', chain: 'link', charms: [c.id] })}
        onAdd={() => onOpen({ form: 'bracelet', chain: 'link', charms: [c.id] })}
        label="Add to a piece"
      />
    )),
    belts: BELTS.map((p) => <Item key={p.id} {...photo(p)} />),
    armcuffs: ARMCUFFS.map((p) => <Item key={p.id} {...photo(p)} />),
    chains: REAL_CHAINS.map((c) => (
      <article key={c.id} className="chain-card">
        <img src={c.img} alt={`${c.name}, ${c.gauge}`} loading="lazy" />
        <div className="chain-meta">
          <h3>{c.name}</h3>
          <span className="price">
            {c.gauge} · {npr(c.price)}
          </span>
        </div>
        <p>{c.note}</p>
        <button className="btn btn-line btn-sm" onClick={() => onOpen({ form: c.forms[0], chain: c.id, charms: [] })}>
          Start with this chain
        </button>
      </article>
    )),
  }

  return (
    <>
      <header className={`masthead${onHero ? ' is-dark' : ''}`}>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="site-nav"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          onClick={() => setMenu((v) => !v)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path className="menu-line menu-line-a" d="M4 8h16" />
            <path className="menu-line menu-line-b" d="M4 16h16" />
          </svg>
        </button>
        <a className="wordmark" href="#top" aria-label="Maroon, back to top">
          <img src="/logo-mark.png" alt="" width="104" height="80" />
        </a>
        <nav id="site-nav" aria-label="Sections" data-open={menu} onClick={(e) => e.target.closest('a') && setMenu(false)}>
          <a href="#build">Build your own</a>
          <a href="#best">Best sellers</a>
          {NAV_PAGES.map((id) => (
            <a key={id} href={`#/${id}`} aria-current={page === id ? 'page' : undefined}>
              {PAGES[id].name}
            </a>
          ))}
        </nav>
        <a className="btn btn-sm" href="#build">
          Shop
          {cart > 0 && <em aria-label={`${cart} in bag`}>{cart}</em>}
        </a>
      </header>

      {page ? (
        <main className="page">
          <section className="page-hero" style={{ '--img': `url(${PAGES[page].img})` }}>
            <div className="page-hero-copy">
              <Crest className="crest-sm" />
              {/* keyed so the title writes itself in again on every page switch */}
              <h1 key={page}>{PAGES[page].name}</h1>
              <p>{PAGES[page].line}</p>
              <nav aria-label="Shop pages">
                {NAV_PAGES.map((id) => (
                  <a key={id} href={`#/${id}`} aria-current={page === id ? 'page' : undefined}>
                    {PAGES[id].name}
                  </a>
                ))}
              </nav>
            </div>
          </section>
          <section className="shelf">
            <p className="page-count">
              {pages[page].length} {page === 'chains' ? 'chains' : 'pieces'}
            </p>
            <div className={page === 'chains' ? 'chain-row' : 'shelf-row'}>{pages[page]}</div>
          </section>
        </main>
      ) : (
      <>
      <section className="hero" id="top">
        <Frame className="hero-frame">
          <Garland className="hero-garland" />
          <div className="hero-copy">
            <Crest />
            <h1>
              Charms that carry <span>a story</span>
            </h1>
            <Flourish />
            <p className="hero-lede">
              Pick the chain, hang the charms, and move them link by link until the piece reads
              the way you meant it. Then we set it by hand and send it to you.
            </p>
            <div className="hero-acts">
              <a className="btn" href="#build">
                Build your own
              </a>
              <a className="btn btn-line" href="#best">
                Shop best sellers
              </a>
            </div>
            <p className="hero-vow">
              <span>Set by hand</span>
              <span>18K gold PVD</span>
              <span>Waterproof</span>
            </p>
          </div>

          <div
            className="hero-piece"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              e.currentTarget.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * 2)
              e.currentTarget.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * 2)
            }}
            onPointerEnter={() => setHold(true)}
            onPointerDown={(e) => e.pointerType === 'touch' && setPaused(true)}
            onFocus={() => setHold(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
            onPointerLeave={(e) => {
              e.currentTarget.style.setProperty('--mx', 0)
              e.currentTarget.style.setProperty('--my', 0)
              setHold(false)
            }}
          >
            <button
              className="hero-open"
              onClick={() => onOpen(hero)}
              aria-label={`Open the builder with ${hero.name}`}
            >
              <span className="hero-oval" aria-hidden="true" />
              {CHARMS.slice(0, 3).map((c, i) => (
                <img key={c.id} className={`hero-float hero-float-${'abc'[i]}`} src={c.img} alt="" aria-hidden="true" />
              ))}
              <Piece key={hero.id} form="bracelet" chain={hero.chain} charms={seedRack('bracelet', hero.charms)} />
            </button>
            <div className="hero-tag" aria-live={picked ? 'polite' : 'off'}>
              <b>{hero.name}</b>
              <span>{npr(priceOf(hero.chain, hero.charms))}</span>
              <span className="hero-dots">
                {SHOWS.map((p, i) => (
                  <button
                    key={p.id}
                    className={i === show ? 'is-on' : ''}
                    onClick={() => {
                      setShow(i)
                      setPicked(true)
                      setPaused(true)
                    }}
                    aria-label={`Show ${p.name}`}
                    aria-pressed={i === show}
                  />
                ))}
              </span>
              <button
                className="hero-pause"
                onClick={() => setPaused((v) => !v)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  {paused ? <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /> : <path d="M3 1.5v9M9 1.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>
        </Frame>
      </section>

      <section className="hero-story">
        <Crest className="crest-sm" />
        <h2>Every charm tells a piece of the story</h2>
        <p className="hero-story-lede">Four sizes, from a dainty drop to a heavy locket. Tap one to start.</p>
        <ul>
          {SIZE_FACES.map(([size, id]) => {
            const c = CHARMS.find((x) => x.id === id)
            const z = CHARM_SIZES.find((x) => x.id === size)
            const count = CHARMS.filter((x) => x.size === size).length
            return (
              <li key={size}>
                <button
                  onClick={() => onOpen({ form: 'necklace', chain: 'cable', charms: [id] })}
                  aria-label={`Start a necklace with ${z.name.toLowerCase()} charms`}
                >
                  <img src={c.img} alt="" />
                </button>
                <span>{z.name}</span>
                <small>
                  {count} charms · from {npr(Math.min(...CHARMS.filter((x) => x.size === size).map((x) => x.price)))}
                </small>
              </li>
            )
          })}
        </ul>
      </section>

      <ul className="promise" aria-label="Our promise">
        {PROMISES.map(([icon, label]) => (
          <li key={icon}>
            <PromiseIcon name={icon} />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <section className="build" id="build">
        <Frame className="build-frame">
          <Crest className="crest-sm" />
          <header className="build-head">
            <h2>Build your own</h2>
            <p>Choose the piece, then hang every charm yourself. The price moves as you do.</p>
          </header>
          <div className="build-row">
            {BUILDS.map((b) => (
              <article key={b.id} className="build-card">
                <button
                  className="build-media"
                  onClick={() => onOpen(b)}
                  aria-label={`Build your own ${b.name}`}
                >
                  <span className="build-badge" aria-hidden="true">
                    Build your own
                  </span>
                  <Piece form={b.form} chain={b.chain} charms={seedRack(b.form, b.charms)} idle={false} />
                </button>
                <h3>{b.name}</h3>
                <span className="price">From {npr(chainOf(b.chain).price)}</span>
              </article>
            ))}
          </div>
        </Frame>
      </section>

      <Shelf id="best" title="Best sellers" line="The arrangements people keep coming back for.">
        {BESTSELLERS.map((p) => (
          <Item key={p.id} {...photo(p)} />
        ))}
      </Shelf>

      <section className="styled">
        <Frame>
          <Crest className="crest-sm" />
          <h2>
            Styled <em>by you</em>
          </h2>
          <p>Their charms, their story. Yours is next.</p>
          <div className="styled-row">
            {STYLED.map((p) => (
              <img key={p.img} className="styled-photo" src={p.img} alt={p.alt} loading="lazy" />
            ))}
          </div>
        </Frame>
      </section>

      <section className="cats" id="shop">
        <h2>Shop by category</h2>
        <ul>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <a href={`#/${cat.id}`}>
                <span className="cats-media">
                  {cat.img ? (
                    <img className="item-photo" src={cat.img} alt="" loading="lazy" style={{ '--focus': cat.focus }} />
                  ) : (
                    <img className="cats-charm" src={cat.charm} alt="" loading="lazy" />
                  )}
                </span>
                <span className="cats-name">{cat.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="close">
        <figure className="close-photo close-photo-l">
          <img src="/shop/best9.jpg" alt="Four charm bracelets boxed and ready to send" loading="lazy" />
        </figure>
        <div className="close-copy">
          {CLOSE_CHARMS.map((id, i) => (
            <img key={id} className={`close-charm close-charm-${i}`} src={`/charms/${id}.webp`} alt="" aria-hidden="true" loading="lazy" />
          ))}
          <Crest />
          <h2>Start with an empty chain</h2>
          <p>
            Fill it slowly: a charm for a city, one for a person, one for the year you would rather
            not repeat.
          </p>
          <button className="btn" onClick={() => onOpen({ form: 'bracelet', chain: 'link', charms: [] })}>
            Build your own
          </button>
        </div>
        <figure className="close-photo close-photo-r">
          <img src="/shop/best4.jpg" alt="Seaside charm necklace, worn" loading="lazy" />
        </figure>
      </section>

      </>
      )}

      <footer className="foot">
        <Garland />
        <div className="foot-inner">
          <img className="foot-logo" src="/logo.png" alt="Maroon" width="96" height="96" loading="lazy" />
          <p className="foot-line">Charms that carry a story. Set by hand, sent to you.</p>
          <nav aria-label="Footer">
            <a href="#build">Build your own</a>
            <a href="#best">Best sellers</a>
            {Object.entries(PAGES).map(([id, pg]) => (
              <a key={id} href={`#/${id}`}>
                {pg.name}
              </a>
            ))}
          </nav>
          <p className="foot-vow">18K gold PVD · Waterproof · Hypoallergenic · Fast dispatch</p>
          <p className="foot-note">
            Demo storefront. All photography is real; prices, names and stock are placeholders in
            Nepalese rupees and charge nothing.
          </p>
        </div>
      </footer>
    </>
  )
}
