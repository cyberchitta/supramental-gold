# Site authoring — what belongs where

The rules for building pages once a consumer is wired. Plumbing is the
SKILL.md; the element renderer contract is `custom-elements.md`; this is
the page-level doctrine. It exists because a consumer once drifted into
authoring whole pages as `.ejs` — loops, inline HTML, inline styles —
and nothing written down said not to (ch-ai-tanya, reconciled
2026-07-24).

## Pages are markdown

Every HTML page's source is a `.md` file: frontmatter carrying the data
contract, body carrying prose. This includes listing and index pages —
the main site's articles index is frontmatter plus one line of intro and
`<showcase type="article-list"></showcase>`. A `.ejs` file at page level
is correct only for non-HTML artifacts: `feed.ejs`, `sitemap.ejs`,
`llms.txt` templates.

## The only markup in a body is a custom-element tag

Prose is plain markdown. When a page needs generated or interactive
structure — a listing, a chart, a viewer pane — it authors a custom
element (`<showcase type="…" />` on the main site and ch-ai-tanya,
`<glb-pane …/>` on sorted-studs) and the markup lives in the element's
template. The tripwire: a loop, a conditional, or a class-bearing `<div>`
appearing in a page body means a custom element (or a layout) is missing.
Renderer contract and authoring rules: `custom-elements.md`.

## Layouts are thin shims

The consumer's `layouts/base.ejs` is frontmatter (the permalink rule)
plus `include('layouts/base-chrome')` — four lines:

```ejs
---
permalink: "<%= page.fileSlug==='' ? 'index.html' : `${page.filePathStem}.html` %>"
---
<%- include('layouts/base-chrome') %>
```

Head meta, fonts, theme-init, header, footer all come from SG.
`base-chrome` reads `site.url`, `site.description`, and
`site.mainSiteUrl` from the consumer's `_data/site.json`, and
`sg.cssBundleUrl` / `sg.logoSvgUrl` from `_data/sg.js`. Type-specific layouts
(`article.ejs`, a wiki's `finding.ejs`) add only the structure specific
to that surface, and compose SG primitives for badges, provenance,
title rows. A layout that hand-assembles `<html>`/`<head>` is the drift
this file exists to prevent.

## Extend by shadowing, not copying

The EJS `views` array lists the consumer's `_includes` before SG's, so
a consumer file at the same path shadows the SG default. That is the
mechanism for site-specific chrome: shadow `partials/site-analytics` or
`partials/site-scripts` for head/body extensions, shadow a primitive to
*wrap* it (ch-ai-tanya shadows `primitives/header` to add the sub-site
bar around `primitives/chrome`). Never copy an SG template into the
consumer to edit it — a copy stops tracking the house.

## Pages declare, templates compute, data is built

A page body never computes anything; it names what it wants. Element
templates receive their data, they don't go hunting for it. Data
reaches them through the data layer: frontmatter, `_data/`, or — for
element templates, which render in a transform where Eleventy
collections are not available — a derived index built at config load or
in an `eleventy.before` hook (the main site's `siteIndex.json`,
ch-ai-tanya's `build/site-index.js`).

## Ownership and promotion

SG owns how the house looks and renders — markup, classes, helpers,
layout shells. The consumer owns what the site says, plus surfaces that
exist only there. A consumer-local element template starts as
consumer-owned markup; once a second consumer needs the same surface,
the markup moves to an SG primitive and the element templates shrink to
thin delegators (`article-list` set the precedent in v0.4.0).

## Reference consumers

- **sorted-studs** — the minimal shape: one markdown page, one custom
  element, four-line base shim.
- **ch-ai-tanya** — a structured corpus: typed layouts, eight listing
  elements, a derived index feeding them.
- **www.cyberchitta.cc** — the full build: showcase/showtable config
  trees, content parsers, text mirrors (`.md.js`) for llms.txt.
