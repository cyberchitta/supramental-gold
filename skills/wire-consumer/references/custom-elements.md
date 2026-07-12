# Custom elements — the `createCustomElementRenderer` contract

SG exports `createCustomElementRenderer` so a consumer can author custom
HTML-tag-style elements in its markdown that compile to rich HTML at build time —
the goal being **clean semantic markdown** in the source, rich output on the
page. It is **opt-in**: `eleventy/index.js` does not register it. Consumers that
use it register their **own** tag namespaces; nothing here assumes a particular
tag set:

- `www.cyberchitta.cc` — `<showcase>` / `<showtable>` (media, charts, tables).
- `sorted-studs` — `<glb-pane>` (hides `<model-viewer>` boilerplate).
- `ch-ai-tanya` — doesn't use it at all.

Everything below is the renderer mechanism plus the authoring facts that follow
from markdown-it and the transform — true for any consumer that wires it.

## How it works

The renderer is an Eleventy **HTML transform**. It scans the rendered HTML for
registered tags (paired `<tag>…</tag>` and self-closing `<tag … />`) and replaces
each with the output of its EJS template.

```js
import sgPlugin, { createCustomElementRenderer } from '@cyberchitta/supramental-gold/eleventy';

const elementConfigs = {
  // single-template tag → template path (resolved under includesRoot)
  'glb-pane': 'glb-pane.ejs',
  // OR type-dispatched tag → nested object keyed by an attribute value
  showcase: { hero: 'showcase/hero.ejs', /* … */ },
};

const renderCustomElements = createCustomElementRenderer(
  elementConfigs,
  includesRoot,                          // dir templates resolve under
  { data: { ...jsonData, site }, helpers },   // the dataContext
  { showtable: parseShowtableContent },  // OPTIONAL per-tag content parsers
);

eleventyConfig.addTransform('renderCustomElements', async (content, outputPath) =>
  outputPath?.endsWith('.html') ? renderCustomElements(content) : content,
);
```

**Template resolution** — a string config *is* the template; a nested object
dispatches on attribute values (`<showcase type="hero">` → `configs.showcase.hero`).

**Locals each `.ejs` receives** — `{ ...parsedBody, ...attributes, ...context }`:

- `parsedBody` — the tag's content parser output (or `{}` if no parser).
- `attributes` — the tag's HTML attributes.
- `context` — the `dataContext`, `{ data, helpers }`. **Pass `site` into `data`
  explicitly** — Eleventy's JSON-dir loader can't read a `.js` data file.

## Content parsing — optional

The default is a no-op (`parsedBody = {}`), which is all a content-less tag
needs. A tag that carries body content supplies a parser that turns the body
into template locals.

**Ordering that matters:** the transform runs on the **`.html` output** — *after*
`markdownTemplateEngine: 'ejs'` has run EJS and *after* markdown-it has rendered.
So a tag body authored as a **markdown pipe table** reaches the parser as an
**HTML `<table>`** (parse `<tr>`/`<td>`), not as pipes. (The main site's
`showtable` parser does exactly this, returning `{ headers, rows }`.)

## JS-driven elements — declare in markup, interpret in the client

When an element's output is drawn client-side, don't give the tag an opaque key
that a script resolves against hardwired config. Instead:

1. The tag's attributes + body carry the full declaration (the editorial
   surface: captions, labels, series, style, data keys).
2. The `.ejs` normalizes that declaration and bakes it into the element's
   container as a `<script type="application/json" data-…>` island.
3. The client script is a **generic interpreter**: read the island, resolve
   data keys against fetched data, render.
4. Data plumbing (joins, smoothing, derivations) lives in **one build module**
   that produces plot-ready data for both the client and any text mirror —
   never duplicated per render path. If you find yourself writing a
   "mirrors X.js" comment, the declarative core wants extracting.

Precedent (N=2, `www.cyberchitta.cc`): `pc-timeline` (events island read by
both the build-time strip and the client re-render) and `pc-chart` (per-figure
`data-pc-def` island + `build/derive-pc-series.js` feeding the client and the
llms.txt mirror alike).

## Authoring rules

These follow from markdown-it + the transform and apply to any consumer:

- **Self-closing for content-less tags.** markdown-it treats a *paired* tag on
  one line (`<tag></tag>`) as inline HTML and wraps it in a `<p>`; after the
  transform expands it to a block element (`<figure>`), you get an orphan empty
  `<p>` (and sometimes invalid block-in-`<p>` DOM the browser auto-closes). The
  self-closing form `<tag … />` satisfies CommonMark's block rule. Use paired
  form *only* when the tag carries body content.
- **Blank line after the opening tag, when it carries content.** Closes the HTML
  block so markdown-it renders the body — e.g. a pipe table → `<table>`:

  ```markdown
  <showtable type="…">

  | col | col |
  | --- | --- |
  | a   | b   |

  </showtable>
  ```
- **Body is authored content; rendering logic lives in the `.ejs`.** Keep
  computed or data-driven values in the template, surfaced through the element —
  not woven into source prose.
- **The element's parameters live in the markup — never behind an opaque id.**
  Everything that defines *what the element shows* (caption, series names,
  labels, scale, data keys) must be readable in the source: attributes for
  scalars, a body table for lists. A tag like `<showcase … chart="privacy-tx" />`
  whose meaning lives in a chart definition hardwired in client JS is the
  anti-pattern: the source can't say what the figure claims, editors can't
  reach the captions, and any text mirror is forced into a second, hand-synced
  implementation. For client-rendered elements, see § JS-driven elements above.

## Adding a tag — checklist

1. Register `tag → template` (or `tag → { typeValue → template }`) in
   `elementConfigs`.
2. Write the `.ejs` — reads `parsedBody` + `attributes` + `context`, emits HTML.
   Dynamic logic lives here.
3. If the tag carries body content, supply a content parser; otherwise rely on
   self-closing form.
4. Author with the self-closing / blank-line rules above.
5. Verify the `.html` renders.

## If you also emit a text mirror

A consumer that produces a markdown/text rendering of its pages (e.g. an
llms.txt) pairs each `.ejs` with a separate markdown renderer and a second
render path. That's a **consumer-specific** concern — the rendering convention,
the build wiring, and the failure modes it introduces are documented by that
consumer, not here. (See `www.cyberchitta.cc`'s `site-build` skill for a worked
example.)
