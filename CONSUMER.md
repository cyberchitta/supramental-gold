# Consuming Supramental Gold

How a downstream site (the main `cyberchitta.cc`, or a gh-pages
sub-site like `ch-ai-tanya`) depends on this design system.

Three things flow from SG to consumers:

1. **The compiled CSS bundle** at `dist/styles.css`, served via
   jsDelivr at
   `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@<tag>/dist/styles.css`.
   Loaded in the browser via `<link>`. Contains Tailwind utilities
   (tree-shaken across all listed consumers) + DaisyUI + the SG
   semantic vocabulary.
2. **Brand assets** — `assets/cc-260508.svg`, `cc-260508.png`,
   `cc-250815-v3.svg` — served via jsDelivr at the same `@<tag>`
   base. Used for favicon, header logo, OG fallback for
   brand-marked articles.
3. **The Eleventy plugin** at `@cyberchitta/supramental-gold/eleventy`.
   Provides shared helpers and exposes the primitives directory.
   Used at build time.

---

## Single-source version pin

Consumers maintain **one place** that names the SG version: the
`@cyberchitta/supramental-gold` dep ref in `package.json`. A small
`_data/sg.js` derives all jsDelivr URLs from it:

```js
// consumer/src/_data/sg.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
const dep = pkg.dependencies['@cyberchitta/supramental-gold'];
const version = dep.split('#').pop();
const base = `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@${version}`;

export default {
  version,
  base,
  cssBundleUrl: `${base}/dist/styles.css`,
  logoSvgUrl: `${base}/assets/cc-260508.svg`,
  logoPngUrl: `${base}/assets/cc-260508.png`,
};
```

Adjust the path-walk depth (`..`, `..`) for your data dir's nesting
(sub-sites with flat `_data/` need one `..` fewer).

Templates use `<%= sg.cssBundleUrl %>`, `<%= sg.logoSvgUrl %>`, etc.
Bumping SG version is then a one-line edit in `package.json`,
followed by `bun install` and a build. **Don't hardcode jsDelivr
URLs in templates** — that recreates the dual-pin bug we used to
have (URL in one place, dep ref in another, diverged on bump).

---

## package.json

```jsonc
"dependencies": {
  "@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#v0.2.1"
}
```

```bash
bun install
```

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
  // Expose SG's eleventy/ tree to EJS's include resolver.
  // Templates address primitives by path: `<%- include('primitives/chrome') %>`.
  eleventyConfig.addPlugin(ejsPlugin, { views: [sgEleventy] });

  // Register SG's helpers under `sgHelpers` global.
  eleventyConfig.addPlugin(sgPlugin);

  // (Optional) alias to a shorter global name for templates:
  eleventyConfig.addGlobalData('helpers', sgHelpers);
}
```

No passthrough copy of `dist/styles.css` — the bundle is fetched
from jsDelivr by the browser, not served from the consumer's own
origin.

---

## Base layout

```ejs
<head>
  …
  <link rel="icon" type="image/svg+xml" href="<%= sg.logoSvgUrl %>">
  <link rel="stylesheet" href="<%= sg.cssBundleUrl %>">
</head>
<body>
  <header>
    <%- include('primitives/chrome', { brandLogoUrl: sg.logoSvgUrl }) %>
    <%- include('primitives/sub-site-bar') %>
  </header>
  <main><%- content %></main>
  <footer>
    <%- include('primitives/footer', { mainSiteUrl: 'https://www.cyberchitta.cc' }) %>
  </footer>
</body>
```

The `brandLogoUrl` parameter on `chrome` (and on `header` directly
if you skip `chrome`) is the recommended way to feed the header
its logo URL. Without it, `header.ejs` falls back to
`${mainSiteUrl}/assets/images/shared/cc-260508.svg` — a stale
local-path assumption that works only when the consumer's parent
domain mirrors the layout.

---

## OG/Twitter and the absolute-URL guard

If the consumer references brand assets (or anything on jsDelivr)
as featured-image URLs in its data layer, the OG/Twitter meta
emission needs a guard against double-prefixing:

```ejs
<%
const absUrl = (u) => /^https?:\/\//.test(u) ? u : site.url + u;
%>
<meta property="og:image" content="<%= absUrl(ogImage) %>">
<meta property="twitter:image" content="<%= absUrl(twitterImage) %>">
```

Without it, an absolute URL gets `site.url` prepended and you ship
`https://www.cyberchitta.cc/https://cdn.jsdelivr.net/...`.

