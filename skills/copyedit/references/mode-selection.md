# Mode selection — assembly vs compression

The first decision in any copyedit run. Picking wrong wastes passes: a structural pass on a draft that needs assembly produces a tidy-but-still-thin piece; a compression run on a thin draft strips muscle. The heuristic below is derived from two observed lineages:

- **`supramental-ai`** — build-and-shape. 86 commits, **net +75 churn**, 30 structure-flow commits. The draft formed in public; sections grew, transitions were filled in, then trimmed.
- **`witness-ai` lineage** — compression. 95 commits, **net –133 churn** (across `asuric-ai` + `impure-instrument` + `witness-ai`). Several large cuts (one section drop at –83 net, verbosity reduction at –16). The drafts arrived mature and got tightened.

The two articles needed opposite default behaviours from a copyedit run. The skill encodes that.

## Quick decision tree

Read the draft end-to-end once before deciding. Then:

```
Does the draft have a complete argument arc — intro, body, close, every section earning its place?
├── No → assembly
└── Yes
    ├── Does every section have one clear job, and does the argument flow without backtracking?
    │   ├── No → assembly (structural-first; may compress later sections)
    │   └── Yes
    │       ├── Is the prose loose, padded, or repetitive?
    │       │   ├── Yes → compression
    │       │   └── No
    │       │       └── Are claims grounded — citations, links, source attribution intact?
    │       │           ├── No → compression (epistemic-driven; cut what isn't sourced)
    │       │           └── Yes → still compression (micro polish), or skip if truly done
```

## Assembly indicators

- Sections marked `TODO` or `[fill in]`.
- Stub paragraphs ("This section will cover…").
- Argument leaps without transition.
- Single-paragraph sections that the table of contents suggests should be longer.
- Missing Credits, missing frontmatter fields.
- Outline-shaped rather than prose-shaped.
- Reader could finish a section and still not know what claim it was making.

## Compression indicators

- End-to-end readable; you can summarise the argument from memory after one read.
- Sentences that restate the prior sentence with slight variation.
- Paragraphs that hedge ("it could be argued", "in some sense", "to some extent") without committing.
- Multiple examples making the same point.
- Setup phrases that delay the point ("Let's take a moment to consider…", "What's interesting about this is…").
- High word count for the argument's actual surface area.
- Voice.md's "What to cut" list shows up repeatedly.

## Edge cases

**Hybrid draft.** Two or three thin sections inside an otherwise mature draft. Default mode is `compression` for the whole run; treat the thin sections as `assembly` exceptions and call them out in Section A of the output contract.

**Section reorder needed.** Doesn't decide mode by itself. Both modes start with a structural pass.

**Cited but bloated.** Compression. The epistemic pass will be light; the clarity pass carries the load.

**Citations missing throughout.** Could be either. Look at section completeness: if sections are also thin, assembly (the writer is still finding the argument). If sections are full, compression with an epistemic-heavy second pass (the writer has the argument but hasn't grounded it).

**Mode-mismatch on entry.** If the user says "tighten this" but the draft is clearly thin, push back before starting: *"This reads as an early draft — running compression now would strip needed scaffolding. Want me to assemble it first, then a separate compression pass?"* The user may have a reason (e.g. word-count cap they're working to), in which case proceed with compression but flag what's at risk.

## What the mode does NOT decide

- Pass order — always `structural → epistemic → clarity → linking → micro`. Mode never reorders.
- Whether to run a pass — every pass runs every time. Mode shapes how aggressive each pass is.
- Output contract — the four sections (A/B/C/D) are produced in both modes.

The mode shapes the **direction** of edits (net positive vs net negative) and the **bias** of each pass (expand-where-thin vs cut-where-loose). Everything else is invariant.
