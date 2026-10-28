---
name: Maroon
description: A boutique counter on the palest beige — maroon script for the voice, plain black type for the things you buy.
colors:
  bg: "#fbf8f2"
  bg-tint: "#f5efe4"
  bg-well: "#efe6d7"
  card: "#fffdf9"
  maroon: "#6e1f27"
  maroon-deep: "#4f131a"
  maroon-soft: "#8f4a50"
  ink: "#15110f"
  white: "#ffffff"
typography:
  display:
    fontFamily: "'Pinyon Script', 'Snell Roundhand', cursive"
    fontSize: "clamp(3.6rem, 7.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
  headline:
    fontFamily: "'Pinyon Script', 'Snell Roundhand', cursive"
    fontSize: "clamp(2.8rem, 5.4vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 1.08
  body:
    fontFamily: "'EB Garamond', Garamond, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
    fontStyle: italic
  product:
    fontFamily: "'League Spartan', Futura, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 600
    letterSpacing: "0.08em"
    textTransform: uppercase
  label:
    fontFamily: "'League Spartan', Futura, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 600
    letterSpacing: "0.16em"
    textTransform: uppercase
rounded:
  frame: "14px"
  slot: "8px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section: "clamp(60px, 8vw, 120px)"
  grid-gap: "clamp(24px, 3vw, 44px)"
components:
  button-primary:
    backgroundColor: "{colors.maroon}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "15px 34px 13px"
  button-primary-hover:
    backgroundColor: "{colors.maroon-deep}"
    textColor: "{colors.white}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.maroon}"
    rounded: "{rounded.pill}"
  product-frame:
    backgroundColor: "{colors.bg-tint}"
    rounded: "{rounded.frame}"
---

# Maroon — design notes

## The world

The palest beige ground, the brand's maroon, and the gold of the jewelry itself.
Nothing else carries colour. The page reads like a small boutique counter: frames
of warm cream holding gold pieces, a handwritten voice, a plain price tag.

## Three voices, never mixed

- **Script (Pinyon Script, maroon)** — headings and sub-headings. The brand talking.
- **Italic serif (EB Garamond italic, maroon)** — all body copy. Cursive in feel,
  legible at paragraph length. Set on `body`, so every paragraph inherits it.
- **Sans (League Spartan, black)** — product names, prices, nav, buttons, the
  promise labels. Anything you can buy or press is plain and black (buttons are
  the exception: white type on maroon).

No fourth face. All three self-hosted in `public/fonts/`.

## CTAs

Maroon fill, white uppercase sans, pill. Hover deepens to `maroon-deep`. The line
variant (maroon outline, maroon text) is for second actions only.

## Structure

- **Landing** (`src/Landing.jsx`): masthead (nav · centred logo · Shop), framed hero
  (crest, script headline, flourish, lede, CTAs, live bracelet in an oval, "Every charm
  tells a piece of the story" charm medallions), promise strip, framed Build your own
  row (5 pieces, round maroon badge), shelves: Best sellers, Styled by you band,
  Bracelets, Earrings & rings, Charms; then Shop by piece, chains, close, footer.
- **Frame** (`src/Ornament.jsx`): double hairline rule inset in a cream panel, engraved
  scroll corners mirrored into all four corners, `Crest` fleuron on top, `Flourish` rule
  under headings. Maroon line only, one 1.4 stroke. Used on hero and Build your own
  only; shelves stay unframed so the frames read as occasions.
- **Shelf**: script heading left, italic line right, hairline under; five product cards
  (square cream well, black sans name, price, maroon line "Add to cart"). On phones the
  row becomes a snap-scrolling strip.
- **Promise strip**: five line icons (`src/Icons.jsx`, 64 grid, 1.9 stroke, maroon)
  over bold maroon uppercase labels, on `card` white between hairlines.
- **Builder** (`src/Builder.jsx`): same tokens; panel headings in script, tiles use
  the product voice.
- **Piece** (`src/Piece.jsx`): the only jewelry renderer; gold stays gold.

## Swap-ready slots

Categories without photography (earrings, brooch, keyring, belts, armcuffs) show a
`photo-slot`: inset hairline frame, faded logo mark, "Photograph arriving". Drop an
`<img>` into `.cat-media` and the layout holds (4:3, 5:4 for the two live ones).

## Rules

- Background is always `bg` or `bg-tint`. No dark bands.
- Elevation is a hairline (`rgba(110,31,39,0.16)`) or one soft lift shadow, never both.
- Charm cut-outs sit on cream or white stages only.
- Drag slots in the builder are dashed maroon; no other colour enters.
- Prices, names and stock are placeholders and the footer says so.
