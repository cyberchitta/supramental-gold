# Notes

Decision rationale and reconciliation log. For forward-looking work,
see `TODO.md`. For per-release entries, a real changelog will start at
v1.0.

## Unreleased

### Section-title transform factory (2026-05-10, late)

Added `createSectionTitleTransform` (eleventy/section-title-transform.js,
exported from `@cyberchitta/supramental-gold/eleventy`). Generic factory
in the same shape as `createCustomElementRenderer`: consumers pass a
rule list keyed by H2 text and get back an Eleventy-compatible
transform function.

Each rule rewrites a recognised `<h2>Name</h2>` into the SG section-title
shape (`<h2 class="group-header">name</h2>`) and optionally classes the
immediately-following `<ul>` with a configurable list class. Idempotent
on re-runs.

Wired into `ch-ai-tanya/eleventy.config.js` with the wiki-canonical H2
list (Concepts, Sources, Cross-references, Cited in, Threads →
`.backlink-list`; Findings → `.finding-list`; Interpretive tensions,
Definition, What-this-concept-is-not, Scope note → no list class;
Instantiating findings → `.backlink-list`). Resolves the
HANDOFF.md "section-name preprocessor" item.

The factory is consumer-agnostic — the live site can migrate
`wrap-credits.js` over once we add wrap-style support (currently the
factory only injects a class on the title and an optional class on a
following list; wrapping a section in a div is the next iteration).

### Primitives are include-only (2026-05-10, late)

After a first pass that registered primitives as custom-element tags
(`<sub-site-bar />` etc.) via an auto-loaded transform, the design
collapsed to plain EJS includes:

- Consumers expose `eleventy/` to EJS via `views: [sgEleventy]` (passed
  through to `@11ty/eleventy-plugin-ejs`).
- Primitives are called as `<%- include('primitives/<name>', { ... }) %>`.
- The directory structure (`primitives/`) becomes the namespace,
  preventing collision with consumer-local `_includes/`.
- The plugin's auto-registered tag transform was removed. Nothing in SG
  needs it anymore. `createCustomElementRenderer` stays as a named
  export for any consumer that wants HTML-tag-style authoring for its
  own namespaces (e.g. the live site's `<showcase>`/`<showtable>`).

Why: EJS includes are simpler, faster (no regex pass), and idiomatic
inside layouts. The tag mechanism's only justification is markdown-body
authoring; nothing currently needs that.

Primitives also got a parameter cull at the same time: brand URLs in
`header`/`chrome`/`footer` are hardcoded (they're brand identity, not
configuration), and `sub-site-bar` reads `site.title` / `site.tagline`
straight from Eleventy globals.

### Eleventy plugin + bundle build (2026-05-10)

SG becomes a proper npm-installable package with an Eleventy plugin
and a compiled CSS bundle. Sub-sites (and eventually the live site)
consume both via the package.

Added:
- `package.json` (`@cyberchitta/supramental-gold` v0.1.0) with `exports`
  for the plugin entry, primitives, helpers, and CSS files.
- `eleventy/index.js` — `addPlugin(sgPlugin)` registers `sgHelpers` as
  global data; nothing else.
- `eleventy/custom-element-renderer.js` — generic renderer factory
  (supports paired and self-closing tag forms; default no-op content
  parser). Exported but not auto-registered.
- `eleventy/helpers.js` — `formatDate`, `parentConcepts`, `findingBySlug`,
  `conceptBySlug`, `byTitle`, `byDateDesc`, `yearMonth`. Exposed as global
  data `sgHelpers` and as named exports.
- `eleventy/primitives/` — design vocabulary as EJS partials, callable
  via `<%- include('primitives/<name>') %>`.
- `tailwind.css` — Tailwind v4 + DaisyUI build entry; multi-source scan
  covers SG itself + sibling consumer repos (`ch-ai-tanya`,
  `www.cyberchitta.cc`).
- `dist/styles.css` — built bundle, ~117KB minified.
- Wiki-vocabulary classes appended to `ui-kit.css` (status-badge,
  sub-site-bar, provenance, outbound-action, parent-link, finding-list,
  concept-entry, backlink-list, density tweaks, etc.) so they ship in
  the bundle for any consumer.
- Brand assets copied from live: `cc-260508.svg`, `cc-260508.png`,
  `cc-250815-v3.svg` (and unstaged `manda-2504.webp`,
  `llm-lot-2504.webp`). Tracked via Git LFS — see `.gitattributes`.

### Primitive ↔ live-site partial mapping

Primitives in `eleventy/primitives/` are EJS partials. Consumers call
them with `<%- include('primitives/<name>', { ... }) %>` after
configuring `views: [sgEleventy]` on the EJS plugin.

| Template | Live-site analog | Status |
|---|---|---|
| `header.ejs` | `partials/hdr-nav.ejs` | Canonical — Tailwind utility paradigm; matches live |
| `footer.ejs` | `partials/footer.ejs` | Canonical — Tailwind utility paradigm; matches live |
| `chrome.ejs` | none (sub-sites only) | Canonical |
| `sub-site-bar.ejs` | none (sub-sites only) | Canonical; reads `site.title` / `site.tagline` from Eleventy globals |
| `status-badge.ejs` | none yet | Canonical |
| `entry-title-row.ejs` | none yet | Canonical |
| `provenance.ejs` | inline byline in `layouts/article.ejs` | Canonical for sub-sites; live equivalent is inline |
| `outbound-action.ejs` | none yet | Canonical |
| `section-title.ejs` | none (just `.group-header` H2) | Canonical |
| `article-card.ejs` | `_includes/showcase/article-list.ejs` | **Sample only.** Uses `cc-*` paradigm; live uses showcase-element table-driven rendering. Convergence is v1.0 work. |
| `article-view.ejs` | `layouts/article.ejs` | **Sample only.** Uses `cc-*` paradigm. |
| `hero.ejs` | inline `<figure>` in `layouts/base.ejs` | **Sample only.** Live should ideally extract its inline hero into a primitive. |
| `collaborator-chip.ejs` | none directly | **Sample only.** Wraps `@handle` as `.cc-handle`; live renders bylines inline. |

The four "Sample only" entries are documented design vocabulary, not
yet wired into any production consumer. Promoting them requires
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
