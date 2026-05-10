# Supramental Gold

> The CyberChitta design system — tokens, type, primitives, and a compiled CSS bundle for a warm paper-ink reading surface.

**Status:** v0.1 · pre-stable · the live site (`www.cyberchitta.cc`) is the first consumer; `ch-ai-tanya` is the first sub-site consumer.

## What this is

A versioned, Eleventy-aware design system. It contains:

- **`tailwind.css`** — Tailwind v4 + DaisyUI build entry. Multi-source `@source` scan covers SG plus every sibling consumer repo. Compiled to:
- **`dist/styles.css`** — the canonical CSS bundle every consumer links to.
- **`colors-and-type.css`** + **`ui-kit.css`** — the source CSS imported by `tailwind.css`. Tokens (light + dark), semantic element styles, and the wiki design vocabulary used by sub-sites.
- **`eleventy/index.js`** — Eleventy plugin entry. Registers `sgHelpers` as global data.
- **`eleventy/primitives/*.ejs`** — design primitives (header, chrome, footer, sub-site-bar, status-badge, entry-title-row, provenance, outbound-action, section-title) plus unregistered samples (article-card, article-view, hero, collaborator-chip). Consumers use them via `<%- include('primitives/<name>', { ... }) %>`.
- **`eleventy/helpers.js`** — date formatters, slug lookups, inverse-collection helpers.
- **`eleventy/custom-element-renderer.js`** — exported factory for any consumer that wants to register its own HTML-tag namespace (e.g. live site's `<showcase>`/`<showtable>`). SG itself doesn't use it.
- **`assets/`** — canonical CC mark assets (SVG + LFS-tracked PNG/WebP variants).
- **`examples/index.html`** — static rendered preview, for visual reference.

## What this is NOT

- Not a styled-component library. There is no JS runtime; you bring the framework.
- Not a Tailwind plugin in the traditional sense. SG ships a *compiled* bundle that already includes Tailwind utilities (tree-shaken across listed consumers) plus DaisyUI plus the SG semantic vocabulary.
- Not a recreation of the *full* live site. Header, chrome, footer, sub-site-bar, status-badge, entry-title-row, provenance, outbound-action, and section-title are canonical. Article and hero patterns ship as samples pending convergence with live.

## Quick start (local development)

In the consumer's `package.json`:

```json
"dependencies": {
  "@cyberchitta/supramental-gold": "file:../supramental-gold"
}
```

In the consumer's `eleventy.config.js`:

```js
import path from 'path';
import { fileURLToPath } from 'url';
import ejsPlugin from '@11ty/eleventy-plugin-ejs';
import sgPlugin from '@cyberchitta/supramental-gold/eleventy';

const sgRoot = path.dirname(
  fileURLToPath(import.meta.resolve('@cyberchitta/supramental-gold/package.json')),
);
const sgEleventy = path.join(sgRoot, 'eleventy');

export default function (eleventyConfig) {
  // Expose SG's eleventy/ tree to EJS's include resolver.
  eleventyConfig.addPlugin(ejsPlugin, { views: [sgEleventy] });
  eleventyConfig.addPlugin(sgPlugin);

  // Pull SG's compiled stylesheet into the consumer's assets.
  eleventyConfig.addPassthroughCopy({
    [`${sgRoot}/dist/styles.css`]: 'assets/css/styles.css',
  });
}
```

In the consumer's base layout:

```ejs
<link rel="stylesheet" href="/assets/css/styles.css">
…
<%- include('primitives/chrome') %>
<%- include('primitives/sub-site-bar') %>
<%- include('primitives/footer') %>
```

See `CONSUMER.md` for the full integration story.

## Project shape

```
supramental-gold/
├── README.md                ← you are here
├── CLAUDE.md                ← handoff notes
├── CONSUMER.md              ← consumer integration guide
├── NOTES.md                 ← decision rationale + reconciliation log
├── TODO.md                  ← forward-looking work
├── LICENSE                  ← MIT
├── .gitattributes           ← Git LFS patterns
├── package.json             ← @cyberchitta/supramental-gold
├── tailwind.css             ← bundle source
├── colors-and-type.css      ← tokens + base type
├── ui-kit.css               ← component styles + wiki vocabulary
├── dist/
│   └── styles.css           ← compiled bundle (committed; consumers link to it)
├── assets/
│   ├── cc-260508.svg/.png   ← canonical CC mark
│   └── …
├── eleventy/
│   ├── index.js             ← plugin entry
│   ├── helpers.js           ← shared helpers
│   ├── custom-element-renderer.js
│   └── primitives/
│       ├── header.ejs       ← canonical
│       ├── chrome.ejs       ← canonical
│       ├── footer.ejs       ← canonical
│       ├── sub-site-bar.ejs
│       ├── status-badge.ejs
│       ├── entry-title-row.ejs
│       ├── provenance.ejs
│       ├── outbound-action.ejs
│       ├── section-title.ejs
│       ├── article-card.ejs ← sample
│       ├── article-view.ejs ← sample
│       ├── hero.ejs         ← sample
│       └── collaborator-chip.ejs ← sample
└── examples/
    └── index.html           ← static rendered preview
```

## Naming

The system is **Supramental Gold**. The brand it dresses is **CyberChitta**:
- *Supramental Gold* names the design system / repo / npm package.
- *CyberChitta* is the wordmark rendered on every surface that uses the system.

## License

MIT — see `LICENSE`.

---

*सत्यमेव जयते • vincit omnia veritas*
