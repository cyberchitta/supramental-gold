---
name: supramental-gold
description: Router for the CyberChitta design system and house craft — the studio of @restlessronin (Showrunner) and named AI collaborators, whose publication runs at cyberchitta.cc. Six task-specific child skills (design-throwaway, design-surface, wire-consumer, wire-deploy, draft-article, copyedit) and two craft briefs (voice.md, visual.md). Use this skill if you're not sure which child fits.
user-invocable: true
---

Supramental Gold is the design system **and editorial craft brief** that dresses the **CyberChitta** publication at `www.cyberchitta.cc` and its sub-sites (`ch-ai-tanya.cyberchitta.cc`, etc.).

This file is a **router**. For any actual work, invoke one of the child skills below.

## Pick a child skill

### Design

| Skill | Use when |
|---|---|
| **`design-throwaway`** | Producing a one-off artifact (slide, mock, prototype, deck, OG card, single-page demo). Pulls SG via the public CDN, doesn't need the Eleventy plugin. |
| **`design-surface`** | Production design work on a consumer site that already wires SG (`www.cyberchitta.cc`, `ch-ai-tanya`, etc.). Adding or modifying components, primitives, surfaces. |
| **`wire-consumer`** | First-time wiring of a new consumer site — npm dep-pin, `_data/sg.js`, Eleventy plugin registration. One-shot setup; afterwards switch to `design-surface`. |
| **`wire-deploy`** | First-time **Netlify** deploy setup — git LFS for binary assets, immutable cache headers, production-context `cp` step, date-suffix filename convention. Complements `wire-consumer`. Skip for GitHub Pages or non-Netlify targets. |

### Editorial

| Skill | Use when |
|---|---|
| **`draft-article`** | Cold-starting a new CyberChitta article from outline / brief / evidence pile. Produces a complete first draft (frontmatter, sections, Credits scaffold) in the right surface register. Hands off to `copyedit` after. |
| **`copyedit`** | Editing an existing draft — rewriting, tightening, clarifying, restructuring. Two modes (`assembly` / `compression`), five gated passes. Operates on a draft that already exists end-to-end. |

## The craft briefs

Both child design skills reference these:

- **`voice.md`** — house voice, attribution conventions, surface registers (essay / bts / tools / research), cut patterns, frontmatter conventions. Read before drafting or copyediting.
- **`visual.md`** — visual brief. Look, layout, motion, philosophy (*Less is More*), anti-patterns, iconography rules. Read before designing.

These are foundational and stable; child skills load them on demand.

## Other supporting files (loaded by child skills as needed)

- **`README.md`** — package contents, consumer wiring runbook, release workflow.
- **`NOTES.md`** — decision rationale and reconciliation log.
- **`CLAUDE.md`** — handoff notes for live deployments.
- **`colors-and-type.css`** + **`ui-kit.css`** — source CSS (tokens + components).
- **`eleventy/primitives/*.ejs`** — design primitives.
- **`eleventy/{index,helpers,...}.js`** — Eleventy plugin entry + helpers.
- **`assets/`** — brand mark (canonical `cc-260508.svg` / `.png`).
- **`dist/styles.css`** — compiled bundle served via jsDelivr.

## Reporting friction (do this — it's how SG improves)

If during use you observe something that tripped you up — a missing instruction, an unclear contract, a project-specific gotcha the skill should have warned about, a workflow shape the skill doesn't acknowledge — log it. Surface is `TODO.md` in the SG repo, under the `## Friction observed (from live skill use)` section (create the section if it does not yet exist).

Brief entry shape: date, child skill + step, what tripped, what should change. Example template:

```
### `<child-skill>` — YYYY-MM-DD, <article or task slug>

Session: <consumer site>, <invocation context>.

- **<one-line summary of what tripped>.** <One paragraph: what
  happened, what the skill said vs. what reality demanded, where
  the fix belongs (which file / which section).>
```

Do **not** edit the skill itself on the strength of one session — let evidence accumulate. The rule is N>1: same friction in at least two sessions before pushing the fix into the skill. The capture-now-edit-later split protects the skill from over-fitting to one article's shape.

This applies to all six children and to the router itself. If a child's hand-off contract is wrong, log it. If the router sends you to the wrong child, log it.

## If invoked without guidance

Ask the user one question:

> "Are you (a) producing a one-off artifact, (b) doing production design on an existing CyberChitta site, (c) setting up a new consumer site, (d) drafting a new article from scratch, or (e) editing an existing draft?"

Then hand off to `design-throwaway`, `design-surface`, `wire-consumer`, `draft-article`, or `copyedit` respectively.

---

*सत्यमेव जयते • vincit omnia veritas*
