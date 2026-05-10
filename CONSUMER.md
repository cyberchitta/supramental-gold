# Consuming Supramental Gold

How a downstream site (main cyberchitta.cc, or a gh-pages subsite) should
depend on this design system.

## Option A — npm package (recommended)

Once published as `@cyberchitta/supramental-gold`:

```bash
npm install @cyberchitta/supramental-gold
```

In your CSS entry:
```css
@import "@cyberchitta/supramental-gold/colors-and-type.css";
@import "@cyberchitta/supramental-gold/ui-kit.css";
```

In Eleventy, point `_includes` at the package:
```js
// .eleventy.js
eleventyConfig.addPassthroughCopy({
  'node_modules/@cyberchitta/supramental-gold/assets': 'assets/sg',
});
eleventyConfig.addLayoutAlias('sg', 'node_modules/@cyberchitta/supramental-gold/_includes');
```

Pin to a minor version (`^1.2.0`) for normal use; pin exact (`1.2.3`) for
gh-pages subsites that must not drift unexpectedly.

## Option B — git submodule

```bash
git submodule add https://github.com/cyberchitta/supramental-gold.git vendor/sg
git submodule update --init --recursive
```

Then reference `vendor/sg/colors-and-type.css` etc. directly. Each subsite
must run `git submodule update --init` in CI before building.

## Option C — git subtree

```bash
git subtree add --prefix=vendor/sg \
  https://github.com/cyberchitta/supramental-gold.git main --squash
```

A vendored copy you can edit locally; push changes back with
`git subtree push`.

## Option D — CSS-only via jsDelivr (stopgap)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@v1.0.0/colors-and-type.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@v1.0.0/ui-kit.css">
```

Works for CSS only. Partials don't propagate, so headers/footers can't be
shared this way. Useful as a stopgap or for landing pages.

---

## Update flow (npm)

When a token or partial changes upstream:

1. Update here (this repo). Bump version. Tag.
2. `npm publish`.
3. In each consumer: `npm update @cyberchitta/supramental-gold`. CI rebuilds.
4. Visual diff. If clean, merge.

## Update flow (submodule)

1. Update here. Tag.
2. In each consumer: `cd vendor/sg && git pull origin v1.2.0`. Commit the
   pointer bump in the consumer.
3. CI rebuilds.

---

## Subsite checklist

For each new gh-pages subsite that adopts this system:

- [ ] Add `@cyberchitta/supramental-gold` as a dependency.
- [ ] Import `colors-and-type.css` and `ui-kit.css` in the entry CSS.
- [ ] Wire `_includes/header.ejs` and `_includes/footer.ejs` into the layout.
- [ ] Use the same `logo.svg` from `assets/` (don't fork the mark).
- [ ] Set `<html data-theme="light">` (or implement the live site's theme
      toggle, deferring to its persistence behavior).
- [ ] Keep the wordmark "CyberChitta" in the header — subsites are part of
      the same publication, not separate brands.
- [ ] Visual QA against the main site at the same breakpoints.
