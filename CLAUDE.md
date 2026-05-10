# Claude Code — Handoff Notes

This repo (`supramental-gold`) contains a design system extracted from the
live **www.cyberchitta.cc** site. It is intended to be consumed by:

1. The main cyberchitta.cc site (Eleventy + Tailwind v4 + DaisyUI).
2. One or more **subsites deployed to GitHub Pages**, which must share the
   same header, footer, type, and colors and stay in lockstep with the main
   site as it evolves.

Your job, when invoked in the live cyberchitta.cc repo, is to **reconcile and
adopt** this design system there, then design the multi-site sync mechanism.

---

## Source-of-truth relationship

- The CSS in this repo was **lifted from the live site's tailwind.css** as of
  the export date. So at handoff time the two are nearly-identical.
- **Until v1.0:** if the live site disagrees with this repo, the live site
  wins. Update this repo to match.
- **After v1.0:** this repo wins. The live site's CSS becomes a thin import.

The flip from "live wins" to "repo wins" happens when the live site is
successfully consuming this repo end-to-end (all partials in use, all tokens
read from the imported CSS, no local overrides).

---

## What's in the bundle

| Path | Status | Notes |
|---|---|---|
| `colors-and-type.css` | ✅ canonical | Plain CSS custom properties. Light + dark. |
| `ui-kit.css` | ✅ canonical | Component styles. Extends the token file. |
| `assets/logo.svg` | ✅ canonical | Mythic palette baked in as hex values, NOT CSS vars on the SVG. To re-skin, edit the SVG directly (search-and-replace the hexes). |
| `assets/hero.webp` | ⚠️ placeholder | DeepMind "Visualising AI" sample. Replace per-page with real hero imagery. |
| `_includes/*.ejs` | ⚠️ best-effort | Mechanical conversions of React prototypes. Interactive bits need rewiring. See "Known imperfections." |
| `examples/index.html` | ℹ️ reference | Static rendered preview. Not for production. |

## What's NOT in the bundle (intentional)

- The original `preview/` folder of design-system cards. If a docs page is
  wanted, build it as Eleventy pages from the real partials.
- The original `uploads/` (live site's tailwind.css + index.html + the SVG).
  Those are the *origin*; this repo is the *system*. Pull originals from the
  live repo when reconciling.
- The showrunner avatar (`manda-2504.webp`). Was never provided. The article
  byline has a fallback initial 'R' chip. Replace with the real avatar in
  the live site.
- A React build. The kit's React prototypes were a working surface for design,
  not a deliverable. The EJS partials are the production-shaped output.

---

## Known imperfections to reconcile

1. **EJS partials need their JS rewired.** The `<details>` dropdowns and the
   `cc-nav` custom event on the brand link are static markup. Wire them to
   whatever the live site uses.
2. **Theme toggle** is in `header.ejs` only as a marker. The live site has
   its own theme persistence; defer to that.
3. **Dark mode token values** were lifted but not battle-tested across every
   component. Verify visually after integrating.
4. **Tailwind v4 `@theme` block.** The live site declares tokens inside
   `@theme { … }`; this repo declares them in `:root`. Functionally the
   same, but for tighter integration you can wrap the `:root` block in
   `@theme inline { … }` so Tailwind picks them up natively.
5. **Class naming convention.** Component classes use the `cc-*` prefix
   throughout. If the live site uses a different prefix or naming, decide
   whether to rename here or alias there.

---

## Suggested first-PR order (in the live cyberchitta.cc repo)

Do these in sequence; each unlocks the next.

### 1. Vendor or depend on supramental-gold
Pick **one** of:
- **npm package** *(recommended)*: publish `@cyberchitta/supramental-gold`,
  `npm install` it in the live site, import CSS via the package path.
- **git submodule**: zero publishing infra, but submodules are fiddly.
- **git subtree**: vendored copy, easier to edit locally and push back.

See `CONSUMER.md` for the tradeoffs.

### 2. Diff and reconcile tokens
Run `diff` between live `tailwind.css` and this repo's `colors-and-type.css`.
For each difference:
- If live is intentional and newer → update this repo.
- If repo is intentional → update live to import from this repo.
- Document each decision in this repo's `CHANGELOG.md`.

### 3. Replace partials
Swap the live site's existing layout includes for the ones in
`_includes/`. Wire interactive bits (theme toggle, dropdowns) against the
live site's existing JS.

### 4. Verify visual parity
Screenshot diff: live homepage before vs after. Should be pixel-identical
modulo intentional changes.

### 5. Tag v1.0
Once the live site is fully consuming the repo with no local overrides,
tag `v1.0.0` here. From this point, this repo is the source of truth.

### 6. Stand up the second consumer
Pick the first gh-pages subsite. Repeat steps 1, 3, 4. The friction here
is the proof that the system is real.

---

## Architecture decision: multi-site sync

This is a real decision the showrunner needs to make. Don't pick silently.

**Constraint:** main site + N subsites must share the same header/footer/type/
colors and stay in sync as the main site evolves.

| Approach | Pros | Cons |
|---|---|---|
| **npm package** | Versioned, semver, easy to consume, plays nicely with Tailwind v4 build. | Requires npm publish (public or scoped private). |
| **git submodule** | Zero infra, pinned by SHA. | Submodules are notoriously fiddly. Each subsite must `git submodule update` on deploy. |
| **git subtree** | Vendored copy you can edit locally. | Harder to push changes back upstream. |
| **CDN `@import`** | Fastest. Works in plain HTML. | Only ships CSS; partials don't propagate. |

**Recommendation:** npm package. The live site already has a build step
(Tailwind v4); the friction is low. Publish under `@cyberchitta/` scope.

---

## Versioning policy

- `0.x.y` while the live site has not fully adopted.
- `1.0.0` when first consumer (live site) ships entirely on this repo.
- Subsequent breaking changes bump major; new tokens/components bump minor;
  fixes bump patch. Standard semver.

---

## Things to verify on first checkout

- `colors-and-type.css` declares all expected vars (light + dark).
- `assets/logo.svg` opens cleanly in a browser and renders the colored
  wheel mark (not just black).
- `examples/index.html` opens in a browser and looks like CyberChitta.
- All `_includes/*.ejs` parse with a basic Eleventy build.
