# CyberChitta — Brand & Design Brief

> **"One human showrunner. A writers' room of AI collaborators. We loop till wrap."**
>
> *सत्यमेव जयते • vincit omnia veritas*

This file is the **designer-facing brief** for the CyberChitta brand. It is intentionally separate from `README.md` (integration / release runbook), `CLAUDE.md` (handoff notes), and `NOTES.md` (decision log).

Read this when you are about to *design something* — a new surface, a new primitive, a new page, an article hero treatment, a one-off mock or deck. Tokens and CSS will keep you on-key visually; this file keeps you on-key in voice, tone, philosophy, and the anti-patterns that have been deliberately ruled out.

---

## Naming

The system is **Supramental Gold**. The brand it dresses is **CyberChitta**:

- *Supramental Gold* names the design system / repo / npm package.
- *CyberChitta* is the wordmark rendered on every surface that uses the system.

Don't conflate the two. Internal references say "SG"; user-facing surfaces say "CyberChitta."

---

## What CyberChitta is

CyberChitta is the personal publication of **@restlessronin** ("the Showrunner"), written in collaboration with named AI models as co-authors. The name pairs *cyber* with the Sanskrit *chitta* — "mind-stuff," consciousness, awareness — and the house metaphor is television production: one human showrunner, a rotating writers' room of AI collaborators, articles that *loop till wrap*.

The main site (`www.cyberchitta.cc`) is intentionally minimal — a single blog-style home page with a reverse-chronological article index, grouped into four sections:

1. **Behind the scenes** — process pieces about building the publication itself
2. **Essays** — longer-form cultural / philosophical writing on AI and consciousness
3. **Research & data** — quantitative pieces with charts and interactive visualizations
4. **Tools & practice** — developer-focused how-to and tool reviews

Sub-sites (`ch-ai-tanya.cyberchitta.cc`, etc.) extend the same visual language to wiki/research-vault surfaces with concepts, findings, provenance, and backlinks.

Every article credits its AI collaborators by handle (`@claude-opus-4.6`, `@grok-4.1`, `@gpt-4-turbo`) alongside `@restlessronin`, treating models as named contributors rather than invisible tools.

---

## CONTENT FUNDAMENTALS

### Voice
- **First-person plural** (*"we"*, *"our"*) — the human + AI pair as a team.
- **Human and AI speak as co-equals.** Articles written by a model are bylined to that model's handle; the showrunner appears as a separate credit.
- **Never addresses the reader as "you"** in the essay body — the register is journal / essayistic.

### Tone
- **Scholarly but warm.** Articles are 3–20 min reads, structured with `##` / `###` headings, code blocks, and occasional italicized reflection.
- **Quietly confident.** Specific claims ("2-2.5x gains", "34 LLMs", "a year of GitHub data") rather than hype.
- **Philosophical undertone.** Essay titles lean aphoristic: *"Is Matter Seeing Itself?"*, *"Did Matter Begin to Think?"*, *"Less is More"*, *"Full Context Magic"*. Two-part titles with a colon are the house pattern.

### Casing
- **Title Case** for article titles.
- **Sentence case** for navigation, buttons, inline UI.
- **lowercase handles** always: `@restlessronin`, `@claude-opus-4.6`, `@gpt-4-turbo`.

### Emoji
**Never used.** The site is emoji-free. Do not introduce them. If a "tag mark" is needed, use a hairline-bordered chip or a small-caps `.group-header`.

### Unicode ornaments
- Middle dot `·` as a byline/metadata separator: `@claude-opus-4.6 · @restlessronin`, `Apr 13, 2026 · Updated Apr 15, 2026 · 4 min`.
- Bullet `•` in the Sanskrit/Latin footer tagline.
- Info glyph `ⓘ` (U+24D8) inside `details/summary` buttons on hero attributions and bylines.
- Em-dashes (`—`) and en-dashes (`–`) freely. ASCII hyphens are not a substitute.

