---
name: supramental-gold
description: Router for the CyberChitta design system and house craft — the studio of @restlessronin (Showrunner) and named AI collaborators, whose publication runs at cyberchitta.cc. Five task-specific child skills (design-throwaway, design-surface, wire-consumer, draft-article, copyedit) and two craft briefs (voice.md, visual.md). Use this skill if you're not sure which child fits.
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

## If invoked without guidance

Ask the user one question:

> "Are you (a) producing a one-off artifact, (b) doing production design on an existing CyberChitta site, (c) setting up a new consumer site, (d) drafting a new article from scratch, or (e) editing an existing draft?"

Then hand off to `design-throwaway`, `design-surface`, `wire-consumer`, `draft-article`, or `copyedit` respectively.

---

*सत्यमेव जयते • vincit omnia veritas*
