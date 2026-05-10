# Supramental Gold

> The CyberChitta design system — tokens, type, and components for a warm paper-ink reading surface.

**Status:** v0.1 · pre-stable · the live site (`www.cyberchitta.cc`) is the first consumer.

## What this is

A versioned, framework-light design system that powers the look of CyberChitta and any subsite that pulls from it. It contains:

- **`colors-and-type.css`** — CSS custom properties (light + dark) and semantic element styles. No build step required.
- **`ui-kit.css`** — component styles that extend the tokens (header, hero, article rows, footer, etc.).
- **`assets/`** — the wheel/lotus/pad logo and hero placeholder.
- **`_includes/*.ejs`** — Eleventy/EJS partials matching the live site's component shapes.
- **`examples/index.html`** — a static rendered preview of the kit, for visual reference.

## What this is NOT

- Not a styled-component library. There is no JS runtime; you bring the framework.
- Not a Tailwind plugin (yet). Tokens are plain CSS vars; if you want them in `@theme { … }` for Tailwind v4, see `CLAUDE.md`.
- Not a recreation of the *full* live site. Header, hero, section title, article card, article view, byline, and footer are covered. Bespoke article body components (charts, dropdowns, etc.) are not.

## Quick start

```html
<link rel="stylesheet" href="path/to/supramental-gold/colors-and-type.css">
<link rel="stylesheet" href="path/to/supramental-gold/ui-kit.css">
```

In an Eleventy site:

```html
<%- include('header') %>
<%- include('hero', { src: '/img/hero.webp', attribution: {…} }) %>
<%- include('article-card', { article: {…} }) %>
<%- include('footer') %>
```

See `CONSUMER.md` for the full integration story (how to wire a main site + N gh-pages subsites to the same source of truth).

## Project shape

```
supramental-gold/
├── README.md                ← you are here
├── CLAUDE.md                ← handoff notes for Claude Code
├── CONSUMER.md              ← how downstream sites pull this in
├── CHANGELOG.md
├── LICENSE                  ← MIT
├── .gitignore
├── colors-and-type.css      ← tokens + base type
├── ui-kit.css               ← component styles
├── assets/
│   ├── logo.svg             ← wheel/lotus/pad mark
│   └── hero.webp            ← placeholder hero (DeepMind "Visualising AI")
├── _includes/               ← Eleventy/EJS partials
│   ├── header.ejs
│   ├── hero.ejs
│   ├── section-title.ejs
│   ├── article-card.ejs
│   ├── article-view.ejs
│   ├── footer.ejs
│   └── collaborator-chip.ejs
└── examples/
    └── index.html           ← static rendered preview
```

## Naming

The system is **Supramental Gold**. The brand it dresses is **CyberChitta**. Don't confuse the two:
- *Supramental Gold* names the design system / repo / npm package.
- *CyberChitta* is the wordmark rendered on every surface that uses the system.

## License

MIT — see `LICENSE`.

---

*सत्यमेव जयते • vincit omnia veritas*
