# Claude Code — Handoff Notes

This repo (`supramental-gold`) is the design system for **CyberChitta**.
It is the source of truth for tokens, primitives, the compiled CSS
bundle, and brand assets.

Consumers depend on SG via a `github:cyberchitta/supramental-gold#<tag>`
dep pin in their `package.json`. A small `_data/sg.js` on each consumer
derives jsDelivr URLs from that pin — see `README.md`.

For the *craft briefs* — house voice and editorial discipline in `voice.md`,
look/layout/anti-patterns/iconography in `visual.md`. This file (CLAUDE.md)
is for production-wiring handoff only; design and editorial decisions live in
`voice.md` / `visual.md`, and decision rationale lives in `NOTES.md`.

## Deployments

| Site | URL | Where it builds |
|---|---|---|
| Main site | https://www.cyberchitta.cc | Netlify, from `main` |
| ch-ai-tanya | https://ch-ai-tanya.cyberchitta.cc | GitHub Pages, from `main` |

(A staging context for the main site exists on Netlify; its URL is
deliberately not listed here because this file is checked into a
public repo.)

---

## What's in the package

| Path | Notes |
|---|---|
| `package.json` | `@cyberchitta/supramental-gold`. `exports` cover plugin entry, primitives, helpers, and CSS files. |
| `tailwind.css` | Bundle build entry. Multi-source `@source` scan covers SG + every sibling consumer repo. |
| `dist/styles.css` | Compiled bundle (~118KB minified). Tracked in git; served via jsDelivr to consumers. |
| `colors-and-type.css` | Plain CSS custom properties. Light + dark tokens. |
| `ui-kit.css` | Component styles + wiki design vocabulary. |
| `eleventy/index.js` | Eleventy plugin — registers `sgHelpers` global. |
| `eleventy/helpers.js` | `formatDate`, `parentConcepts`, `findingBySlug`, `conceptBySlug`, `byTitle`, `byDateDesc`, `yearMonth`. |
| `eleventy/section-title-transform.js` | Generic factory for rewriting `<h2>` titles into `.group-header` shape + classing the following `<ul>`. |
| `eleventy/custom-element-renderer.js` | Generic factory; exported, not auto-registered. For consumers wanting HTML-tag-style authoring in their own namespaces. |
| `eleventy/primitives/header.ejs` | Accepts `brandLogoUrl` (consumer passes the jsDelivr URL from `sg.js`). |
| `eleventy/primitives/chrome.ejs` | Forwards `brandLogoUrl` to `header`. Hardcodes `mainSiteUrl: https://www.cyberchitta.cc` for sub-sites. |
| `eleventy/primitives/footer.ejs` | Accepts `mainSiteUrl`. |
| `eleventy/primitives/sub-site-bar.ejs`, `status-badge.ejs`, `entry-title-row.ejs`, `provenance.ejs`, `outbound-action.ejs`, `section-title.ejs` | Wiki design vocabulary, used by `ch-ai-tanya`. |
| `eleventy/primitives/article-card.ejs`, `article-view.ejs`, `hero.ejs`, `collaborator-chip.ejs` | Sample — design vocabulary in `cc-*` paradigm; not wired into any production consumer. |
| `assets/cc-260508.{svg,png}` | Canonical CC mark. Plain blobs (not LFS). Served via jsDelivr. |
| `assets/cc-250815-v3.svg` | Source-of-mark working file; not used at runtime. |
| `assets/logo.svg` | CSS-themable mark — picks up palette custom props from the host page. Used by `examples/index.html`; not served via jsDelivr. |
| `examples/index.html` | Static rendered preview, not for production. |

---

## Brand-asset routing

- **CSS bundle** + **brand mark** (`cc-260508.svg`, `cc-260508.png`)
  served from jsDelivr at `@<tag>`. One canonical URL per asset across
  all consumers → real cross-site cache hits.
- **Per-article featured images** stay on each consumer's own domain
  (they're the consumer's content, not brand).
- Where a consumer uses the CC mark as a featured image (e.g. live's
  `witness-ai`, `supramental-ai`), it references the jsDelivr URL in
  the consumer's `featuredImages` entry. The consumer's `base.ejs`
  needs an `absUrl` guard so OG/Twitter meta tags don't double-prefix
  absolute URLs.
- **Legacy redirects** in live's `netlify.toml` 302 the old
  `/assets/images/shared/cc-260508.{svg,png}` paths to jsDelivr to
  preserve pre-migration social-card OG references. Transitional;
  not part of the live SG version-pin chain.

---

## Single-source SG version pin

Each consumer's `package.json` carries the version in one place:

```jsonc
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#<vX.Y.Z>"
```

`_data/sg.js` in the consumer parses the `#tag` (via `.split('#').pop()`)
and builds jsDelivr URLs (CSS bundle, brand SVG, brand PNG). Templates
reference `<%= sg.cssBundleUrl %>`, `<%= sg.logoSvgUrl %>`, and pass
`brandLogoUrl: sg.logoSvgUrl` to `header` / `chrome`.

Bumping SG is a single edit to the dep ref + `bun install` + commit
(both `package.json` and `bun.lock`). CI uses `--frozen-lockfile` so
the two must move together.

---

## Wiring the live site (recap)

Live's data layer:
- `_data/sg.js` — derives SG URLs from `package.json` dep ref.
- `_data/site.js` — hand-edited config (URL, title, authors,
  featuredImages, externalImages) referencing `sg.*` for brand URLs.
  Imports auto-generated `siteIndex.json` for `images` + `articles`.
- `_data/siteIndex.json` — written by `build/index-site-content.js`
  (walks `src/assets/`, gets dimensions); reading times updated by
  `build/update-reading-times.js`.

`src/_includes/layouts/base.ejs`:
- Favicon `<link>` uses `<%= sg.logoSvgUrl %>`.
- Stylesheet `<link>` uses `<%= sg.cssBundleUrl %>`.
- Header include passes `brandLogoUrl: sg.logoSvgUrl`.
- OG/Twitter meta uses `absUrl(...)` to avoid double-prefixing
  absolute URLs.

`eleventy.config.js`:
- Registers SG plugin, exposes SG's `eleventy/` to EJS includes.
- Passes the static `site` config explicitly into the
  custom-element renderer's `dataContext` (the JSON-dir loader
  can't read a `.js` data file).

Live also retains a CSR footer (uses its own `build/ejs-precompiler.js`
and `template-manager.js` for client-side hydration). SG's
`primitives/footer.ejs` is the sub-site SSR variant of the same body;
the two are kept in sync.

---

## Things to verify on first checkout

- `colors-and-type.css` declares all expected vars (light + dark).
- `bun install && bun run build:css` produces `dist/styles.css`
  without warnings (sibling consumer repos must exist for the
  multi-source scan — see `tailwind.css` for the listed paths).
- `examples/index.html` opens in a browser and looks like CyberChitta.
- `ch-ai-tanya` builds cleanly against this checkout (use it as a
  reference consumer).

---

## Pointers

- `voice.md` — house voice, attribution, surface registers,
  editorial discipline. Read before drafting or copyediting.
- `visual.md` — visual brief (look, layout, motion, anti-patterns,
  iconography). Read before designing.
- `SKILL.md` — AI-skill router. Delegates to one of five children under
  `skills/`: `design-throwaway`, `design-surface`, `wire-consumer`,
  `draft-article`, `copyedit`.
- `README.md` — consumer integration guide, release workflow,
  dev-testing options.
- `NOTES.md` — decision log.
- `TODO.md` — forward-looking work.
