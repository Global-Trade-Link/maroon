import Piece from './Piece.jsx'
import { Guilloche, Icon, Laurel, Rule, Scallop, Seal, VineEdge } from './Ornament.jsx'
import { CHAINS, CHARMS, PRESETS, npr, priceOf, seedRack } from './data.js'

const HOUSE = [
  ['cast', 'Cast in the studio', 'Every charm starts as wax on the bench upstairs, not as a stock order.'],
  ['solder', 'Soldered by hand', 'Your layout is set link by link, in the order you left it.'],
  ['pouch', 'Sent in a linen pouch', 'Boxed, tied, and posted the week it is finished.'],
]

export default function Landing({ onOpen, cart }) {
  const hero = PRESETS[0]

  return (
    <>
      <VineEdge side="l" />
      <VineEdge side="r" />

      <header className="masthead">
        <a className="wordmark" href="#top">
          <img src="/logo.png" alt="" width="40" height="40" />
          <span>Maroon</span>
        </a>
        <nav>
          <a href="#chains">Chains</a>
          <a href="#charms">Charms</a>
          <a href="#pieces">Ready-made</a>
        </nav>
        <button className="cart" onClick={() => onOpen(hero)}>
          Build yours
          {cart > 0 && <em>{cart}</em>}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>
            Charms that <em>carry</em> a story.
          </h1>
          <Laurel />
          <p className="hero-lede">
            Pick the chain. Hang the charms. Move them link by link until the piece reads the way
            you meant it. Then we cast it, solder it, and post it.
          </p>
          <div className="hero-acts">
            <button className="btn" onClick={() => onOpen(hero)}>
              Start a piece
            </button>
            <a className="btn btn-ghost" href="#charms">
              See the charms
            </a>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>3</dt>
              <dd>gold-tone chains, 2 to 10 mm</dd>
            </div>
            <div>
              <dt>9</dt>
              <dd>links a bracelet will carry</dd>
            </div>
            <div>
              <dt>18k</dt>
              <dd>plate over stainless steel</dd>
            </div>
          </dl>
        </div>

        <button
          className="hero-piece"
          onClick={() => onOpen(hero)}
          aria-label="Open the builder with The Lucky Hand"
        >
          <span className="hero-frame" />
          <span className="hero-seal">
            <Seal label="Kathmandu" />
          </span>
          <Piece form="bracelet" chain="cable" charms={seedRack('bracelet', hero.charms)} />
          <span className="hero-tag">
            {hero.name} · {npr(priceOf(hero.chain, hero.charms))}
          </span>
        </button>
      </section>

      <section className="house">
        <div className="house-row">
          {HOUSE.map(([icon, title, body]) => (
            <div className="house-item" key={title}>
              <span className="house-medal">
                <Icon name={icon} />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="chapter" id="chains">
        <Rule>Step one — the chain</Rule>
        <h2 className="chapter-head">Three weights of gold, and nothing in between.</h2>
        <div className="chain-row">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              className="arch"
              onClick={() => onOpen({ form: 'bracelet', chain: c.id, charms: [] })}
            >
              <span className="arch-well">
                <img src={c.img} alt={`${c.name}, ${c.gauge} gauge`} loading="lazy" />
              </span>
              <h3>{c.name}</h3>
              <p>{c.note}</p>
              <span className="arch-foot">
                {c.gauge} <b>{npr(c.price)}</b>
              </span>
            </button>
          ))}
        </div>
      </section>

      <Scallop tone="#47091a" />
      <section className="chapter chapter-dark" id="charms">
        <Guilloche id="g-charms" />
        <div className="chapter-inner">
          <Rule>Step two — the charms</Rule>
          <h2 className="chapter-head">
            Small objects with <em>opinions</em>.
          </h2>
          <div className="charm-rail">
            <span className="rail-wire" aria-hidden="true" />
            {CHARMS.map((c, i) => (
              <button
                key={c.id}
                className="hang"
                style={{ ['--drop']: `${[0, 46, 18][i]}px`, ['--sway']: `${i * -0.7}s` }}
                onClick={() => onOpen({ form: 'bracelet', chain: 'cable', charms: [c.id] })}
              >
                <span className="hang-thread" aria-hidden="true" />
                <span className="hang-cameo">
                  <img src={c.img} alt={c.name} loading="lazy" />
                </span>
                <h3>{c.name}</h3>
                <p>{c.story}</p>
                <span className="hang-price">{npr(c.price)}</span>
              </button>
            ))}
          </div>
          <p className="charm-note">
            Three charms are cast and in the studio right now. The rest of the season lands in
            October.
          </p>
        </div>
      </section>
      <Scallop tone="#47091a" flip />

      <section className="chapter" id="pieces">
        <Rule>Or start from one of ours</Rule>
        <h2 className="chapter-head">Ready-made, still yours to move.</h2>
        <div className="preset-row">
          {PRESETS.map((p) => (
            <button key={p.id} className="preset" onClick={() => onOpen(p)}>
              <span className="preset-well">
                <Piece form={p.form} chain={p.chain} charms={seedRack(p.form, p.charms)} idle={false} />
              </span>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              <span className="preset-foot">
                <b>{npr(priceOf(p.chain, p.charms))}</b>
                <em>Open in the builder →</em>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="monogram">
        <div className="monogram-panel">
          <Guilloche id="g-mono" />
          <div className="monogram-inner">
            <span className="monogram-seal">
              <Seal label="Maroon" />
            </span>
            <h2>
              Every charm tells a <em>piece</em> of the story.
            </h2>
            <p>
              Start with an empty chain and fill it slowly — a charm for a city, a charm for a
              person, a charm for the year you would rather not repeat.
            </p>
            <button className="btn btn-gold" onClick={() => onOpen(hero)}>
              Build yours
            </button>
          </div>
        </div>
      </section>

      <footer className="foot">
        <Laurel />
        <p className="foot-mark">Maroon</p>
        <p className="foot-note">
          Demo storefront. Product photography is real; prices, names and stock are placeholders in
          Nepalese rupees and charge nothing.
        </p>
        <nav>
          <a href="#chains">Chains</a>
          <a href="#charms">Charms</a>
          <a href="#pieces">Ready-made</a>
        </nav>
      </footer>
    </>
  )
}
