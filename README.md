# Supramental Gold

> The CyberChitta design system — tokens, type, primitives, and a compiled CSS bundle for a warm paper-ink reading surface.

Consumed in production by:

- [www.cyberchitta.cc](https://www.cyberchitta.cc) — main site
- [ch-ai-tanya.cyberchitta.cc](https://ch-ai-tanya.cyberchitta.cc) — model-psychology LLM wiki
- [sorted-studs.cyberchitta.cc](https://sorted-studs.cyberchitta.cc) — AI-powered LEGO sorting machine

## What this is

A versioned, Eleventy-aware design system. It contains:

- **`voice.md`** — house voice, attribution, surface registers, editorial discipline. Read this before drafting or copyediting.
- **`visual.md`** — visual brief. Look, layout, motion, philosophy (*Less is More*), anti-patterns, iconography rules. Read this before designing.
- **`SKILL.md`** — router entry for AI tools. Delegates to one of eight child skills under `skills/`: `design-throwaway` (mocks / decks / demos), `design-surface` (production site work), `wire-consumer` (first-time consumer wiring), `wire-deploy` (first-time Netlify deploy setup), `draft-article` (cold-start a new article), `copyedit` (edit an existing draft), `vibe` (house code style), `vidhi` (authoring house skills).
- **`tailwind.css`** — Tailwind v4 + DaisyUI build entry. Multi-source `@source` scan covers SG plus every sibling consumer repo. Compiled to:
- **`dist/styles.css`** — the canonical CSS bundle, served via jsDelivr to every consumer.
- **`colors-and-type.css`** + **`ui-kit.css`** — the source CSS imported by `tailwind.css`. Tokens (light + dark), semantic element styles, and the wiki design vocabulary.
- **`eleventy/index.js`** — Eleventy plugin entry. Registers `sgHelpers` as global data.
- **`eleventy/primitives/*.ejs`** — design primitives. Header, chrome, footer, article-list, sub-site-bar, status-badge, entry-title-row, provenance, outbound-action, section-title are canonical; article-card, article-view, hero, collaborator-chip ship as samples.
- **`eleventy/helpers.js`** — date formatters, slug lookups, inverse-collection helpers, section folding.
- **`eleventy/section-title-transform.js`** — factory for rewriting wiki H2 titles into the `.group-header` shape with optional list classes.
- **`eleventy/custom-element-renderer.js`** — exported factory for any consumer that wants to register its own HTML-tag namespace.
- **`assets/`** — canonical CC mark assets (SVG + PNG), served via jsDelivr.
- **`examples/index.html`** — static rendered preview, for visual reference.

## What this is NOT

- Not a styled-component library. There is no JS runtime; you bring the framework.
- Not a Tailwind plugin in the traditional sense. SG ships a *compiled* bundle that already includes Tailwind utilities (tree-shaken across listed consumers) plus DaisyUI plus the SG semantic vocabulary.

---

## How consumers wire it in

Three things flow from SG to consumers:

1. **The compiled CSS bundle** at `dist/styles.css`, served via jsDelivr at `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@<tag>/dist/styles.css`. Loaded in the browser via `<link>`.
2. **Brand assets** — `assets/cc-260508.svg`, `cc-260508.png` — served via jsDelivr at the same `@<tag>` base. Used for favicon, header logo, OG fallback for brand-marked articles.
3. **The Eleventy plugin** at `@cyberchitta/supramental-gold/eleventy`. Provides shared helpers and exposes the primitives directory. Used at build time.

The wiring runbook — plumbing pieces, config, checklist — is the
`wire-consumer` skill (`skills/wire-consumer/SKILL.md`); page-level
authoring doctrine is its `references/site-authoring.md`. This README
deliberately doesn't duplicate them.

---

## Releasing SG (maintainer workflow)

When SG source changes — any primitive, helper, CSS, or asset — release a new tagged version:

```bash
# 1. Make source changes.
# 2. Rebuild the bundle — Tailwind class-set may have shifted.
bun run build:css
# 3. Bump version in package.json.
# 4. Commit (include dist/styles.css, package.json, and source).
git add -A && git commit -F .commit-msg
# 5. Tag and push.
git tag <vX.Y.Z>
git push origin main
git push origin <vX.Y.Z>
```

The `build:css` step is mandatory: a release without a rebuilt bundle ships old utilities at the new tag URL, and consumers see class-name drift.

After publishing, in each consumer:

```jsonc
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#<vX.Y.Z>"
```

```bash
bun install
# verify the build picks up new primitives + new jsDelivr URLs
git add package.json bun.lock && git commit
```

CI uses `--frozen-lockfile`, so the `bun.lock` update must commit together with the `package.json` change.

---

## Dev-testing against unpublished SG changes

`sg.js` requires a `#tag` (or branch / commit SHA) on the dep ref to derive a version. A `file:` dep emits malformed jsDelivr URLs (`@file:../...`) — intentional fail-loud, easy to spot.

To test SG changes against a consumer without cutting a real release, use **pre-release tags or commit SHAs**:

**Pre-release tag (recommended):**

```bash
# in SG
git tag <vX.Y.Z>-rc1
git push origin <vX.Y.Z>-rc1
```

```jsonc
// in consumer
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#<vX.Y.Z>-rc1"
```

`bun install`, build, verify. Iterate by tagging `-rc2`, `-rc3`, etc. When happy, tag the same commit as `<vX.Y.Z>` and bump consumers. Tags are immutable on jsDelivr — no cache surprises.

**Commit SHA:**

```jsonc
"@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#abc123def"
```

Same immutability guarantee, noisier dep ref.

**Branch ref (avoid for testing):** jsDelivr caches branch refs for ~12 hours. Use tags or SHAs instead.

---

## Project shape

```
supramental-gold/
├── README.md                ← you are here
├── voice.md                 ← house voice + editorial discipline
├── visual.md                ← visual brief (look/layout/anti-patterns)
├── SKILL.md                 ← AI-skill router; delegates to children under skills/
├── skills/
│   ├── design-throwaway/SKILL.md   ← mocks, decks, demos via CDN
│   ├── design-surface/SKILL.md     ← production design on a wired consumer
│   ├── wire-consumer/SKILL.md      ← first-time consumer wiring
│   ├── wire-deploy/SKILL.md        ← first-time Netlify deploy setup
│   ├── draft-article/SKILL.md      ← cold-start a new article
│   ├── copyedit/SKILL.md           ← edit an existing draft
│   ├── vibe/SKILL.md               ← house code style
│   └── vidhi/SKILL.md              ← authoring house skills
├── CLAUDE.md                ← handoff notes
├── NOTES.md                 ← decision rationale + reconciliation log
├── LICENSE                  ← MIT
├── package.json
├── tailwind.css             ← bundle source
├── colors-and-type.css      ← tokens + base type
├── ui-kit.css               ← component styles + wiki vocabulary
├── dist/
│   └── styles.css           ← compiled bundle (committed; served via jsDelivr)
├── assets/
│   ├── cc-260508.svg/.png   ← canonical CC mark
│   ├── cc-250815-v3.svg     ← source-of-mark working file
│   └── logo.svg             ← CSS-themable mark (used by examples/)
├── eleventy/
│   ├── index.js             ← plugin entry
│   ├── helpers.js           ← shared helpers
│   ├── section-title-transform.js
│   ├── custom-element-renderer.js
│   └── primitives/
│       ├── header.ejs       ← canonical (accepts brandLogoUrl)
│       ├── chrome.ejs       ← canonical (forwards brandLogoUrl)
│       ├── footer.ejs       ← canonical
│       ├── sub-site-bar.ejs
│       ├── status-badge.ejs
│       ├── entry-title-row.ejs
│       ├── provenance.ejs
│       ├── outbound-action.ejs
│       ├── section-title.ejs
│       ├── article-card.ejs ← sample
│       ├── article-view.ejs ← sample
│       ├── hero.ejs         ← sample
│       └── collaborator-chip.ejs ← sample
└── examples/
    └── index.html           ← static rendered preview
```

## Naming

The system is **Supramental Gold**. The brand it dresses is **CyberChitta**:
- *Supramental Gold* names the design system / repo / npm package.
- *CyberChitta* is the wordmark rendered on every surface that uses the system.

## License

MIT — see `LICENSE`.

---

*सत्यमेव जयते • vincit omnia veritas*
