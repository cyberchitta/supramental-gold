# Changelog

## Unreleased

### Eleventy plugin + bundle build (2026-05-10)

SG becomes a proper npm-installable package with an Eleventy plugin
and a compiled CSS bundle. Sub-sites (and eventually the live site)
consume both via the package.

Added:
- `package.json` (`@cyberchitta/supramental-gold` v0.1.0) with `exports`
  for the plugin entry, primitives, helpers, and CSS files.
- `eleventy/index.js` — `addPlugin(sgPlugin, {siteData})` registers a
  custom-element transform that resolves SG primitive tags.
- `eleventy/custom-element-renderer.js` — vendored renderer (supports
  paired and self-closing tag forms; default no-op content parser).
- `eleventy/helpers.js` — `formatDate`, `parentConcepts`, `findingBySlug`,
  `conceptBySlug`, `byTitle`, `byDateDesc`, `yearMonth`. Exposed as global
  data `sgHelpers` and as named exports.
- `eleventy/primitives/` — invocable design vocabulary; see registry below.
- `tailwind.css` — Tailwind v4 + DaisyUI build entry; multi-source scan
  covers SG itself + sibling consumer repos (`ch-ai-tanya`,
  `www.cyberchitta.cc`).
- `dist/styles.css` — built bundle, ~117KB minified.
- Wiki-vocabulary classes appended to `ui-kit.css` (status-badge,
  sub-site-bar, provenance, outbound-action, parent-link, finding-list,
  concept-entry, backlink-list, density tweaks, etc.) so they ship in
  the bundle for any consumer.

### Primitive ↔ live-site partial mapping

| Tag | Template | Live-site analog | Status |
|---|---|---|---|
| `<cc-header>` | `header.ejs` | `partials/hdr-nav.ejs` | Canonical (matches live; Tailwind paradigm) |
| `<cc-footer>` | `footer.ejs` | `partials/footer.ejs` | Canonical (matches live; Tailwind paradigm) |
| `<cc-chrome>` | `chrome.ejs` | none (sub-sites only) | Canonical |
| `<sub-site-bar>` | `sub-site-bar.ejs` | none (sub-sites only) | Canonical |
| `<status-badge>` | `status-badge.ejs` | none yet | Canonical |
| `<entry-title-row>` | `entry-title-row.ejs` | none yet | Canonical |
| `<provenance>` | `provenance.ejs` | inline byline in `layouts/article.ejs` | Canonical for sub-sites; live equivalent is inline |
| `<outbound-action>` | `outbound-action.ejs` | none yet | Canonical |
| `<section-title>` | `section-title.ejs` | none (just `.group-header` H2) | Canonical |
| *(unregistered)* | `article-card.ejs` | `_includes/showcase/article-list.ejs` | **Sample only.** Uses `cc-*` paradigm; live uses showcase-element table-driven rendering. Convergence is v1.0 work. |
| *(unregistered)* | `article-view.ejs` | `layouts/article.ejs` | **Sample only.** Uses `cc-*` paradigm. |
| *(unregistered)* | `hero.ejs` | inline `<figure>` in `layouts/base.ejs` | **Sample only.** Live should ideally extract its inline hero into a `<hero>` primitive. |
| *(unregistered)* | `collaborator-chip.ejs` | none directly | **Sample only.** Wraps `@handle` as `.cc-handle`; live renders bylines inline. |

The four "Sample only" entries are documented design vocabulary but not
yet invocable as tags. Promoting them to canonical primitives requires
reconciling the `cc-*` semantic-class paradigm against live's Tailwind
utility paradigm — that's the v1.0 reconciliation work CLAUDE.md
already flagged (known imperfection #5).

### Reconciled with live cyberchitta.cc (2026-05-10)

Compared `colors-and-type.css` and `ui-kit.css` against
`www.cyberchitta.cc/src/assets/css/tailwind.css`. Token values match
exactly; the structural drift below was added to the repo (live wins
pre-v1.0).

Added to `colors-and-type.css`:
- `.byline-info` (showrunner dropdown anchor).
- Mobile sizing (`@media (max-width: 767px)`) for `.article-content`
  and `.article-content p`.
- `.article-content :is(h1,h2,h3,h4):focus-visible` + `@keyframes
  focus-fade`.
- `.article-content` rules for `pre code`, `img`, `table`/`th`/`td`,
  `p:empty`, `.footnotes`.
- `.full-width` / `.full-width-inner` layout utilities.
- `.icon`, `.icon-github`, `.icon-twitter`, `.icon-rss` mask-image
  components.

Deliberate divergences kept (documented inline):
- `.logo-text` includes `font-family: var(--font-typewriter)`. Live
  applies `font-typewriter` as a Tailwind utility on the element.
  We bake it in so `.logo-text` works standalone outside Tailwind.
- `:root, [data-theme="light"]` block (live uses `[data-theme='light']`
  only). The `:root` clause is for non-Tailwind consumers.

Deferred decisions (not drift — open architectural choices):
- **Class-naming paradigm.** Repo partials use `cc-*` semantic
  classes (defined in `ui-kit.css`); live partials use Tailwind
  utilities inline. Per CLAUDE.md known-imperfection #5, the
  rename/alias decision is the showrunner's call when adopting the
  kit in the live site. No changes here.
- **Footer project links.** Repo `footer.ejs` loops over a
  `projects` array; live `partials/footer.ejs` does not. Useful for
  subsite consumers, so kept.
- **`@layer` precedence.** Live uses `@layer utilities`/`components`
  to win over Tailwind/DaisyUI. Repo emits plain rules. Tailwind
  consumers may need to wrap on import; tracked for v1.0 integration.

## v0.1.0 — initial export

- Tokens (light + dark) lifted from live cyberchitta.cc tailwind.css.
- Component styles (header, hero, article row, byline, footer) from live site.
- Eleventy/EJS partials converted from React prototypes (best-effort — see CLAUDE.md).
- Logo + hero assets shipped.
- Pre-stable. The live site remains the ground truth until v1.0.
