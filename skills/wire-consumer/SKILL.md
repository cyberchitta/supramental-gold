---
name: wire-consumer
description: Use this skill to set up a new CyberChitta consumer site that pulls Supramental Gold via npm dep-pin, _data/sg.js helper, and the jsDelivr CSS bundle. One-shot wiring; afterwards you use design-surface for ongoing design work.
user-invocable: true
---

For **first-time wiring** of a new consumer site (a new sub-site, a new sibling repo) into Supramental Gold. After this is done, ongoing design work uses `design-surface`. If you're producing a one-off mock and don't need the Eleventy plugin, use `design-throwaway` instead.

## Read these first

1. **`../../README.md § How consumers wire it in`** — the canonical wiring runbook. Three things flow from SG to consumers: the compiled CSS bundle (via jsDelivr), the brand assets (via jsDelivr), and the Eleventy plugin (via npm).
2. **`../../CLAUDE.md § Deployments`** — confirms what each consumer site is and where it deploys. Useful context when wiring a new one.
3. **`../../package.json`** — for the canonical `name`, `exports`, and the dep-pin format consumers reference.

## The three plumbing pieces

A wired consumer has all three of these:

### 1. npm dep-pin in `package.json`

```json
"dependencies": {
  "@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#<tag>"
}
```

Use a real tag (e.g. `v0.3.2`), never `main`. The tag is what every other piece derives from.

### 2. `_data/sg.js` deriving URLs from the pin

A small Eleventy data file that reads the pinned tag out of `package.json` and exposes jsDelivr URLs:

```js
import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const pinRef = pkg.dependencies['@cyberchitta/supramental-gold'];
const tag = pinRef.split('#')[1];
const base = `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@${tag}`;

export default {
  tag,
  cssBundleUrl: `${base}/dist/styles.css`,
  logoSvgUrl: `${base}/assets/cc-260508.svg`,
  logoPngUrl: `${base}/assets/cc-260508.png`,
};
```

Wire `sg.cssBundleUrl` into the consumer's `<head>` template; wire `sg.logoSvgUrl` into chrome / footer primitives.

### 3. Eleventy plugin registration

In the consumer's `eleventy.config.js`:

```js
import sgPlugin from '@cyberchitta/supramental-gold/eleventy';

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(sgPlugin);
  // ...
}
```

This registers `sgHelpers` as Eleventy global data (`formatDate`, `parentConcepts`, `findingBySlug`, etc.) and exposes the `eleventy/primitives/` directory for `<%- include('primitives/...') %>`.

## Brand assets — never copy

The brand mark (`cc-260508.svg`, `.png`) is **always referenced via the jsDelivr URL from `sg.logoSvgUrl`**, never copied into the consumer repo. The dep-pin tag is the source of truth for which version each consumer ships.

If the consumer needs a favicon, derive it from the jsDelivr SVG at build time or use the jsDelivr URL directly via `<link rel="icon">`. Don't commit a copy.

## Verifying the wiring

After all three pieces land, smoke-check:

1. `npm install` resolves the dep-pin without error.
2. `<head>` renders the jsDelivr `<link>` with the pinned tag.
3. A page using `primitives/chrome` renders with the brand mark visible.
4. A page using `formatDate` from `sgHelpers` formats a date correctly.

If pinning a different SG tag bumps everything correctly (CSS, mark, helpers all updated on the next deploy), the wiring is sound.

## If invoked without guidance

Ask the user:

1. New sub-site (e.g. `ch-<name>.cyberchitta.cc`) or a sibling repo with its own domain?
2. Does the consumer already have an Eleventy setup, or starting from scratch?
3. Which SG tag should we pin? (`git -C /Users/ad/GitHub/supramental-gold tag --sort=-v:refname | head -1` for the latest)

Then walk the user through the three plumbing pieces in order: `package.json` pin, `_data/sg.js`, plugin registration. After all three are in place, switch to `design-surface` for any actual design work.
