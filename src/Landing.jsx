import { useEffect, useState } from 'react'
import Piece from './Piece.jsx'
import { PromiseIcon } from './Icons.jsx'
import { Crest, Flourish, Frame } from './Ornament.jsx'
import {
  BRACELETS,
  BUILDS,
  CATEGORIES,
  CHAINS,
  CHARMS,
  EARRINGS_RINGS,
  PRESETS,
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

// What the two buildable categories show in their frame.
const SHOWCASE = {
  necklace: { chain: 'fine', charms: ['hamsa', 'ballet', 'mushroom'] },
  bracelet: { chain: 'cable', charms: ['mushroom', 'hamsa', 'ballet', 'hamsa', 'mushroom'] },
}

const BEST = [PRESETS[0], PRESETS[2], BRACELETS[2], PRESETS[1], BRACELETS[4]]

function Slot({ label = 'Photograph arriving' }) {
  return (
    <span className="photo-slot">
      <img src="/logo-mark.png" alt="" width="64" height="50" />
      <span>{label}</span>
    </span>
  )
}

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
  const hero = PRESETS[0]
  const [soon, setSoon] = useState('')

  useEffect(() => {
    if (!soon) return
    const t = setTimeout(() => setSoon(''), 3600)
    return () => clearTimeout(t)
  }, [soon])

  const shop = (cat) =>
    cat.form
      ? onOpen({ form: cat.form, ...SHOWCASE[cat.form] })
      : setSoon(`${cat.name} arrive with their photographs soon.`)

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
          <a href="#earrings">Earrings &amp; rings</a>
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
              <button className="btn" onClick={() => onOpen(hero)}>
                Build your own
              </button>
              <a className="btn btn-line" href="#best">
                Shop best sellers
              </a>
            </div>
          </div>

          <button
            className="hero-piece"
            onClick={() => onOpen(hero)}
            aria-label={`Open the builder with ${hero.name}`}
          >
            <span className="hero-oval" aria-hidden="true" />
            <Piece form="bracelet" chain="cable" charms={seedRack('bracelet', hero.charms)} />
            <span className="hero-tag">
              <b>{hero.name}</b>
              <span>{npr(priceOf(hero.chain, hero.charms))}</span>
            </span>
          </button>
        </Frame>
      </section>

      <section className="hero-story">
        <Crest className="crest-sm" />
        <h2>Every charm tells a piece of the story</h2>
        <ul>
          {CHARMS.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onOpen({ form: 'bracelet', chain: 'cable', charms: [c.id] })}
                aria-label={`Start a bracelet with the ${c.name}`}
              >
                <img src={c.img} alt="" />
              </button>
              <span>{c.name}</span>
            </li>
          ))}
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
                  onClick={() =>
                    b.form ? onOpen(b) : setSoon(`${b.name}s arrive with their photographs soon.`)
                  }
                  aria-label={`Build your own ${b.name}`}
                >
                  <span className="build-badge" aria-hidden="true">
                    Build your own
                  </span>
                  {b.form ? (
                    <Piece form={b.form} chain={b.chain} charms={seedRack(b.form, b.charms)} idle={false} />
                  ) : (
                    <Slot />
                  )}
                </button>
                <h3>{b.name}</h3>
                <span className="price">From {npr(b.form ? chainOf(b.chain).price : b.from)}</span>
              </article>
            ))}
          </div>
        </Frame>
      </section>

      <Shelf id="best" title="Best sellers" line="The arrangements people keep coming back for.">
        {BEST.map((p) => (
          <Item key={p.id} {...piece(p)} />
        ))}
      </Shelf>

      <section className="styled">
        <h2>
          Styled <em>by you</em>
        </h2>
        <p>Their charms, their story. Yours is next.</p>
        <div className="styled-row">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="styled-slot">
              <Slot label="Customer photograph arriving" />
            </span>
          ))}
        </div>
      </section>

      <Shelf id="bracelets" title="Bracelets" line="Ready-made, still yours to move. Open any one and swap a charm.">
        {BRACELETS.map((p) => (
          <Item key={p.id} {...piece(p)} />
        ))}
      </Shelf>

      <Shelf id="earrings" title="Earrings & rings" line="Small charms for the ear and the hand." tint>
        {EARRINGS_RINGS.map((e) => (
          <Item
            key={e.id}
            media={<Slot />}
            name={e.name}
            price={npr(e.price)}
            onAdd={() => onAdd({ name: e.name, total: e.price })}
          />
        ))}
      </Shelf>

      <Shelf id="charms" title="Charms" line="Three are cast and in the studio right now. The rest of the season lands soon.">
        {CHARMS.map((c) => (
          <Item
            key={c.id}
            media={<img className="item-charm" src={c.img} alt="" loading="lazy" />}
            name={c.name}
            price={npr(c.price)}
            onMedia={() => onOpen({ form: 'bracelet', chain: 'cable', charms: [c.id] })}
            onAdd={() => onOpen({ form: 'bracelet', chain: 'cable', charms: [c.id] })}
            label="Add to a piece"
          />
        ))}
      </Shelf>

      <section className="chapter chapter-tint" id="shop">
        <header className="chapter-head">
          <h2>Shop by piece</h2>
          <p>Every charm on the site fits every piece below. Start with the one you will wear most.</p>
        </header>
        <div className="range">
          {CATEGORIES.map((cat) => (
            <article key={cat.id} className={`cat${cat.form ? ' cat-live' : ''}`}>
              <figure className="cat-media">
                {cat.form ? (
                  <Piece
                    form={cat.form}
                    chain={SHOWCASE[cat.form].chain}
                    charms={seedRack(cat.form, SHOWCASE[cat.form].charms)}
                    idle={false}
                  />
                ) : (
                  <Slot />
                )}
              </figure>
              <h3>{cat.name}</h3>
              <p>{cat.line}</p>
              <button className="btn btn-sm" onClick={() => shop(cat)}>
                {cat.form ? 'Shop & build' : 'Shop'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="chapter" id="chains">
        <header className="chapter-head">
          <h2>The chains</h2>
          <p>Three weights of gold, from barely there to wide and loud.</p>
        </header>
        <div className="chain-row">
          {CHAINS.map((c) => (
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
                onClick={() => onOpen({ form: 'bracelet', chain: c.id, charms: [] })}
              >
                Start with this chain
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="close">
        <Crest />
        <h2>Start with an empty chain</h2>
        <p>
          Fill it slowly: a charm for a city, one for a person, one for the year you would rather
          not repeat.
        </p>
        <button className="btn" onClick={() => onOpen({ form: 'bracelet', chain: 'cable', charms: [] })}>
          Build your own
        </button>
      </section>

      <footer className="foot">
        <nav aria-label="Footer">
          <a href="#build">Build your own</a>
          <a href="#best">Best sellers</a>
          <a href="#bracelets">Bracelets</a>
          <a href="#earrings">Earrings &amp; rings</a>
          <a href="#charms">Charms</a>
          <a href="#chains">Chains</a>
        </nav>
        <p>
          Demo storefront. Charm and chain photography is real; prices, names and stock are
          placeholders in Nepalese rupees and charge nothing.
        </p>
      </footer>

      {soon && (
        <p className="receipt" role="status">
          {soon}
        </p>
      )}
    </>
  )
}
