import { useEffect, useMemo, useState } from 'react'
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
  PROMISES,
  CHARMS,
  CHARM_SIZES,
  DETAILS,
  EARRINGS,
  STYLED,
  chainOf,
  charmOf,
  npr,
  priceOf,
  seedRack,
} from './data.js'


// Each buildable category shows its "Build your own" arrangement.
const buildFor = (form) => BUILDS.find((b) => b.form === form)

// The hero wall: photographed best sellers plus a stacked-wrist shot, edge to edge behind the copy.
const REEL = [
  ...['best-seaside', 'best-citrus'].map((id) => BESTSELLERS.find((p) => p.id === id).img),
  '/shop/hero-stack.jpg',
  BESTSELLERS.find((p) => p.id === 'best-pearl-hoops').img,
]

// One face for each charm size; the builder opens on that size's tab.
const SIZE_FACES = [['small', 'pearl'], ['medium', 'cherry'], ['big', 'blossom'], ['bulky', 'locket']]


// Charms scattered around the closing call, and strung along the footer.
const CLOSE_CHARMS = ['cherry', 'starfish', 'blossom', 'letter']
const GARLAND = ['pearl', 'cherry', 'shell', 'bow', 'blossom', 'letter', 'turtle', 'porcheart', 'starfish', 'tear', 'locket', 'cube', 'boot']