---

## Sub-site checklist

For each new gh-pages sub-site that adopts this system:

- [ ] Add `@cyberchitta/supramental-gold` as a `github:` dep at a
      tagged version.
- [ ] Create `_data/sg.js` (snippet above).
- [ ] Wire `eleventy.config.js` per the pattern above (EJS `views`,
      SG plugin).
- [ ] Use `<%- include('primitives/chrome', { brandLogoUrl: sg.logoSvgUrl }) %>`
      and `<%- include('primitives/footer', { mainSiteUrl: 'https://www.cyberchitta.cc' }) %>`
      in the base layout. Don't hand-roll your own header/footer.
- [ ] Use the `sub-site-bar` primitive; let it read `site.title`
      and `site.tagline` from your `_data/site.json`.
- [ ] Add an `@source` line in SG's `tailwind.css` pointing at the
      sub-site's templates so its Tailwind utility classes land in
      the bundle. Re-run `bun run build:css` in SG and commit the
      updated `dist/styles.css`.
- [ ] Visual QA against the main site at the same breakpoints.

---

## Releasing SG (maintainer workflow)

When SG source changes (any primitive, helper, CSS, or asset),
release a new tagged version:

```bash
cd /path/to/supramental-gold
# 1. Make source changes (primitives, helpers, ui-kit.css, etc.)
# 2. Rebuild the bundle — Tailwind class-set may have shifted.
bun run build:css
# 3. Bump version in package.json
# 4. Commit (include dist/styles.css, package.json, and source).
git add -A && git commit -F .commit-msg
# 5. Tag and push.
git tag v0.X.Y
git push origin main
git push origin v0.X.Y
```

The `build:css` step is mandatory: a release without a rebuilt
bundle ships old utilities at the new tag URL, and consumers see
class-name drift.

After publishing, in each consumer:

```jsonc
// bump dep ref to the new tag
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#v0.X.Y"
```

```bash
bun install
# verify the build picks up the new primitives + new jsDelivr URLs
```

`sg.js` derives `version` from the dep ref, so no other consumer
edit is needed.

---

## Dev-testing against unpublished SG changes

`sg.js` requires a `#tag` (or branch / commit SHA) on the dep ref to
derive a version. A `file:` dep emits malformed jsDelivr URLs
(`@file:../...`), which is intentional fail-loud — easy to spot.

To test SG changes against a consumer without cutting a real
release, use **pre-release tags or commit SHAs**:

**Pre-release tag (recommended):**

```bash
# in SG
git tag v0.X.Y-rc1
git push origin v0.X.Y-rc1
```

```jsonc
// in consumer
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#v0.X.Y-rc1"
```

`bun install`, build, verify. Iterate by tagging `-rc2`, `-rc3`,
etc. When happy, tag the same commit (or a new one) as
`v0.X.Y` and bump consumers. Tags are immutable on jsDelivr — no
cache surprises.

**Commit SHA:**

```jsonc
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#abc123def"
```

Same immutability guarantee, noisier dep ref. Useful when you
don't want to litter the tag namespace.

**Branch ref (avoid for testing):**

`github:cyberchitta/supramental-gold#dev` works, but jsDelivr
caches branch refs for ~12 hours. Force-pushing to a branch is
cheap; waiting on jsDelivr's cache (or calling its purge
endpoint) is not. Use tags or SHAs instead.

---

## Other distribution mechanisms (deprecated)

Earlier revisions of this doc described git submodule, git
subtree, direct CDN `@import` of source CSS, and `file:..` for
production. None of those are current. `file:` is now only useful
for transient pre-publish testing (see above), and even then
pre-release tags are cleaner. See git history if you need the
older guidance.
