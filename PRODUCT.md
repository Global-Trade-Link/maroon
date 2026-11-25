# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

This repository contains the React + Vite storefront and owner studio only. The Rust/Axum API, SQLx migrations, PostgreSQL configuration, tests and backend deployment files live in the separate `D:\Work\maroon-backend` Git repository. Catalog, content, sessions and orders live on the server; uploaded photographs and private payment proofs use persistent disk storage. The browser keeps the bag, pending checkout and latest guest order access token.

## Users

Shoppers buying gold-tone jewelry for themselves or as gifts, mostly on phones, who want a piece that feels personal. Their job: pick a bracelet or necklace and dress it with charms that mean something to them, see it before buying, know the price as they go, and place a guest order. A single store owner manages the catalog, storefront content, checkout settings and manual payment/fulfillment review.

## Product Purpose

An online shop for a jewelry seller whose core products are bracelets and necklaces. The differentiator is an interactive customizer: choose a base, add charms, see the piece update live, get a running price. Success: a shopper finishes a custom piece, places a guest order and submits payment details for the owner to verify before dispatch.

## Positioning

A charm-led storefront alongside ready-made jewelry. Custom pieces combine a base and charms arranged by the shopper, priced transparently. The customizer remains the hero.

## Operating Context

Landing page, piece-specific customizers, editable bag, guest checkout, payment submission, confirmation and policy surfaces. The single-owner studio runs on admin.maroon.com.np (admin.localhost locally); the storefront runs on maroon.com.np. Legacy /admin links redirect to the admin subdomain. The owner maintains catalog/content, reviews payments and coordinates delivery manually. Customers receive confirmation and delivery updates by email instead of using an account or order-status page. Unfinished payments remain reachable through a persistent reminder, header navigation and bag/checkout recovery.

## Capabilities and Constraints

- Products (Oct 2026 range): charm necklace, charm bracelet, charm earrings, charm brooch, charm keyring, belts, armcuffs. Each charm piece has its own builder: bracelet, necklace, charm hoops, keyring, brooch. Belts, armcuffs and handmade earrings are photographed shelves.
- Customizer (confirmed scope): one page per piece (no form toggle), pick chain/base, charms grouped in four sizes (small, medium, big, bulky), add/remove/reorder charms on a live preview, running price, add-to-cart summary.
- Owner studio: manage products, bases/chains, charms, categories and charm types; edit homepage copy/photography, contact details and policies; configure the merchant QR, delivery areas, flat charge and checkout availability.
- Guest checkout: required email/contact/delivery details, server-calculated totals, saved composition snapshots and private payment submission. Submission redirects to confirmation. Retrying recovers the same order. Custom designs can be edited from the bag while preserving quantity, exact nullable layout, repeated charms and assembly choice.
- Customer email: durable messages for payment acknowledgement, owner-confirmed payment, shipping, rejection and cancellation. Local mode saves private previews; inbox delivery uses server-side Resend credentials and a verified sender. Admin sees queue/delivery status.
- Payment: static Fonepay merchant QR with exact amount and order reference. Submission means awaiting review; only the owner confirms receipt after checking the merchant account independently. Fulfillment and courier references are updated manually.
- Outside current scope: automatic inventory deduction, courier APIs, automatic Fonepay verification, analytics and customer accounts. Engraving, sizing and gift packaging remain unconfirmed.
- Brand: Maroon (from the supplied logo: cream ground, maroon wordmark, wreath monogram).
- Visual brief (client notes, Oct 2026): lightest beige background; product names simple and black; sub-headings and body maroon and cursive; CTAs maroon with white text.

## Brand Commitments

- Client-pinned palette and type voices (see Capabilities). Promise strip: fast dispatch and express delivery, waterproof, hypoallergenic, 18K gold PVD plated, safe payments.
- Wordmark and monogram supplied by the user (assets/logo.jpg).

## Evidence on Hand

Real product photography supplied for three charms (red mushroom, evil palm, dance shoe) and three chains (2.0 mm fine cable, 4.14 mm rolo, 9.9 mm paperclip). No testimonials, press, or pricing supplied. Demo prices and product names are illustrative placeholders and must not be presented as real. Remaining charm photography arrives later from the user.

The seed catalog retains illustrative prices and names; customer-facing sample/test notices are removed at the user's request. Checkout starts disabled in fresh databases. The owner must approve the catalog, real merchant settings, contact details, delivery rules and policies before accepting real orders. Local testing uses a non-scannable QR placeholder and email previews.

## Product Principles

1. The customizer is the hero: every path on the site leads to it.
2. Price is always visible while composing; no surprises at checkout.
3. Abundance over restraint: show range, layering, and charm variety generously.
4. Swap-ready: every visual stand-in must be replaceable by a real photo without layout changes.