// Gold line with charms hanging off it, each a link to its own page; shared by the masthead and the footer.
function Garland({ className = '' }) {
  return (
    <ul className={`foot-garland ${className}`} aria-label="Charms">
      {GARLAND.map((id, i) => (
        <li key={i} data-charm={id} style={{ '--sway': `${(i % 4) * -0.6}s` }}>
          <a href={`#/charms/${id}`} aria-label={charmOf(id).name}>
            <img src={`/charms/${id}.webp`} alt="" loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  )
}

// Shop pages in the masthead; the footer lists them too.
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

// One product on a shelf: media, plain black name and price, a way into its detail page.
function Item({ media, name, price, href, onAdd }) {
  return (
    <article className="item">
      {onAdd && (
        <button className="item-cart" onClick={onAdd} aria-label={`Add ${name} to cart`} title="Add to cart">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2.2l2.3 11h10.2l2-8H6.2" />
            <circle cx="9.5" cy="19.5" r="1.4" />
            <circle cx="16.5" cy="19.5" r="1.4" />
          </svg>
        </button>
      )}
      <a className="item-media" href={href} tabIndex={-1} aria-hidden="true">
        {media}
      </a>
      <h3>
        <a href={href}>{name}</a>
      </h3>
      <span className="price">{price}</span>
      <a className="btn btn-line btn-sm" href={href} aria-label={`View details for ${name}`}>
        View details
      </a>
    </article>
  )
}

// A shelf card for anything with a detail page.
const cardOf = (sec, p) => ({
  media: !p.img ? (
    <Piece form={p.form} chain={p.chain} charms={seedRack(p.form, p.charms, p.chain)} idle={false} />
  ) : sec === 'charms' ? (
    <img className="item-charm" src={p.img} alt="" loading="lazy" />
  ) : (
    <img className="item-photo" src={p.img} alt="" loading="lazy" style={{ '--focus': p.focus }} />
  ),
  name: p.name,
  price: npr(p.price ?? priceOf(p.chain, p.charms)),
  href: `#/${sec}/${p.id}`,
})

// Under a product: five random pieces from the shop, charms left out. Reshuffled per product, not per render.
function Recommended({ product }) {
  const picks = useMemo(
    () =>
      Object.entries(DETAILS)
        .filter(([s]) => s !== 'charms')
        .flatMap(([s, d]) => d.items.filter((p) => p !== product).map((p) => [Math.random(), s, p]))
        .sort((a, b) => a[0] - b[0])
        .slice(0, 5),
    [product]
  )

  return (
    <Shelf title="You might also like">
      {picks.map(([, s, p]) => (
        <Item key={p.id} {...cardOf(s, p)} />
      ))}
    </Shelf>
  )
}

// One product at #/<section>/<id>: photo, any options, what it is, how to buy it.
function ProductDetail({ product: p, section, onAdd, onOpen }) {
  const [pick, setPick] = useState(0)
  const option = p.options?.[pick]
  const name = option ? `${p.name}, ${option.label}` : p.name
  const price = p.price ?? priceOf(p.chain, p.charms)
  const color = p.color || (option && option.label)
  const isCharm = section === 'charms'
  const size = isCharm && CHARM_SIZES.find((z) => z.id === p.size)

  const facts = [
    ...((!p.form && DETAILS[section].spec) || []),
    color && `Color: ${color}`,
    size && `Size: ${size.name}`,
    p.chain && `Chain: ${chainOf(p.chain).name}`,
    p.charms?.length > 0 && `Charms: ${p.charms.map((id) => charmOf(id).name).join(', ')}`,
  ].filter(Boolean)

  return (
    <section className="detail">
      <a className="detail-back" href={section === 'best' ? '#best' : `#/${section}`}>
        {section === 'best' ? 'Best sellers' : `All ${PAGES[section].name.toLowerCase()}`}
      </a>
      <div className="detail-grid">
        <div className="detail-photo">
          {p.img ? (
            <img className={`item-photo${isCharm ? ' is-cutout' : ''}`} src={option?.img || p.img} alt={name} />
          ) : (
            <Piece form={p.form} chain={p.chain} charms={seedRack(p.form, p.charms, p.chain)} idle={false} />
          )}
        </div>
        <div className="detail-info">
          <h1>{p.name}</h1>
          <span className="price">{npr(price)}</span>
          {(p.story || p.line) && <p className="detail-note">{p.story || p.line}</p>}
          {p.options && (
            <div className="detail-pick" role="group" aria-label={`Choose your ${p.color ? 'style' : 'color'}`}>
              <p>Choose your {p.color ? 'style' : 'color'}</p>
              <div>
                {p.options.map((o, i) => (
                  <button key={o.label} className={i === pick ? 'is-on' : ''} onClick={() => setPick(i)} aria-pressed={i === pick}>
                    <img src={o.img} alt="" />
                    <span>{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {facts.length > 0 && (
            <ul className="detail-spec">
              {facts.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          {isCharm ? (
            <button className="btn" onClick={() => onOpen({ ...BUILDS[0], charms: [p.id] })}>
              Add to a piece
            </button>
          ) : (
            <button className="btn" onClick={() => onAdd({ name, total: price })}>
              Add to cart
            </button>
          )}
          {p.form && (
            <button className="btn btn-line" onClick={() => onOpen(p)}>
              Customize it
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Landing({ page, product, section, onOpen, onAdd, cart }) {
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
  }, [page, product])

  // Each shop page: a photographed banner, then its pieces.
  const pages = {
    bracelets: BRACELETS.map((p) => <Item key={p.id} {...cardOf('bracelets', p)} />),
    earrings: [
      <Item key="hoops" {...cardOf('earrings', buildFor('earrings'))} price={`From ${npr(chainOf('hoop').price)}`} />,
      ...EARRINGS.map((e) => <Item key={e.id} {...cardOf('earrings', e)} />),
    ],
    charms: CHARM_SIZES.map((z) => (
      <section key={z.id} id={z.id} className="charm-size">
        <header className="charm-size-head">
          <h2>{z.name}</h2>
          <p>{z.line}</p>
        </header>
        <div className="shelf-row">
          {CHARMS.filter((c) => c.size === z.id).map((c) => (
            <Item key={c.id} {...cardOf('charms', c)} />
          ))}
        </div>
      </section>
    )),
    belts: BELTS.map((p) => <Item key={p.id} {...cardOf('belts', p)} />),
    armcuffs: ARMCUFFS.map((p) => <Item key={p.id} {...cardOf('armcuffs', p)} />),
  }

  return (
    <>
      <Masthead page={page} cart={cart} dark={onHero} />

      {product ? (
        <main className="page">
          <ProductDetail key={product.id} product={product} section={section} onAdd={onAdd} onOpen={onOpen} />
          <Recommended product={product} />
        </main>
      ) : page ? (
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
              {page === 'charms' ? `${CHARMS.length} charms` : `${pages[page].length} pieces`}
            </p>
            {page === 'charms' ? pages.charms : <div className="shelf-row">{pages[page]}</div>}
          </section>
        </main>
      ) : (
      <>
      <section className="hero" id="top">
        <div className="hero-wall" aria-hidden="true">
          {REEL.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
        <Garland className="hero-garland" />
        <div className="hero-copy">
          <p className="hero-vow">
            <span>Set by hand</span>
            <span>18K gold PVD</span>
            <span>Waterproof</span>
          </p>
          <h1>
            Charms that carry <span>a story</span>
          </h1>
          <p className="hero-lede">
            Pick the chain, hang the charms, and move them link by link until the piece reads
            the way you meant it. Then we set it by hand and send it to you.
          </p>
          <div className="hero-acts">
            <button className="btn" onClick={() => onOpen(BUILDS[0])}>
              Build your own
            </button>
            <a className="btn btn-line" href="#best">
              Shop best sellers
            </a>
          </div>
        </div>
      </section>

      <section className="hero-story">
        <Crest className="crest-sm" />
        <h2>The Charm Bar</h2>
        <p className="hero-story-sub">Every charm tells a piece of the story</p>
        <p className="hero-story-lede">Four sizes, from a dainty drop to a heavy locket. Tap one to see them all.</p>
        <ul>
          {SIZE_FACES.map(([size, id]) => {
            const c = CHARMS.find((x) => x.id === id)
            const z = CHARM_SIZES.find((x) => x.id === size)
            const count = CHARMS.filter((x) => x.size === size).length
            return (
              <li key={size}>
                <a href={`#/charms/${size}`} aria-label={`See the ${z.name.toLowerCase()} charms`}>
                  <img src={c.img} alt="" />
                </a>
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
                  <Piece form={b.form} chain={b.chain} charms={seedRack(b.form, b.charms, b.chain)} idle={false} />
                </button>
                <h3>{b.name}</h3>
                <span className="price">From {npr(chainOf(b.chain).price)}</span>
              </article>
            ))}
          </div>
          <ol className="build-steps">
            <li><span>1</span>Pick the piece &amp; its chain</li>
            <li><span>2</span>Hang your charms where you like</li>
            <li><span>3</span>We solder it by hand and send it</li>
          </ol>
        </Frame>
      </section>

      <Shelf id="best" title="Best sellers" line="The arrangements people keep coming back for.">
        {BESTSELLERS.map((p) => (
          <Item key={p.id} {...cardOf('best', p)} onAdd={() => onAdd({ name: p.name, total: p.price })} />
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

      <Footer />
    </>
  )
}

// Footer contact links, shown as icons only (the label is for screen readers).
const SOCIAL = [
  {
    id: 'instagram',
    label: 'Maroon on Instagram',
    href: 'https://www.instagram.com/maroon.np/',
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    id: 'facebook',
    label: 'Maroon on Facebook',
    href: 'https://www.facebook.com/profile.php?id=61571807237940',
    icon: <path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.5-1.5H17V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8.5v3H11V21" />,
  },
  {
    id: 'whatsapp',
    label: 'Message Maroon on WhatsApp',
    href: 'https://wa.me/9779863911545',
    icon: (
      <>
        <path d="M4 20l1.2-4.1A8 8 0 1 1 8.3 19z" />
        <path d="M9 8.5c0 3.4 3 6.5 6.5 6.5l1-1.4-2-1-1 .8c-1-.5-1.9-1.4-2.4-2.4l.8-1-1-2z" />
      </>
    ),
  },
  {
    id: 'email',
    label: 'Email Maroon at maroonp.business@gmail.com',
    href: 'mailto:maroonp.business@gmail.com',
    icon: (
      <>
        <rect x="3" y="5.5" width="18" height="13" rx="2" />
        <path d="M3.5 7l8.5 6.5L20.5 7" />
      </>
    ),
  },
]

// Shared with the builder; onNav lets the builder close before a footer link jumps.
export function Footer({ onNav }) {
  return (
    <footer className="foot" onClick={(e) => e.target.closest('a[href^="#"]') && onNav?.()}>
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
        <ul className="foot-social" aria-label="Contact Maroon">
          {SOCIAL.map((x) => (
            <li key={x.id}>
              <a href={x.href} target={x.id === 'email' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={x.label} title={x.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{x.icon}</svg>
              </a>
            </li>
          ))}
        </ul>
        <p className="foot-vow">18K gold PVD · Waterproof · Hypoallergenic · Fast dispatch</p>
        <p className="foot-note">
          Demo storefront. All photography is real; prices, names and stock are placeholders in
          Nepalese rupees and charge nothing.
        </p>
      </div>
    </footer>
  )
}

// The site navbar, shared with the builder; onNav lets the builder close before a link jumps.
export function Masthead({ page, cart, dark = false, onNav }) {
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

  return (
    <header className={`masthead${dark ? ' is-dark' : ''}`} onClick={(e) => e.target.closest('a') && onNav?.()}>
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
  )
}
