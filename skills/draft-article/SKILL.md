---
name: draft-article
description: Use this skill to produce a first complete CyberChitta draft from an outline, brief, or evidence pile. Cold start to assembled first-pass draft with frontmatter, sections, and Credits scaffold. Surface-aware (essay / bts / tools / research) — branches on the article's group:. Hands off to copyedit once a complete draft exists.
user-invocable: true
---

For **cold-start drafting** of a new CyberChitta article. Input: an outline, a brief, a pile of notes, a research summary, a draft-in-pieces. Output: one prose draft, end-to-end, in the right surface register, with frontmatter and a Credits scaffold. After that, hand off to `copyedit` for the gated tightening passes. If the draft already reads end-to-end, you're past this skill — go directly to `copyedit`.

## Read these first

1. **`../../voice.md`** — required. The surface registers (essay / bts / tools / research), shared invariants, attribution conventions, frontmatter table, and what to cut. Drafting without reading voice.md will produce text that fails copyedit pass 3.
2. **`../../visual.md`** — only if the draft will include visual elements (showcases, charts, primitives) where layout decisions inform prose framing. Otherwise skip.

The Credits and frontmatter shapes are in voice.md. Don't reinvent them.

## The build-and-shape pattern

The `supramental-ai` lineage gave us this skill's evidence base: **86 commits, +247/–172 (net +75), 30 structure-flow commits**. The article was found through revision, not written perfectly first time. This skill expects the same:

- A first draft is allowed to be loose, over-long, and uneven across sections.
- Net-positive churn at this stage is normal. Compression is `copyedit`'s job, not yours.
- Structural moves dominate — sections getting reordered, merged, split. Don't lock structure in early.

The goal is a **complete** first draft, not a polished one. Complete means: every section has prose (not a stub), the argument runs end-to-end, frontmatter is scaffolded, Credits names who did what.

## Workflow

### Step 1 — Pin the surface

Decide `group:` first. The choices and their voice are in voice.md § "Surface registers":

- **`essays`** — argue, persuade by rhetoric, draw out an analogy at length. Third-person declarative. Two-part title with colon.
- **`bts`** — narrate a piece of work the room has done. Named `@handles` as actors. Time-and-count closers. Companion link.
- **`tools`** — survey a landscape of tools, place CyberChitta's work in it. First-person plural for us, "you" for the reader. Showcase-driven.
- **`research`** / **`practice`** — present quantitative work or interactive exploration. Imperative second person for interactions. "What to look for" captions.

If the input doesn't make the surface obvious, ask before drafting. Drafting in the wrong register wastes a full run.

### Step 2 — Scaffold frontmatter

Use the table in voice.md § "Frontmatter conventions". At minimum:

```yaml
---
layout: article  # or vibe-gain / land-cover for research surfaces
title: ...
ogDescription: ...
publishedAt: <today, ISO>
group: <essays | bts | tools | research | practice>
showrunner: '@restlessronin'
writers:
  - '@<model-handle>'  # the writer(s) drafting this piece
tags:
  - lowercase-hyphenated
  - keywords
---
```

Add `cta`, `updates`, `xConversationId`, `forceUTC`, `excludeFromLlmsTxt` when relevant per voice.md.

Title and `ogDescription` may be placeholders at this stage. They get hardened during `copyedit` pass 4 (linking + packaging).

### Step 3 — Sketch sections

Write a one-line job per section. Order them in argument-flow order (which may not be the order the evidence arrived in). This is faster than drafting prose blindly and easier to throw away.

For each section, note:
- The one claim or finding the section delivers.
- The evidence that backs it (links, citations, named sources).
- The transition into the next section.

### Step 4 — Draft prose, section by section

Run section-by-section. Don't try to draft the whole article in one pass. For each section:

1. Write the opener in the surface's register (punchy claim for tools, declarative setup for essays, named-actor lead for bts, etc.).
2. Body — deliver the claim, ground it in evidence with inline links.
3. Closer in the surface's register:
   - **essay** — short rhetorical question, italicised or bare, that turns the section's finding into a koan.
   - **bts** — terse fact summary ("Five commits, four days.").
   - **tools** — pivot to the next axis or the showcase that carries the data.
   - **research** — "What to look for" caption on any chart or interactive.

Pull from voice.md § "Surface registers" → the relevant subsection for the signature moves of the chosen surface.

### Step 5 — Scaffold Credits

Use the shape in voice.md § "Credits section":

```
## Credits

Concept by @restlessronin. <research method or context if applicable>. Written by @<writer-handle>. Reviewed by @<reviewer-handle>.

Thanks to <named human, with link> for <contribution>.
```

Narrate the workflow if multi-stage (*"Initial draft by @claude-sonnet-4.6, rewrite by @claude-opus-4.7."*). For bts pieces, attribute specific tasks (*"Git log archaeology by @claude-opus-4.6."*).

The Credits may name reviewers who haven't yet reviewed — that's fine; the showrunner fills them in before publish.

### Step 6 — Closing structure

Per voice.md § "Closing structure":

- **Essays and BTS** — horizontal rule `---`, then a short reframe / tagline paragraph, then `## Credits`.
- **Tools** — straight to `## Credits` after the content. Skip the reframe.
- **Research** — no `## Credits` section if `writers:` carries the attribution.

## What this skill does NOT do

- **Tighten or compress.** That's `copyedit`. A draft from this skill is expected to be loose.
- **Verify every citation.** Add citations as you draft, but exhaustive epistemic verification is `copyedit` pass 2.
- **Polish micro details.** Em-dash discipline, lowercase `@handle` sweep, terminology consistency — `copyedit` pass 5.

If you find yourself doing any of the above, you've drifted out of scope. Stop and hand off.

## Hand-off to `copyedit`

When the draft is complete (every section has prose, frontmatter is filled, Credits is scaffolded), stop. Tell the user:

> Draft complete. Recommend running `copyedit` in `assembly` mode — there will be structural reorders and tightening to do, and some sections likely need more grounding.

Don't run `copyedit` in the same session unless the user asks; the two skills are separate runs with separate output contracts.

## If invoked without guidance

Ask the user:

1. What's the input — outline, brief, evidence pile, draft-in-pieces? Where is it?
2. Which surface (`group:`) — essay, bts, tools, research? If unsure, describe what the piece is doing and I'll suggest.
3. Who's the writer (which `@<model-handle>` carries the byline)? Single-writer or multi-writer draft?
4. Any specific reference articles to anchor the register against? (E.g. *"essay, like supramental-ai"* or *"bts, like the witness-ai BTS piece"*.)

Then walk the six steps in order. State the surface explicitly at the top of the output so the user can redirect early if you've picked wrong.

---

*सत्यमेव जयते • vincit omnia veritas*
