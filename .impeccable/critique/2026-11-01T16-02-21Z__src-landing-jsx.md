---
target: hero section
total_score: 16
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/ghost/Ghost/Boreal/maroon/src/Landing.jsx"
target_fingerprint: "sha256:f8c4d0573e16ed004e16a3fa487ee1a28f6ddc5f7d13cfc95ff5604df28c90a5"
target_path: /home/ghost/Ghost/Boreal/maroon/src/Landing.jsx
timestamp: 2026-11-01T16-02-21Z
slug: src-landing-jsx
---
# Hero critique (src/Landing.jsx)

Degraded: single-context (sub-agents not requested by user).

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Dots + name + price show which piece is on; nothing marks that the oval is clickable |
| 2 | Match system / real world | 3 | Copy is natural; "18K gold PVD" is unexplained trade jargon |
| 3 | User control and freedom | 2 | Carousel auto-advances every 5.2s; pause only on hover, none on touch or keyboard |
| 4 | Consistency and standards | 3 | Navbar "Shop" scrolls to Build your own; script used for both voice and facts |
| 5 | Error prevention | n/a | No inputs on a hero |
| 6 | Recognition over recall | 3 | Both CTAs labelled plainly; the clickable oval has no affordance |
| 7 | Flexibility and efficiency | n/a | Persuade surface |
| 8 | Aesthetic and minimalist | 2 | 8+ decorative layers compete with the headline and product |
| 9 | Error recovery | n/a | No error states |
| 10 | Help and documentation | n/a | Persuade surface |
| Total | | 16/24 | Acceptable (67%) |

Priority issues:
- [P1] Ornament overload: garland + corner scrolls + top vine + two crests + flourish + damask + double rule + floating charms. The garland sits on top of the frame's top vine and corner scrolls. Fix: drop the frame's top vine and the crest above the oval on the hero; keep garland as the top edge.
- [P1] Auto-rotating carousel with no pause control (WCAG 2.2.2) and aria-live announcing every 5.2s. Fix: pause on focus and on touch, add a pause button or stop after one cycle, drop aria-live from the auto-advance.
- [P1] Trust line set in 42px script wraps to two lines at 1440px ("Waterproof" orphaned) and is as loud as the h1. Fix: small caps sans in gold, one line, ~0.8rem, letter-spaced.
- [P2] Empty white oval is the brightest mass on the page; the bracelet's charms cluster at the bottom so the centre reads as a blank plate. Fix: tint the oval to cream/bg-well, enlarge charms or show the bracelet draped/tilted.
- [P2] Floating loose charms are ~3x the scale of the same charms on the chain. Fix: match scale or push them clearly into foreground with blur/depth.

Personas:
- Casey (mobile): nav row cut mid-word ("EA…") with no scroll cue; carousel dots have 22px targets; product changes while reading.
- Jordan (first-timer): "Shop" button lands on a builder, not a shop; "PVD" unexplained.
- Sam (screen reader): price/name re-announced every 5.2s; carousel cannot be paused by keyboard.
