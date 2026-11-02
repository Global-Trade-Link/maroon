import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flourish, Frame } from './Ornament.jsx'
import Piece, { VIEW, geometry } from './Piece.jsx'
import { Footer, Masthead } from './Landing.jsx'
import { ASSEMBLY, BUILDS, charmOf, CHARMS, CHARM_SIZES, chainOf, chainsFor, formOf, nextFreeSlot, npr, priceOf, seedRack } from './data.js'

export default function Builder({ start, cart, onBack, onAdd, onSwitch }) {
  // One builder per form: a bracelet page never turns into a necklace page.
  const form = start.form
  const chains = chainsFor(form)
  const startChain = chains.some((c) => c.id === start.chain) ? start.chain : chains[0].id
  const [chain, setChain] = useState(startChain)
  const [size, setSize] = useState(() => charmOf(start.charms[0])?.size || 'small')
  const [assembly, setAssembly] = useState('exact')
  const [rack, setRack] = useState(() => seedRack(start.form, start.charms, startChain))
  const [drag, setDrag] = useState(null)
  const [toast, setToast] = useState('')

  const svgRef = useRef(null)
  const wellRef = useRef(null)
  const trashRef = useRef(null)
  const slots = useMemo(() => geometry(form, chain).slots, [form, chain])

  const total = priceOf(chain, rack)
  const placed = rack.filter(Boolean).length

  const countOf = (id) => rack.filter((x) => x === id).length

  // A pendant (one spot) swaps its charm instead of filling up.
  const single = rack.length === 1

  const pickChain = (id) => {
    setChain(id)
    const kept = rack.filter(Boolean)
    const next = seedRack(form, kept, id)
    if (next.length === rack.length) return
    setRack(next)
    if (next.length === 1 && kept.length > 1) {
      setToast(`The fine chain is a pendant: it holds one charm, so we kept the ${charmOf(kept[0]).name}.`)
    }
  }

  const add = (id) => {
    if (single) {
      setRack([id])
      return
    }
    const i = nextFreeSlot(rack)
    if (i === -1) {
      setToast(`All ${rack.length} spots are taken — take a charm off first.`)
      return
    }
    const next = [...rack]
    next[i] = id
    setRack(next)
  }

  const drop = (id) => {
    const i = rack.lastIndexOf(id)
    if (i === -1) return
    const next = [...rack]
    next[i] = null
    setRack(next)
  }

  const toSvg = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const box = svg.getBoundingClientRect()
    const scale = VIEW / box.width
    return { x: (e.clientX - box.left) * scale, y: (e.clientY - box.top) * scale }
  }, [])

  const grab = (e, index) => {
    e.preventDefault()
    setDrag({ index, at: toSvg(e), over: -1, trash: false })
  }

  useEffect(() => {
    if (!drag) return
    const move = (e) => {
      const at = toSvg(e)
      let over = -1
      let best = 74
      slots.forEach((p, i) => {
        const d = Math.hypot(p.x - at.x, p.y - at.y - 22)
        if (d < best) {
          best = d
          over = i
        }
      })
      const box = trashRef.current?.getBoundingClientRect()
      const trash =
        !!box &&
        e.clientX > box.left &&
        e.clientX < box.right &&
        e.clientY > box.top &&
        e.clientY < box.bottom
      setDrag((d) => (d ? { ...d, at, over: trash ? -1 : over, trash } : d))
    }
    const up = () => {
      const d = drag
      setRack((cur) => {
        const next = [...cur]
        if (d.trash) next[d.index] = null
        else if (d.over > -1 && d.over !== d.index) {
          next[d.over] = cur[d.index]
          next[d.index] = cur[d.over]
        }
        return next
      })
      setDrag(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [drag, slots, toSvg])

  // Two fingers on the bench zoom and pan the piece inside its circle; one finger
  // still drags charms. The bench itself, its frame and the bar never move.
  useEffect(() => {
    const well = wellRef.current
    const inner = svgRef.current
    let z = { s: 1, x: 0, y: 0 }
    let from = null
    const pair = (t) => ({
      d: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY),
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    })
    const apply = () => (inner.style.transform = z.s === 1 ? '' : `translate(${z.x}px, ${z.y}px) scale(${z.s})`)
    const start = (e) => {
      if (e.touches.length !== 2) return
      setDrag(null)
      const box = well.getBoundingClientRect()
      const p = pair(e.touches)
      // The point between the fingers, in unzoomed piece coordinates.
      from = { z, d: p.d, px: (p.x - box.left - z.x) / z.s, py: (p.y - box.top - z.y) / z.s }
    }
    const move = (e) => {
      if (!from || e.touches.length !== 2) return
      e.preventDefault()
      const box = well.getBoundingClientRect()
      const p = pair(e.touches)
      const s = Math.min(3, Math.max(1, (from.z.s * p.d) / from.d))
      const clamp = (v, size) => Math.min(0, Math.max(size * (1 - s), v))
      z = {
        s,
        x: clamp(p.x - box.left - from.px * s, box.width),
        y: clamp(p.y - box.top - from.py * s, box.height),
      }
      apply()
    }
    const end = (e) => {
      if (e.touches.length >= 2) return
      from = null
      if (z.s < 1.08) {
        z = { s: 1, x: 0, y: 0 }
        apply()
      }
    }
    well.addEventListener('touchstart', start, { passive: true })
    well.addEventListener('touchmove', move, { passive: false })
    well.addEventListener('touchend', end)
    well.addEventListener('touchcancel', end)
    return () => {
      well.removeEventListener('touchstart', start)
      well.removeEventListener('touchmove', move)
      well.removeEventListener('touchend', end)
      well.removeEventListener('touchcancel', end)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className={`builder${drag ? ' is-dragging' : ''}`}>
      <Masthead cart={cart} onNav={onBack} />
      <div className="bench-head">
        <button className="bench-back" onClick={onBack}>
          ← All pieces
        </button>
        <p className="bench-name">Build your own {formOf(form).name.toLowerCase()}</p>
      </div>
      <nav className="bench-forms" aria-label="Choose what you are building">
        {BUILDS.map((b) => (
          <button
            key={b.id}
            className={b.form === form ? 'is-on' : ''}
            aria-pressed={b.form === form}
            onClick={() => b.form !== form && onSwitch(placed ? { ...b, charms: rack.filter(Boolean) } : b)}
          >
            <span className="bench-form-media">
              <Piece form={b.form} chain={b.chain} charms={seedRack(b.form, b.charms, b.chain)} idle={false} />
            </span>
            {b.name.replace('Charm ', '')}
          </button>
        ))}
      </nav>
      <div className="builder-grid">
        <div className="bench">
          <Frame className="bench-frame">
            <div className="bench-well" ref={wellRef}>
              <div className="bench-zoom" ref={svgRef}>
              <Piece
                form={form}
                chain={chain}
                charms={rack}
                onGrab={grab}
                heldIndex={drag ? drag.index : -1}
                showSlots={!!drag}
                hoverSlot={drag ? drag.over : -1}
                ghost={drag ? drag.at : null}
                idle={!drag}
              />
              </div>
            </div>
          </Frame>

          <div className="bench-bar">
            <button
              className="bar-reset"
              onClick={() => setRack(seedRack(form, [], chain))}
              aria-label="Clear every charm"
              title="Clear every charm"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <p className="bar-price">
              <span>{npr(total)}</span>
              <small>
                {placed} charm{placed === 1 ? '' : 's'} · {formOf(form).length}
              </small>
            </p>
            <button
              ref={trashRef}
              className="bar-cta"
              onClick={() =>
                onAdd({ form, chain, charms: rack.filter(Boolean), assembly, total })
              }
            >
              {drag ? (
                <>
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path
                      d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13M10 11v6M14 11v6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Drop here to remove
                </>
              ) : (
                <>
                  Add <span className="cta-long">my design</span> to cart
                </>
              )}
            </button>
          </div>
          {toast && <p className="bench-toast">{toast}</p>}

          <div className="bench-extra">
            <p className="bench-on-title">
              On your {formOf(form).name.toLowerCase()}
              <span>
                {placed} of {rack.length} spot{rack.length === 1 ? '' : 's'}
              </span>
            </p>
            {placed ? (
              <ul className="bench-on">
                {CHARMS.filter((c) => countOf(c.id)).map((c) => (
                  <li key={c.id}>
                    <button onClick={() => drop(c.id)} aria-label={`Remove one ${c.name}`} title="Take one off">
                      <img src={c.img} alt="" />
                      {countOf(c.id) > 1 && <em>{countOf(c.id)}</em>}
                    </button>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="bench-on-empty">Nothing hung yet. Tap a charm on the right to start.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <section>
            <h2 className="panel-title">
              <span className="panel-num" aria-label="Step 1">1</span>
              {chains.length > 1 ? 'Choose your chain' : 'Your base'}
            </h2>
            <p className="panel-lede">
              {chains.length > 1
                ? 'Every design starts here. Pick a chain and it draws itself on the bench.'
                : 'Every charm hangs from this. It comes with the piece.'}
            </p>

            <div className={`tiles${chains.length === 1 ? ' tiles-one' : ''}`}>
              {chains.map((c) => (
                <button
                  key={c.id}
                  className={`tile${chain === c.id ? ' is-on' : ''}`}
                  onClick={() => pickChain(c.id)}
                  aria-pressed={chain === c.id}
                >
                  <img src={c.img} alt="" width="120" height="120" loading="lazy" />
                  <strong>{c.name}</strong>
                  <span className="tile-price">
                    {c.gauge} · {npr(c.price)}
                  </span>
                </button>
              ))}
            </div>
            <p className="panel-note">{chainOf(chain).note}</p>
          </section>

          <section>
            <h2 className="panel-title">
              <span className="panel-num" aria-label="Step 2">2</span>
              Pick your charms &amp; placement
            </h2>
            <p className="panel-lede">
              {single
                ? 'The fine chain is worn as a pendant with one charm. Tap a charm to hang it; tap another to swap.'
                : 'Tap a charm to hang it on the next free spot. Drag charms around the piece, or onto the bar to take one off.'}
            </p>

            <div className="sizes" role="tablist" aria-label="Charm size">
              {CHARM_SIZES.map((z) => {
                const n = rack.filter((id) => charmOf(id)?.size === z.id).length
                return (
                  <button
                    key={z.id}
                    role="tab"
                    aria-selected={size === z.id}
                    className={size === z.id ? 'is-on' : ''}
                    onClick={() => setSize(z.id)}
                  >
                    {z.name}
                    {n > 0 && <em>{n}</em>}
                  </button>
                )
              })}
            </div>
            <p className="panel-note sizes-note">{CHARM_SIZES.find((z) => z.id === size).line}</p>

            <div className="tiles tiles-charm" role="tabpanel">
              {CHARMS.filter((c) => c.size === size).map((c) => {
                const n = countOf(c.id)
                return (
                  <div key={c.id} className={`tile${n ? ' is-on' : ''}`}>
                    <button
                      className="tile-add"
                      onClick={() => add(c.id)}
                      disabled={placed >= rack.length && !single}
                      aria-label={`Add one ${c.name}`}
                    >
                      <img src={c.img} alt="" loading="lazy" />
                      {n > 0 && <em className="tile-count">{n}</em>}
                    </button>
                    <strong>{c.name}</strong>
                    <span className="tile-price">{npr(c.price)}</span>
                    <div className="step-count">
                      <button onClick={() => drop(c.id)} disabled={!n} aria-label={`Remove one ${c.name}`}>
                        −
                      </button>
                      <output aria-label={`${c.name} on the piece`}>{n}</output>
                      <button
                        onClick={() => add(c.id)}
                        disabled={placed >= rack.length && !single}
                        aria-label={`Add one ${c.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="panel-title">
              <span className="panel-num" aria-label="Step 3">3</span>
              Choose your assembly
            </h2>
            <div className="choices">
              {ASSEMBLY.map((a) => (
                <label key={a.id} className={assembly === a.id ? 'is-on' : ''}>
                  <input
                    type="radio"
                    name="assembly"
                    checked={assembly === a.id}
                    onChange={() => setAssembly(a.id)}
                  />
                  <strong>{a.name}</strong>
                  <small>{a.note}</small>
                </label>
              ))}
            </div>
          </section>

          <Flourish />

          <section className="panel-sum">
            <h2>Your piece</h2>
            <dl>
              <div>
                <dt>{formOf(form).name}</dt>
                <dd>{formOf(form).length}</dd>
              </div>
              <div>
                <dt>{chainOf(chain).name}</dt>
                <dd>{npr(chainOf(chain).price)}</dd>
              </div>
              {CHARMS.filter((c) => countOf(c.id)).map((c) => (
                <div key={c.id}>
                  <dt>
                    {c.name} × {countOf(c.id)}
                  </dt>
                  <dd>{npr(c.price * countOf(c.id))}</dd>
                </div>
              ))}
              <div className="sum-total">
                <dt>Total</dt>
                <dd>{npr(total)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
      <Footer onNav={onBack} />
    </div>
  )
}
