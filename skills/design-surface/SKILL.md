---
name: design-surface
description: Use this skill for production CyberChitta design work — adding or modifying surfaces on www.cyberchitta.cc, ch-ai-tanya, or a wired sub-site that consumes SG via the Eleventy plugin. Covers primitives, helpers, CSS layers, and adding to the visual language.
user-invocable: true
---

For **production design work** on a CyberChitta consumer site that already wires Supramental Gold via the Eleventy plugin and the pinned jsDelivr CSS bundle. Adding a new component, modifying a primitive, adjusting a surface, designing a new page. If you're producing a one-off mock or slide, use `design-throwaway` instead. If you're setting up a new consumer from scratch, use `wire-consumer` first to get the plumbing in place.

## Read these first

1. **`../../visual.md`** — the visual brief. Look, layout, motion, philosophy (*Less is More*), anti-patterns, iconography rules. **Read before adding anything to the visual language** — and again before shipping, against the "What to avoid" tripwires.
2. **`../../voice.md`** — the editorial brief. **Read before drafting or copyediting any copy** that ships on the surface you're touching (titles, deks, byline, body, CTAs).
3. **`../../README.md § How consumers wire it in`** — only if you're unsure how SG is plumbed into the consumer (`_data/sg.js`, dep-pin, jsDelivr URL derivation). If the wiring is already working, skip this.
4. **`../../CLAUDE.md`** — handoff notes for the live deployments. Read when debugging a wiring or deployment issue.

## The SG source tree (what to actually read)

When designing in production, the relevant files in `supramental-gold/`:

- **`colors-and-type.css`** — light + dark tokens, base type, semantic element classes (`.link`, `.logo-text`, `.group-header`, `.byline*`, `.article-content`, `.credits-section`), full-width utilities, the four `.icon-*` mask classes.
- **`ui-kit.css`** — component styles in two layers:
  - `cc-*` classes — blog surface vocabulary (header, hero, article row, byline-info, footer, article view).
  - Wiki / sub-site primitives — `sub-site-bar`, `status-badge`, `provenance`, `outbound-action`, `entry-title-row`, `finding-list`, `concept-entry`, `backlink-list`, `crumb-nav`, density toggles.
- **`eleventy/primitives/*.ejs`** — design primitives. Canonical: `header`, `chrome`, `footer`, `sub-site-bar`, `status-badge`, `entry-title-row`, `provenance`, `outbound-action`, `section-title`. Sample (not wired into production by default): `article-card`, `article-view`, `hero`, `collaborator-chip`.
- **`eleventy/helpers.js`** — `formatDate`, `parentConcepts`, `findingBySlug`, `conceptBySlug`, `byTitle`, `byDateDesc`, `yearMonth`.
- **`eleventy/section-title-transform.js`** — generic factory for rewriting `<h2>` titles into `.group-header` shape + classing the following `<ul>`.
- **`examples/index.html`** — static rendered preview, useful for visual reference.
- **`dist/styles.css`** — compiled bundle (~118 KB). Tracked in git, served via jsDelivr; consumers don't import it from source.

## How the consumer uses SG (already in place; verify, don't reinstall)

A consumer site should already have:

```ejs
<%- include('primitives/chrome', { brandLogoUrl: sg.logoSvgUrl }) %>
<%- include('primitives/footer', { mainSiteUrl: 'https://www.cyberchitta.cc' }) %>
```

with `sg.logoSvgUrl` resolved from `_data/sg.js` derived off the `package.json` dep-pin. **Don't copy SG assets into the consumer** — always reference the jsDelivr URL via the pin.

## Adding to the visual language

If a new surface or component genuinely needs vocabulary the existing ui-kit / primitives don't cover:

1. Re-read `visual.md § When in doubt` — try to design in the *spirit* of the live site (warm paper-ink, hairline boundaries, Fraunces titles, gold + bronze, no chrome) before reaching for new tokens.
2. Propose the addition as a new entry in `ui-kit.css` (or a new primitive in `eleventy/primitives/`) rather than a one-off override on the consumer side.
3. Document the *why* in `NOTES.md` if it's a non-obvious choice or evolution from the live site.
4. Re-check against `visual.md § What to avoid` — purple-pink gradients, glassmorphism, sticky chrome, emoji, etc. — before shipping.

## Designing with custom elements

A **custom element** is a design surface in its own right: a custom HTML tag,
authored inline in an article, that compiles to rich layout at build time while
the article source stays clean semantic markdown. Reach for one when a piece of
content recurs with rich or interactive layout that would be noise as raw markup
(a media block, a comparison table, a chart, an embed) — as opposed to a
**primitive** (site chrome: header, footer, byline) or plain **markdown** (prose).

Each consumer defines its **own** tag namespace — the names and subtypes are not
shared design vocabulary:

- `www.cyberchitta.cc` — `<showcase>` (layout/media blocks) and `<showtable>`
  (tabular / data-driven surfaces). Their subtype catalogs and when-to-use
  semantics are documented in that site's own `site-build` skill.
- `sorted-studs` — `<glb-pane>` (a 3D-model embed).

SG does **not** ship a shared element vocabulary today; whether it should (a
small `<exhibit>` / `<embed>` set consumers extend with their own subtypes) is an
open question in SG's `TODO.md`. Until then, design at the level of *what surface
this content wants*, and let each consumer name and build its own element.

The **implementation** — registering a namespace, the content parser, the
template locals, the authoring rules (self-closing, blank-line) — is
build-side: `wire-consumer/references/custom-elements.md`.

## If invoked without guidance

Ask the user:

1. Main site (`www.cyberchitta.cc`, blog surface) or sub-site (e.g. `ch-ai-tanya`, wiki / research-vault surface)?
2. Touching an existing primitive / component, or adding a new one?
3. Light, dark, or both?
4. Is this a visual-only change, or does it ship with new copy (titles, deks, body) that also needs voice review?

Then act as an expert designer producing HTML / EJS / CSS as appropriate — never inventing new tokens, never breaking the anti-patterns in `visual.md § What to avoid`, never copying SG assets into the consumer.
