# Consuming Supramental Gold

How a downstream site (the main `cyberchitta.cc`, or a gh-pages
sub-site like `ch-ai-tanya`) depends on this design system.

Two things flow from SG to consumers:

1. **The compiled CSS bundle** at `dist/styles.css`. Loaded in the
   browser via `<link>`. Contains Tailwind utilities (tree-shaken
   across all listed consumers) + DaisyUI + the SG semantic vocabulary.
2. **The Eleventy plugin** at `@cyberchitta/supramental-gold/eleventy`.
   Provides shared helpers and exposes the primitives directory. Used
   at build time only.

Sub-sites need both. The live site eventually too (when it switches
from building its own bundle to consuming SG's).

---

## Local-dev install (current pattern)

For consumers checked out as siblings of `supramental-gold`:

```jsonc
// consumer's package.json
"dependencies": {
  "@cyberchitta/supramental-gold": "file:../supramental-gold"
}
```

```bash
bun add file:../supramental-gold
```

This makes the package available without npm publish or Git URL. When
SG changes, the file: link picks up new content immediately; consumers
just rebuild.

---

## Wiring in Eleventy

```js
// consumer's eleventy.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import ejsPlugin from '@11ty/eleventy-plugin-ejs';
import sgPlugin, { helpers as sgHelpers } from '@cyberchitta/supramental-gold/eleventy';

const sgRoot = path.dirname(
  fileURLToPath(import.meta.resolve('@cyberchitta/supramental-gold/package.json')),
);
const sgEleventy = path.join(sgRoot, 'eleventy');

export default function (eleventyConfig) {
  // 1. Expose SG's eleventy/ tree to EJS's include resolver.
  //    Templates are addressed by their path under that root,
  //    e.g. `<%- include('primitives/chrome') %>`.
  eleventyConfig.addPlugin(ejsPlugin, { views: [sgEleventy] });

  // 2. Register SG's helpers under `sgHelpers` global.
  eleventyConfig.addPlugin(sgPlugin);

  // (Optional) alias to a shorter global name for templates:
  eleventyConfig.addGlobalData('helpers', sgHelpers);

  // 3. Pull SG's compiled stylesheet into the consumer's assets dir.
  eleventyConfig.addPassthroughCopy({
    [`${sgRoot}/dist/styles.css`]: 'assets/css/styles.css',
  });
}
```

In the consumer's base layout:

```ejs
<head>
  …
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <header class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <%- include('primitives/chrome') %>
    <%- include('primitives/sub-site-bar') %>
  </header>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <%- content %>
  </main>
  <footer class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <%- include('primitives/footer') %>
  </footer>
</body>
```

---

## Building the bundle

When a consumer adds new Tailwind utility classes, those need to land
in SG's compiled bundle. Locally:

```bash
cd ../supramental-gold
bun run build:css
```

The build entry (`tailwind.css`) declares `@source` paths to every
known consumer's templates. Adding a new sub-site requires:

1. Add `@source "../<new-subsite>/**/*.{html,js,ejs,md}";` to SG's
   `tailwind.css`.
2. Re-run `bun run build:css`.
3. Commit the updated `dist/styles.css`.

Consumers' builds passthrough-copy `dist/styles.css` from the file:
link, so any rebuild flows through after they re-run their own build.

---

## Future: jsDelivr distribution

Once SG is tagged (e.g. `v1.0.0`), the bundle can be served from
jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@v1.0.0/dist/styles.css">
```

Same URL on every consumer (main site + sub-sites) → same browser
cache entry on cross-domain navigation. The `addPassthroughCopy` step
goes away; the `<link>` points at the CDN.

Brand assets (`assets/*.svg`, LFS-tracked PNG/WebP) are similarly
addressable: `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@v1.0.0/assets/cc-260508.svg`.

---

## Update flow (local dev)

When a token, primitive, or helper changes upstream:

1. Edit in `supramental-gold/`.
2. If CSS source changed: `bun run build:css` in SG.
3. In each consumer: rebuild (`bun run build`). The file: link picks
   up new content; the passthrough copy refreshes; the EJS includes
   resolve against the latest primitives.

No version bump, no publish, no consumer-side dependency change.
Trade-off: there's no version pinning. When we tag and switch to
jsDelivr, version pins reappear.

---

## Sub-site checklist

For each new gh-pages sub-site that adopts this system:

- [ ] Add `@cyberchitta/supramental-gold` as a `file:` dependency
      (or git URL once we tag).
- [ ] Wire `eleventy.config.js` per the pattern above (EJS `views`,
      SG plugin, passthrough copy).
- [ ] Use `<%- include('primitives/chrome') %>` and
      `<%- include('primitives/footer') %>` in the base layout. Don't
      hand-roll your own header/footer — the brand chrome is the
      point of the design system.
- [ ] Use the `<sub-site-bar>` primitive; let it read `site.title`
      and `site.tagline` from your `_data/site.json`.
- [ ] Add an `@source` line in SG's `tailwind.css` pointing at the
      sub-site's templates so its Tailwind utility classes land in
      the bundle.
- [ ] Visual QA against the main site at the same breakpoints.

---

## Other distribution mechanisms (deprecated for now)

The original CONSUMER.md described git submodule, git subtree, and
direct CDN `@import` of source CSS files. Those are no longer the
recommended paths; `file:..` for local dev and (eventually) jsDelivr
for production are the canonical flows. See git history if you need
the older guidance.
