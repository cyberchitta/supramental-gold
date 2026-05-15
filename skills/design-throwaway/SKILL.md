---
name: design-throwaway
description: Use this skill for one-off CyberChitta design artifacts — slides, mocks, prototypes, decks, social cards, single-file demos — anything that pulls SG tokens via CDN rather than wiring the Eleventy plugin. Hands you the bundle URL, brand mark, fonts setup, and the visual + voice briefs.
user-invocable: true
---

For **one-off artifacts** that consume Supramental Gold via the public CDN bundle rather than the Eleventy plugin. Slides, mocks, prototypes, decks, social-share cards, throwaway demos. If you're working in a production consumer site (Eleventy plugin already wired), use `design-surface` instead. If you're setting up a brand-new consumer site, use `wire-consumer` first.

## Read these first

1. **`../../visual.md`** — the visual brief. Look, layout, motion, philosophy (*Less is More*), anti-patterns, iconography rules. **Read this before designing anything** — tokens alone will not keep you on-key.
2. **`../../voice.md`** — the editorial brief. House voice, attribution, surface registers, cut patterns. **Read before writing any copy** the mock includes (titles, deks, byline, body, CTAs).

These two are the keys. Everything else in `supramental-gold/` is package internals you won't need for a throwaway.

## How to pull the bundle

The compiled CSS bundle and brand mark are served via jsDelivr from a pinned tag. Pin a real tag (check `git -C /Users/ad/GitHub/supramental-gold tag --sort=-v:refname | head -1` for the latest):

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@<tag>/dist/styles.css">

<!-- Brand mark, served from the same @<tag> base -->
<img src="https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@<tag>/assets/cc-260508.svg"
     alt="CyberChitta">
```

The bundle relies on four Google Fonts being loaded. Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&family=Courier+Prime:wght@400;700&display=swap">
```

In production (the live sites) these are loaded via Tailwind/DaisyUI rather than `<link>`; for a throwaway, plain Google Fonts is fine.

## Flagged approximations

Surface these to the user when starting work where pixel fidelity matters:

- **Fonts** are Google Fonts. Licensed / optical-size builds may differ subtly from how a foundry-licensed version renders.
- **`cc-250815-v3.svg`** is the source-of-mark working file, not what ships — always pull `cc-260508.svg` / `.png` for the canonical render.
- **Showrunner avatar** (`manda-2504.webp`) is not in the SG package — bylines in mocks fall back to initials or a generic placeholder.

## Wordmark

The **CyberChitta** wordmark is **live text** styled with `.logo-text` (Courier Prime + animated gold→bronze gradient). It is **not** an SVG. Always render it as text next to the brand mark, never bake it into the mark image.

## If invoked without guidance

Ask the user:

1. What artifact? (slide, social card, OG image, single-page mock, deck, demo)
2. Light, dark, or both?
3. Does this need to include sample copy? If yes, what surface register (essay / bts / tools / research) so I can pick the right voice from `voice.md`?
4. Pixel-fidelity matters or rough-pass okay?

Then output HTML / SVG / EJS / JSX as appropriate — never inventing new tokens, never breaking the anti-patterns in `visual.md § What to avoid`.
