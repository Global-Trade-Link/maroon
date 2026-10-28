import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flourish, Frame } from './Ornament.jsx'
import Piece, { VIEW, geometry } from './Piece.jsx'
import { ASSEMBLY, CHAINS, CHARMS, formOf, nextFreeSlot, npr, priceOf, seedRack } from './data.js'

const emptyRack = (formId) => Array(formOf(formId).slots).fill(null)

export default function Builder({ start, onBack, onAdd }) {
  const [form, setForm] = useState(start.form)
  const [chain, setChain] = useState(start.chain)
  const [assembly, setAssembly] = useState('exact')
  const [rack, setRack] = useState(() => seedRack(start.form, start.charms))
  const [drag, setDrag] = useState(null)
  const [toast, setToast] = useState('')

  const svgRef = useRef(null)
  const trashRef = useRef(null)
  const slots = useMemo(() => geometry(form, chain).slots, [form, chain])

  const total = priceOf(chain, rack)
  const placed = rack.filter(Boolean).length

  const swapForm = (next) => {
    const moved = emptyRack(next)
    rack.filter(Boolean).forEach((id, i) => {
      if (i < moved.length) moved[i] = id
    })
    setForm(next)
    setRack(moved)
  }

  const countOf = (id) => rack.filter((x) => x === id).length

  const add = (id) => {
    const i = nextFreeSlot(rack)
    if (i === -1) {
      setToast(`A ${formOf(form).name.toLowerCase()} holds ${rack.length} charms — take one off first.`)
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

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className={`builder${drag ? ' is-dragging' : ''}`}>
      <header className="masthead">
        <button className="bench-back" onClick={onBack}>
          ← All pieces
        </button>
        <a className="wordmark" href="#top" onClick={onBack} aria-label="Maroon, back to the shop">
          <img src="/logo-mark.png" alt="" width="104" height="80" />
        </a>
      </header>
      <div className="builder-grid">
        <div className="bench">
          <Frame className="bench-frame">
            <div className="bench-well" ref={svgRef}>
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
          </Frame>

          <div className="bench-bar">
            <button
              className="bar-reset"
              onClick={() => setRack(emptyRack(form))}
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
                'Add my design to cart'
              )}
            </button>
          </div>
          {toast && <p className="bench-toast">{toast}</p>}
        </div>

        <div className="panel">
          <section>
            <h2 className="panel-title">
              <span className="panel-num" aria-label="Step 1">1</span>
              Choose your chain
            </h2>
            <p className="panel-lede">
              Every design starts here. Pick a form, pick a chain, and it draws itself on the bench.
            </p>

            <div className="seg" role="group" aria-label="Form">
              {['bracelet', 'necklace'].map((id) => (
                <button
                  key={id}
                  className={form === id ? 'is-on' : ''}
                  onClick={() => swapForm(id)}
                  aria-pressed={form === id}
                >
                  {formOf(id).name}
                  <small>{formOf(id).length}</small>
                </button>
              ))}
            </div>

            <div className="tiles">
              {CHAINS.map((c) => (
                <button
                  key={c.id}
                  className={`tile${chain === c.id ? ' is-on' : ''}`}
                  onClick={() => setChain(c.id)}
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
            <p className="panel-note">{CHAINS.find((c) => c.id === chain).note}</p>
          </section>

          <section>
            <h2 className="panel-title">
              <span className="panel-num" aria-label="Step 2">2</span>
              Pick your charms &amp; placement
            </h2>
            <p className="panel-lede">
              Charms land on the next free link. Drag any of them around the chain — or onto the
              bar below to take one off.
            </p>

            <div className="tiles tiles-charm">
              {CHARMS.map((c) => {
                const n = countOf(c.id)
                return (
                  <div key={c.id} className={`tile${n ? ' is-on' : ''}`}>
                    <img src={c.img} alt="" height="96" loading="lazy" />
                    <strong>{c.name}</strong>
                    <span className="tile-price">{npr(c.price)}</span>
                    <div className="step-count">
                      <button onClick={() => drop(c.id)} disabled={!n} aria-label={`Remove one ${c.name}`}>
                        −
                      </button>
                      <output aria-label={`${c.name} on the piece`}>{n}</output>
                      <button
                        onClick={() => add(c.id)}
                        disabled={placed >= rack.length}
                        aria-label={`Add one ${c.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="panel-note">
              Three charms are cast and in the studio right now. The rest of the season lands in
              October.
            </p>
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
                <dt>{CHAINS.find((c) => c.id === chain).name}</dt>
                <dd>{npr(CHAINS.find((c) => c.id === chain).price)}</dd>
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
            <p className="panel-note">Demo pricing. Nothing here charges a card.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
