# Notes

Decision rationale and reconciliation log. For forward-looking work,
see `TODO.md`.

## Brief vs. notes vs. handoff

The design *brief* — voice, tone, philosophy, anti-patterns, iconography rules —
lives in `BRAND.md`, not here. This file is for decision *rationale* (why a
choice was made, what alternatives were considered, where the bodies are
buried). When a `BRAND.md` rule has a non-obvious "why," document it here and
cross-link.

## Brand assets canonical at SG/jsDelivr

OG/Twitter scrapers accept absolute URLs from any host; there's no
same-origin protocol constraint. The reason per-article featured
images stay on each consumer's domain is that they're the consumer's
content, not the design system's. The brand mark IS the design
system's, so it canonicalizes at SG.

- The brand SVG and PNG live in SG's `assets/`, served via jsDelivr
  at `@<tag>`.
- Consumers don't keep local copies of the CC mark.
- Where a consumer uses the brand mark as an article hero, the
  featured-image URL is the absolute jsDelivr URL. The consumer's
  `base.ejs` uses an `absUrl` helper to guard OG/Twitter meta
  emission against double-prefixing.
- Transitional safety net: live's `netlify.toml` 302s old
  `/assets/images/shared/cc-260508.{svg,png}` paths to jsDelivr so
  pre-migration social-card cache references keep working until the
  platforms re-scrape.

## Single-source version pin via `_data/sg.js`

The SG version lives in exactly one place per consumer: the
`@cyberchitta/supramental-gold` dep ref in `package.json`. A small
`_data/sg.js` parses the `#tag` and exports computed jsDelivr URLs
(CSS bundle, brand SVG, brand PNG). Templates read `sg.cssBundleUrl`,
`sg.logoSvgUrl`, `sg.logoPngUrl`, and pass `brandLogoUrl: sg.logoSvgUrl`
into `chrome` / `header`.

Bumping SG is a one-line edit to the dep ref + `bun install`. CI uses
`--frozen-lockfile`, so the `bun.lock` update must commit with the
`package.json` change.

The alternative — hardcoding jsDelivr URLs in templates alongside the
dep ref — was the dual-pin bug we used to have: forgetting to bump
one would diverge runtime CSS from build-time primitives.

## `header.ejs` / `chrome.ejs` accept `brandLogoUrl`

Non-breaking optional parameter. When passed, becomes the logo
`<img src>`. When omitted, falls back to the
`${mainSiteUrl}/assets/images/shared/cc-260508.svg` path that pre-dates
the jsDelivr canonicalization, so old callers continue to render
something. New callers should always pass `brandLogoUrl: sg.logoSvgUrl`.

## Failure modes are loud

- `sg.js` requires a `#tag` (or branch / commit SHA) on the dep ref
  to derive a version. A `file:` dep emits malformed jsDelivr URLs
  (`@file:../...`) — intentional fail-loud, easy to spot in HTML.
- The `imageMetadata` lookup in live's `base.ejs` (used to render
  `width`/`height` on the `<img>` for CLS) is not defensive — if a
  featured-image URL has no matching `images[]` entry, the build
  crashes. `externalImages` in `site.js` seeds the brand-URL entries
  for this lookup.

## Primitives are include-only

Primitives are plain EJS partials, called via
`<%- include('primitives/<name>', { ... }) %>` after the consumer
exposes `eleventy/` to EJS via `views: [sgEleventy]`. The directory
structure becomes the namespace, preventing collision with
consumer-local `_includes/`.

An earlier iteration registered primitives as custom-element tags
(`<sub-site-bar />` etc.) via an auto-loaded transform. The tag
mechanism's only justification is markdown-body authoring, which
nothing currently needs. EJS includes are simpler, faster (no regex
pass), and idiomatic inside layouts.

`createCustomElementRenderer` stays as a named export for any
consumer that wants HTML-tag-style authoring for its own namespaces
(e.g. the live site's `<showcase>`/`<showtable>`).

## Section-title transform factory

`createSectionTitleTransform` (`eleventy/section-title-transform.js`,
exported from `@cyberchitta/supramental-gold/eleventy`) is a generic
factory in the same shape as `createCustomElementRenderer`: consumers
pass a rule list keyed by H2 text and get back an
Eleventy-compatible transform function.

Each rule rewrites a recognised `<h2>Name</h2>` into the SG
section-title shape (`<h2 class="group-header">name</h2>`) and
optionally classes the immediately-following `<ul>` with a
configurable list class. Idempotent on re-runs.

Wired into `ch-ai-tanya/eleventy.config.js` with the wiki-canonical
H2 list (Concepts, Sources, Cross-references, Cited in, Threads →
`.backlink-list`; Findings → `.finding-list`; Interpretive tensions,
Definition, What-this-concept-is-not, Scope note → no list class;
Instantiating findings → `.backlink-list`).

The factory is consumer-agnostic; the live site can adopt it once
section-wrap support is added (the factory currently only injects a
class on the title and an optional class on a following list;
wrapping a section in a div is the next iteration).

## Class-naming paradigm

Repo primitives use a mix of Tailwind utilities and `cc-*` semantic
classes (defined in `ui-kit.css`). Canonical primitives (header,
chrome, footer, sub-site-bar, etc.) follow live's Tailwind-utility
paradigm. Sample primitives (article-card, article-view, hero,
collaborator-chip) use `cc-*` semantic classes — these are
documented design vocabulary, not wired into any production consumer.
Promoting them requires reconciling the two paradigms.