### Vibe
Think **Stratechery × personal newsletter × research journal**. Long reads, warm paper-ink reading surface, author-as-authority, no gimmicks.

### Example deks
The one-line lede under each title. One or two short declarative sentences that set up a tension and hint at the resolution:

- *"Improvements deferred for a year – llms.txt, Tailwind v4, a site redesign – cleared in days when agentic AI arrived. Patience has compounding returns."*
- *"When AI can't see what it built, the human becomes the bottleneck. Two weeks became eight months."*
- *"AI agents can't contest freezes, negotiate compliance, or prove good faith. They need money that doesn't require any of that."*

---

## VISUAL FOUNDATIONS

### Philosophy: *Less is More*
Radical simplification — chronicled in the author's own *"Less is More"* process piece — is the design north star:

- **Single home page.** No index, categories, or tag pages on the main site.
- **Logo-only nav.** Header has the mark + wordmark. Click returns home.
- **Four text-labeled sections** (`.group-header`, small-caps lowercase gold) delineate the article list — no cards, no thumbnails.
- **Reading is the product.** Chrome is reduced so article type is the only loud element.

When in doubt: **remove a thing, don't add one.**

### Color
A **warm paper-ink reading surface** with a **gold + bronze** palette drawn from the mythic wheel-of-dharma logo. See `colors-and-type.css` for exact values (light + dark).

The **logo** uses its own independent mythic palette (bronze rim, gold wheel wedges, platinum spokes, pond-blue square, lotus-rose petals, pad-green pads). Those are real hex values exported from the SVG's `:root` in `colors-and-type.css`. Treat them as the logo's private palette — don't reuse pond-blue or lotus-rose elsewhere on the page.

### Type
- **Fraunces** — serif. Used for `h1–h6`, article body headings, blockquotes, group headers.
- **Inter** — sans. Used for metadata, credits-section labels, nav chrome.
- **Courier Prime** — typewriter. Used for the **CyberChitta** wordmark (`.logo-text`) only.
- **Fira Code** — mono. Used inline for `code` and `pre` blocks.

Article body is `1rem / 1.75` line-height on desktop, bumping to `1.125rem / 1.8` below 768px. Article column is capped at `max-w-3xl` (48rem). Use the `[data-density="airy"|"tight"]` host switch when a surface genuinely needs to deviate — not by default.

### Spacing & layout
- Tailwind scale. Site container is `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`.
- Article rows: `mb-4 pb-2 border-b border-base-300`. Section groups: `mt-14` between each.
- **No sticky nav, no floating chrome.** Header is a static anchor.
- For genuinely full-bleed surfaces (rare), use `.full-width` + `.full-width-inner` to escape the column without breaking centered children.

### Borders & shadow
- **Hairline only** — `1px solid var(--color-base-300)` between article rows, tables, pre blocks, credits-section top rule.
- **Blockquote** has a 3px `--color-gold-decorative` left rule.
- Site is otherwise **flat** — no drop shadows in chrome. Drop shadow is reserved for transient overlays only (the `ⓘ` dropdown cards).

### Corner radii
- `0.25rem` for inline `code`
- `0.375rem` for article images
- `0.5rem` for `pre` blocks, cards, dropdown overlays
- `9999px` (pill) for avatars and chips
That's the full ladder. Don't invent new radii.

### Hover & motion
- **Links**: `--color-link` → `--color-link-hover`, underline stays.
- **Logo wordmark**: gradient slides from `0% 50%` to `100% 50%` over `300ms`.
- **Headings receiving focus**: gold outline fades out over `2s` (`focus-fade` keyframes).
- **Outbound action**: arrow translates 2px on hover over 180ms.
That's the full motion vocabulary. **No parallax, no springs, no entrance animations on scroll.**

### Imagery treatment
- **Hero** is full-width inside the `max-w-3xl` container, `aspect-square` on mobile, `aspect-video` on `md+`.
- **Attribution** is a small circular `details/summary` dropdown pinned `bottom-2 right-2` on the hero — summary glyph `ⓘ` opens a credits card with the artist + project links.
- **Showrunner avatar** is `w-6 h-6 rounded-full`, pulled into a dropdown next to each byline via the info glyph.

