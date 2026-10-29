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

// A spread across the four sizes for the charms shelf; the builder has the rest.
const CHARM_PICKS = ['cherry', 'blossom', 'locket', 'letter', 'shell', 'porcheart', 'boot', 'pearl', 'spiral', 'bow']

// Charms scattered around the closing call, and strung along the footer.
const CLOSE_CHARMS = ['cherry', 'starfish', 'blossom', 'letter']
const GARLAND = ['pearl', 'cherry', 'shell', 'bow', 'blossom', 'letter', 'turtle', 'porcheart', 'starfish', 'tear', 'locket', 'cube', 'boot']

// Chains you can choose; the fixed bases (hoops, keyring, pin) live in their own builders.
const REAL_CHAINS = CHAINS.filter((c) => c.forms.includes('bracelet') || c.forms.includes('necklace'))

function Shelf({ id, title, line, tint, children }) {
  return (
    <section className={`shelf${tint ? ' chapter-tint' : ''}`} id={id}>
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

export default function Landing({ onOpen, onAdd, cart }) {
  const [show, setShow] = useState(0)
  const [hold, setHold] = useState(false)
  const hero = SHOWS[show]

  // The hero turns through the bracelets; pointer over it holds the current one.
  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setShow((i) => (i + 1) % SHOWS.length), 5200)
    return () => clearTimeout(t)
  }, [show, hold])

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

  return (
    <>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Maroon, back to top">
          <img src="/logo-mark.png" alt="" width="104" height="80" />
        </a>
        <nav aria-label="Sections">
          <a href="#build">Build your own</a>
          <a href="#best">Best sellers</a>
          <a href="#bracelets">Bracelets</a>
          <a href="#earrings">Earrings</a>
          <a href="#belts">Belts</a>
          <a href="#armcuffs">Armcuffs</a>
        </nav>
        <a className="btn btn-sm" href="#build">
          Shop
          {cart > 0 && <em aria-label={`${cart} in bag`}>{cart}</em>}
        </a>
      </header>

      <section className="hero" id="top">
        <Frame className="hero-frame">
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
              <Crest className="oval-crest" />
              {CHARMS.slice(0, 3).map((c, i) => (
                <img key={c.id} className={`hero-float hero-float-${'abc'[i]}`} src={c.img} alt="" aria-hidden="true" />
              ))}
              <Piece key={hero.id} form="bracelet" chain={hero.chain} charms={seedRack('bracelet', hero.charms)} />
            </button>
            <div className="hero-tag" aria-live="polite">
              <b>{hero.name}</b>
              <span>{npr(priceOf(hero.chain, hero.charms))}</span>
              <span className="hero-dots">
                {SHOWS.map((p, i) => (
                  <button
                    key={p.id}
                    className={i === show ? 'is-on' : ''}
                    onClick={() => setShow(i)}
                    aria-label={`Show ${p.name}`}
                    aria-pressed={i === show}
                  />
                ))}
              </span>
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
                  onClick={() => onOpen({ form: 'bracelet', chain: 'link', charms: [id] })}
                  aria-label={`Start a bracelet with ${z.name.toLowerCase()} charms`}
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
        <h2>
          Styled <em>by you</em>
        </h2>
        <p>Their charms, their story. Yours is next.</p>
        <div className="styled-row">
          {STYLED.map((p) => (
            <img key={p.img} className="styled-photo" src={p.img} alt={p.alt} loading="lazy" />
          ))}
        </div>
      </section>

      <Shelf id="bracelets" title="Bracelets" line="Ready-made, still yours to move. Open any one and swap a charm.">
        {BRACELETS.map((p) => (
          <Item key={p.id} {...piece(p)} />
        ))}
      </Shelf>

      <Shelf id="earrings" title="Earrings" line="Handmade on the bench, or hoops you dress yourself." tint>
        <Item
          {...piece(buildFor('earrings'))}
          name="Charm Hoops"
          price={`From ${npr(chainOf('hoop').price)}`}
          onAdd={() => onOpen(buildFor('earrings'))}
          label="Build your own"
        />
        {EARRINGS.map((e) => (
          <Item key={e.id} {...photo(e)} />
        ))}
      </Shelf>

      <Shelf id="charms" title="Charms" line="Twenty-nine charms in four sizes, small to bulky. Every one is in the builder.">
        {CHARM_PICKS.map((id) => CHARMS.find((c) => c.id === id)).map((c) => (
          <Item
            key={c.id}
            media={<img className="item-charm" src={c.img} alt="" loading="lazy" />}
            name={c.name}
            price={npr(c.price)}
            onMedia={() => onOpen({ form: 'bracelet', chain: 'link', charms: [c.id] })}
            onAdd={() => onOpen({ form: 'bracelet', chain: 'link', charms: [c.id] })}
            label="Add to a piece"
          />
        ))}
      </Shelf>

      <Shelf id="belts" title="Belts" line="Western buckles, hearts, stars and leopard." tint>
        {BELTS.map((p) => (
          <Item key={p.id} {...photo(p)} />
        ))}
      </Shelf>

      <Shelf id="armcuffs" title="Armcuffs" line="Wire-wrapped by hand around glass flowers and beads. Worn high on the arm.">
        {ARMCUFFS.map((p) => (
          <Item key={p.id} {...photo(p)} />
        ))}
      </Shelf>

      <section className="chapter chapter-tint" id="shop">
        <header className="chapter-head">
          <h2>Shop by piece</h2>
          <p>Every charm on the site fits every piece below. Start with the one you will wear most.</p>
        </header>
        <div className="range">
          {CATEGORIES.map((cat) => (
            <article key={cat.id} className="cat">
              <figure className="cat-media">
                {cat.form ? (
                  <Piece
                    form={cat.form}
                    chain={buildFor(cat.form).chain}
                    charms={seedRack(cat.form, buildFor(cat.form).charms)}
                    idle={false}
                  />
                ) : (
                  <img className="item-photo" src={cat.img} alt="" loading="lazy" style={{ '--focus': cat.focus }} />
                )}
              </figure>
              <h3>{cat.name}</h3>
              <p>{cat.line}</p>
              {cat.form ? (
                <button className="btn btn-sm" onClick={() => onOpen(buildFor(cat.form))}>
                  Build your own
                </button>
              ) : (
                <a className="btn btn-sm" href={cat.href}>
                  Shop
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="chapter" id="chains">
        <header className="chapter-head">
          <h2>The chains</h2>
          <p>Five chains of gold, from barely there to wide and loud.</p>
        </header>
        <div className="chain-row">
          {REAL_CHAINS.map((c) => (
            <article key={c.id} className="chain-card">
              <img src={c.img} alt={`${c.name}, ${c.gauge}`} loading="lazy" />
              <div className="chain-meta">
                <h3>{c.name}</h3>
                <span className="price">
                  {c.gauge} · {npr(c.price)}
                </span>
              </div>
              <p>{c.note}</p>
              <button
                className="btn btn-line btn-sm"
                onClick={() => onOpen({ form: c.forms[0], chain: c.id, charms: [] })}
              >
                Start with this chain
              </button>
            </article>
          ))}
        </div>
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

      <footer className="foot">
        <ul className="foot-garland" aria-hidden="true">
          {GARLAND.map((id, i) => (
            <li key={i} style={{ '--sway': `${(i % 4) * -0.6}s` }}>
              <img src={`/charms/${id}.webp`} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
        <div className="foot-inner">
          <img className="foot-logo" src="/logo.png" alt="Maroon" width="96" height="96" loading="lazy" />
          <p className="foot-line">Charms that carry a story. Set by hand, sent to you.</p>
          <nav aria-label="Footer">
            <a href="#build">Build your own</a>
            <a href="#best">Best sellers</a>
            <a href="#bracelets">Bracelets</a>
            <a href="#earrings">Earrings</a>
            <a href="#charms">Charms</a>
            <a href="#belts">Belts</a>
            <a href="#armcuffs">Armcuffs</a>
            <a href="#chains">Chains</a>
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
