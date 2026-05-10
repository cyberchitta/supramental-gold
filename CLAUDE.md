# Claude Code — Handoff Notes

This repo (`supramental-gold`) contains a design system extracted from the
live **www.cyberchitta.cc** site. It is intended to be consumed by:

1. The main cyberchitta.cc site (Eleventy + Tailwind v4 + DaisyUI).
2. One or more **subsites deployed to GitHub Pages**, which must share the
   same header, footer, type, and colors and stay in lockstep with the main
   site as it evolves.

Your job, when invoked in the live cyberchitta.cc repo, is to **reconcile and
adopt** this design system there, then design the multi-site sync mechanism.

**Status update (2026-05-10):** the package + plugin + bundle build are
in place. `ch-ai-tanya` consumes SG end-to-end via `bun add file:..`
and `<%- include('primitives/<name>') %>`. The live site has not yet
been migrated. See `NOTES.md` for what's done and `TODO.md` for what's
pending.

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

## What's in the package

| Path | Status | Notes |
|---|---|---|
| `package.json` | ✅ canonical | `@cyberchitta/supramental-gold` v0.1.0. `exports` cover the plugin entry, primitives path, and CSS files. |
| `tailwind.css` | ✅ canonical | Bundle build entry. Multi-source `@source` scan covers SG + every sibling consumer repo. |
| `dist/styles.css` | ✅ canonical | Compiled bundle (~117KB minified). Tracked in git; consumers link to it. |
| `colors-and-type.css` | ✅ canonical | Plain CSS custom properties. Light + dark. |
| `ui-kit.css` | ✅ canonical | Component styles + wiki design vocabulary (status-badge, sub-site-bar, finding-list, concept-entry, backlink-list, etc.). |
| `eleventy/index.js` | ✅ canonical | Eleventy plugin — registers `sgHelpers` global. |
| `eleventy/helpers.js` | ✅ canonical | `formatDate`, `parentConcepts`, `findingBySlug`, `conceptBySlug`, `byTitle`, `byDateDesc`, `yearMonth`. |
| `eleventy/custom-element-renderer.js` | ✅ canonical | Generic factory; exported, not auto-registered. For consumers that want HTML-tag-style authoring for their own namespaces. |
| `eleventy/primitives/*.ejs` | ✅ mostly canonical | See `NOTES.md` "Primitive ↔ live-site partial mapping" for which are canonical vs sample. |
| `assets/cc-260508.{svg,png}` + `cc-250815-v3.svg` | ✅ canonical | CC mark assets, copied from live. PNG is LFS-tracked. |
| `assets/manda-2504.webp`, `llm-lot-2504.webp` | 🟡 untracked | Avatars / featured-image samples copied locally; staging deferred. |
| `examples/index.html` | ℹ️ reference | Static rendered preview. Not for production. |

## What's NOT in the package (intentional)

- The original `preview/` folder of design-system cards. If a docs page is
  wanted, build it as Eleventy pages from the real partials.
- The original `uploads/` (live site's tailwind.css + index.html + the SVG).
  Those are the *origin*; this repo is the *system*. Pull originals from the
  live repo when reconciling.
- A React build. The kit's React prototypes were a working surface for design,
  not a deliverable. The EJS primitives are the production-shaped output.

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

## Adoption sequence — status

The plan is to land sub-site adoption first, then live-site adoption,
then tag v1.0. Current state:

### 1. Vendor or depend on supramental-gold ✅ done (file: link)
Consumers add `"@cyberchitta/supramental-gold": "file:../supramental-gold"`
in `package.json`. No npm publish step yet. When we tag, the dependency
spec becomes `"github:cyberchitta/supramental-gold#v…"` (or the
compiled bundle gets served from jsDelivr — see `CONSUMER.md`).

### 2. Diff and reconcile tokens ✅ done
Token values match exactly between SG's `colors-and-type.css` and live's
`tailwind.css`. Wiki design vocabulary added to SG's `ui-kit.css`. Each
decision is documented in `NOTES.md`.

### 3. Replace partials — partial: ✅ ch-ai-tanya, ⏳ live site
`ch-ai-tanya` consumes the SG primitives via
`<%- include('primitives/<name>', { … }) %>` in its base/concept/finding
layouts. The live site still uses its own inline header/footer; switching
it to consume `primitives/header.ejs` and `primitives/footer.ejs` is the
remaining migration. See `TODO.md`.

### 4. Verify visual parity ⏳ pending live-site swap
Screenshot diff to be done after the live site links to SG's bundle.

### 5. Tag v1.0 ⏳ pending
Once the live site is fully consuming SG with no local overrides, tag
`v1.0.0`. At that point switch consumer dependency specs from `file:` to
git URL or jsDelivr.

### 6. Stand up sub-sites ✅ ch-ai-tanya done
`ch-ai-tanya` is the first sub-site consumer; works end-to-end. Future
sub-sites repeat the same wiring (see `CONSUMER.md` checklist).

---

## Architecture decision: multi-site sync — decided

**Constraint:** main site + N subsites must share the same
header/footer/type/colors and stay in sync as the main site evolves.
Constraint added in this iteration: the *same URL* should serve the
bundle to all consumers, so cross-site navigation hits a warm browser
cache.

**Decision:**
- **SG hosts the canonical bundle** (`dist/styles.css`). Compiled here,
  scanned across every consumer's templates via Tailwind's multi-source
  `@source`. No special role for the live site as bundler.
- **Local dev:** `bun add file:../supramental-gold`; consumers
  passthrough-copy `dist/styles.css` from the file: link.
- **Production (post-tag):** jsDelivr serves the same bundle from the
  tagged git repo. Same URL on every consumer. Brand assets (logos)
  also addressable via jsDelivr.
- **Eleventy plugin** (this package's main entry) provides the helpers
  and the path to `eleventy/`, which consumers expose to EJS via
  `views: [sgEleventy]`. Primitives are then `<%- include('primitives/<name>') %>`.

CI for the bundle build (cloning consumer siblings, rebuilding on tag,
pushing) is deferred — local builds suffice for now. See `TODO.md`.

---

## Versioning policy

- `0.x.y` while the live site has not fully adopted.
- `1.0.0` when first consumer (live site) ships entirely on this repo.
- Subsequent breaking changes bump major; new tokens/components bump minor;
  fixes bump patch. Standard semver.

---

## Things to verify on first checkout

- `colors-and-type.css` declares all expected vars (light + dark).
- `assets/cc-260508.svg` opens cleanly in a browser and renders the
  colored wheel mark.
- `bun install && bun run build:css` produces `dist/styles.css` without
  warnings (sibling consumer repos must exist for the multi-source
  scan; see `tailwind.css` for the listed paths).
- `examples/index.html` opens in a browser and looks like CyberChitta.
- All `eleventy/primitives/*.ejs` parse with a basic Eleventy build
  (use `ch-ai-tanya` as the working reference consumer).
