---
name: Maroon
description: A cream-paper jewelry counter in maroon and gold — charms hang, sway, and get dragged link by link.
colors:
  paper: "#fbf3e2"
  paper-warm: "#f5e8cf"
  paper-deep: "#efdcbc"
  maroon: "#6b1226"
  maroon-deep: "#47091a"
  maroon-soft: "#8e3245"
  gold: "#bb922c"
  gold-hi: "#ecd79b"
  gold-lo: "#8a6512"
  ink: "#2f0d18"
  ink-soft: "#7b5460"
  rose: "#b9697c"
  slot: "#8fa9dc"
typography:
  display:
    fontFamily: "Gloock, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.9rem, 6.6vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gloock, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2rem, 4.2vw, 3.3rem)"
    fontWeight: 400
    lineHeight: 1.02
  title:
    fontFamily: "Gloock, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.45rem"
    fontWeight: 400
  body:
    fontFamily: "Nunito, 'Segoe UI', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Nunito, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    letterSpacing: "0.16em"
    textTransform: uppercase
rounded:
  tile: "14px"
  panel: "16px"
  well: "20px"
  arch: "999px 999px 10px 10px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  section: "clamp(52px, 7vw, 104px)"
components:
  btn:
    backgroundColor: "linear-gradient(180deg, #8e3245, #6b1226 55%, #47091a)"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.maroon}"
    border: "1px solid rgba(107,18,38,0.35)"
  tile:
    backgroundColor: "linear-gradient(180deg, #fffaf0, {colors.paper-warm})"
    border: "1px solid rgba(107,18,38,0.18)"
    rounded: "{rounded.tile}"
  tile-selected:
    backgroundColor: "linear-gradient(180deg, #fff6df, #f6e6c2)"
    border: "1px solid {colors.maroon}"
  cameo:
    backgroundColor: "radial-gradient(circle at 50% 36%, #fffaf0, {colors.paper-warm} 58%, {colors.paper-deep})"
    rounded: "50% / 44%"
    note: "Gold hairline + maroon ring + gold outer ring. Carries cut-out charm photos on the dark band."
  slot:
    backgroundColor: "rgba(143,169,220,0.24)"
    border: "1.6px dashed {colors.slot}"
    note: "Drop target. Only visible while a charm is being dragged."
---

# Maroon — design notes

## The world

A jeweller's counter, not a storefront grid. Cream paper ground, maroon and gold,
one deep maroon band for the charm gallery. Everything that can hang, hangs: charms
swing on gold threads, the bracelet drapes, the cameos dangle from a rail. The page
is warm and ornate; the builder is quiet so the gold reads.

## Structure

- **Landing** (`src/Landing.jsx`) — hero with a live piece, chain arches, charm rail
  on the dark band, ready-made presets, footer. Every product opens the builder.
- **Builder** (`src/Builder.jsx`) — three steps in one screen: chain, charms, assembly.
  Left is a sticky bench, right is the panel.
- **Piece** (`src/Piece.jsx`) — the only renderer. Both landing and builder use it.

## The chain is geometry, not a picture

`SHAPES` holds one ellipse arc per form. `sample()` walks it, `walk()` resamples by
arc length, so links sit evenly whatever the gauge. Links alternate full ring and
edge-on ring (or flat paperclip bar), which is what makes it read as metal.
Charm slots come off the same walk, inset 13% from each end.

Charm photos are cut out (`public/charms/*.png`) and hang from a jump ring at the slot.
The translate lives on an outer `<g>` — the sway animation writes a CSS transform and
would otherwise overwrite a transform attribute.

## Interaction

- `+` drops a charm on the free slot nearest the middle of the drape, not the first index.
- Any placed charm is draggable with pointer events; nearest slot within 74 units wins,
  occupied slots swap.
- While dragging, slots appear and the cart button becomes the remove target.
- No drag library. Pointer events on the SVG, `touch-action: none` on the well.

## Rules

- Charm cut-outs keep a faint warm halo. They go on cream, or on a cameo. Never
  straight onto the maroon band.
- Product photography is real; every price, name and stock line is a placeholder and
  says so in the footer.
- One display face (Gloock) and one text face (Nunito), both self-hosted. No third.
- The blue drop-slot is the only cool colour on the page. It is an affordance, not decoration.
- Charm and chain art is swap-ready: drop a new cut-out in `public/charms/`, add a row
  to `CHARMS` in `src/data.js`, and it appears everywhere.
