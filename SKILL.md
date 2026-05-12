---
name: supramental-gold
description: Use this skill to generate well-crafted interfaces, articles, sub-site surfaces, and assets for CyberChitta — the personal publication of @restlessronin and its wiki sub-sites. Contains tokens, type, primitives, icons, a compiled CSS bundle, and the craft brief (voice, tone, philosophy, anti-patterns).
user-invocable: true
---

Supramental Gold is the design system that dresses **CyberChitta** (`www.cyberchitta.cc`) and its sub-sites (`ch-ai-tanya.cyberchitta.cc`, etc.).

## Read these first, in order

1. **`CRAFT.md`** — the craft brief. Voice, tone, casing, philosophy (*Less is More*), what to avoid, iconography rules. **Read this before designing anything** — tokens alone will not keep you on-key.
2. **`README.md`** — what's in the package, how consumers wire it in (jsDelivr CSS bundle + Eleventy plugin + version-pinned dep ref), the release workflow.
3. **`NOTES.md`** — decision rationale and reconciliation log. Useful when you need to know *why* something is the way it is.
4. **`CLAUDE.md`** — handoff notes for the live deployments. Read when wiring or debugging a consumer.

## Then explore

- **`colors-and-type.css`** — light + dark tokens, base type, semantic element classes (`.link`, `.logo-text`, `.group-header`, `.byline*`, `.article-content`, `.credits-section`), full-width utilities, the four `.icon-*` mask classes.
- **`ui-kit.css`** — component styles in two layers:
  - **`cc-*`** classes — blog surface vocabulary (header, hero, article row, byline-info, footer, article view).
  - **Wiki / sub-site primitives** — `sub-site-bar`, `status-badge`, `provenance`, `outbound-action`, `entry-title-row`, `finding-list`, `concept-entry`, `backlink-list`, `crumb-nav`, density toggles. Used by wiki sub-sites.
- **`assets/`** — `cc-260508.svg` + `.png` (canonical mark, served via jsDelivr), `cc-250815-v3.svg` (source-of-mark working file).
- **`eleventy/primitives/*.ejs`** — design primitives. `header`, `chrome`, `footer`, `sub-site-bar`, `status-badge`, `entry-title-row`, `provenance`, `outbound-action`, `section-title` are canonical. `article-card`, `article-view`, `hero`, `collaborator-chip` ship as samples.
- **`eleventy/{index,helpers,section-title-transform,custom-element-renderer}.js`** — Eleventy plugin + helpers.
- **`examples/index.html`** — static rendered preview, for visual reference.
- **`dist/styles.css`** — the compiled bundle (~118 KB). Served via jsDelivr; consumers don't import it from source.

## Working modes

**Designing a throwaway artifact** (slide, mock, prototype, deck):

- Pull tokens via the compiled bundle URL: `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@<tag>/dist/styles.css`. Pin a real tag.
- Pull the brand mark from the same `@<tag>` base: `assets/cc-260508.svg`.
- Add a `<link>` for Fraunces, Inter, Fira Code, and Courier Prime in `<head>` (the bundle relies on these being loaded; in production they're loaded via Tailwind/DaisyUI).
- Follow **`CRAFT.md`** for voice, tone, layout, anti-patterns. Tokens alone are not enough.

**Working on the live site or a sub-site** (production code):

- Don't copy assets — version-pin against the canonical jsDelivr URL via `_data/sg.js`.
- Use the Eleventy plugin: `<%- include('primitives/chrome', { brandLogoUrl: sg.logoSvgUrl }) %>`, `<%- include('primitives/footer', { mainSiteUrl: 'https://www.cyberchitta.cc' }) %>`, etc.
- Read `README.md § How consumers wire it in` and `CLAUDE.md` for the wiring details.
- Read `CRAFT.md` before adding anything new to the visual language.

## Flagged approximations

Surface these to the user when starting work where pixel fidelity matters:

- **Fonts** are Google Fonts. Licensed/optical-size builds may differ subtly.
- **`cc-250815-v3.svg`** is the source-of-mark working file, not what ships — use `cc-260508.svg` / `.png` for the canonical render.
- **Showrunner avatar** (`manda-2504.webp`) is not in the package — bylines fall back to initials.

## If invoked without guidance

Ask the user:

1. Are we designing a one-off artifact (slide, mock, prototype) or working on production code (`www.cyberchitta.cc` or a sub-site)?
2. Main site (blog surface) or sub-site (wiki / research-vault surface)?
3. Any specific surface or component? Or starting from scratch?
4. Light, dark, or both?

Then act as an expert designer who outputs HTML / EJS / JSX as appropriate — never inventing new tokens, never breaking the anti-patterns in `CRAFT.md § What to avoid`.

---

*सत्यमेव जयते • vincit omnia veritas*