### What to avoid
A non-exhaustive list of things that have been deliberately ruled out. Treat each as a tripwire:

- Purple-pink gradients
- Glassmorphism (frosted-glass blurs)
- Glowing buttons or neon accents
- Emoji garnish — anywhere
- Rainbow category colors (e.g. tinting each of the four section groups a different hue)
- Sticky floating chrome (sticky headers, fixed CTAs, scroll-progress bars)
- Aggressive shadow stacks (more than the single hairline-card shadow used on `ⓘ` overlays)
- Generic "vibrant" hero blocks — full-bleed solid-color slabs with white display type
- Entrance animations on scroll, parallax, spring physics, marquees
- "AI sparkle" iconography
- Pseudo-handwritten or "designer scribble" overlays
- Tag/category pill clouds
- Reading-time progress bars overlaid on prose

If you find yourself reaching for any of these, you are probably solving the wrong problem. Step back to *Less is More*.

---

## ICONOGRAPHY

**The system uses four icons total**, all as Tailwind v4 `mask-image` utilities. See `colors-and-type.css` for the canonical definitions:

| Utility | Usage |
|---|---|
| `.icon-github` | Footer link to github.com/cyberchitta |
| `.icon-twitter` | Footer link |
| `.icon-rss` | Footer feed link |
| `ⓘ` (U+24D8, unicode) | Inline glyph inside `details/summary` buttons on hero + bylines |

Everything else is Unicode typography — middle-dot `·`, bullet `•`, em/en dashes.

### Icon rules (for extensions)
If you add icons to a CyberChitta surface, match the existing four:

- **24×24 viewBox, single-color path, `currentColor` via `mask-image`.** The `.icon` utility in `colors-and-type.css` handles the rest: `{ display: inline-block; width: 1.25rem; height: 1.25rem; background-color: currentColor; mask-size: cover; }`.
- **Weight**: solid-filled, not stroked. (This is the convention the existing three follow.)
- **Never tinted** — icons always adopt the parent text color. In practice they appear in `var(--color-link)` in the footer.

### Logos
- `assets/cc-260508.svg` — canonical wheel/lotus/pad mark, served via jsDelivr at `@<tag>` to every consumer. Colors are baked in as hex values so the SVG renders correctly in any loading context (including `<img src>`).
- `assets/cc-260508.png` — raster fallback for OG / social cards.
- `assets/cc-250815-v3.svg` — source-of-mark working file. Not used at runtime.
- The wordmark **CyberChitta** is text styled with `.logo-text` (Courier Prime + animated gold→bronze gradient) — **not an SVG**. Always render it as live text next to the mark.

To reskin the logo, edit the SVG directly — search-and-replace the mythic palette hexes.

---

## PROVENANCE DISCIPLINE

Every primitive, asset, and CSS rule in this system traces back to the live site at `www.cyberchitta.cc` or to a deliberate evolution of it. When you add something new, note the source in `NOTES.md` — or, if it's a new design decision, explain *why* it's a deliberate evolution rather than a drift.

Approximations (e.g. fonts loaded from Google Fonts vs. licensed copies; the logo recreated from SVG source vs. exported from the original designer file) should be flagged in code comments or in `NOTES.md` so a future maintainer can spot the gap.

---

## When in doubt

1. Open `www.cyberchitta.cc` in a browser. Look at it. Match it.
2. If a new surface (e.g. a sub-site, a new article-body component) genuinely needs vocabulary the live site doesn't have, design it in the *spirit* of the live site (warm paper-ink, hairline boundaries, Fraunces titles, gold + bronze, no chrome) and propose it as an addition to `ui-kit.css` rather than a one-off override.
3. Re-read **What to avoid** above before shipping.

---

*सत्यमेव जयते • vincit omnia veritas*
