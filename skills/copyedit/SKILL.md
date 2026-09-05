---
name: copyedit
description: Use this skill to rewrite, tighten, clarify, or structurally refine a CyberChitta draft. Two modes — assembly (build/expand a thin draft) and compression (tighten a mature draft; opens with a cold-read clarity gate) — with a five-pass gated workflow (structural → epistemic → clarity → linking → micro). Register-aware: moves follow the piece's register (the shelf's default unless the HANDOFF records a deviation).
user-invocable: true
---

For **editing an existing CyberChitta draft**: rewriting, tightening, clarifying, restructuring, copyediting. Operates on `src/articles/*.md` (or `drafts/<slug>/*.md`) in `www.cyberchitta.cc`, `ch-ai-tanya`, and other consumer sites. If the article doesn't exist yet — only an outline, brief, or evidence pile — use `draft-article` first to get a first draft.

## Read these first

1. **`../../voice.md`** — house voice, attribution, shelf vs register, the registers (essay / bts / tools / prose-practice / explorer / wiki), the cut patterns, frontmatter conventions. **Required.** Every pass below tests against it.
2. **`references/mode-selection.md`** — the assembly-vs-compression heuristic. Read at the start of a run if mode isn't obvious from the user's request.
3. **`references/pass-checklists.md`** — concrete per-pass checklist. Load when you actually reach the passes, not at skill entry.

## Required first step — mode selection

Before editing **anything**, pick the mode:

- **`assembly`** — draft is underdeveloped, fragmented, or missing connective tissue. Net-positive edits expected. Use when sections are stubs, transitions are missing, or the argument arc isn't yet complete.
- **`compression`** — draft is complete but verbose, weakly grounded, or repetitive. Net-negative edits expected. Use when the piece reads end-to-end but is loose, padded, or under-cited.
- **If uncertain** — default to `compression`, run the structural pass, and switch to `assembly` only if coherence gaps remain.

State the mode explicitly at the top of the output. Mode shapes how every later pass interprets "improvement."

See `references/mode-selection.md` for examples and edge cases.

## The five gated passes (run in order)

Never skip a pass. Never run a later pass before an earlier one — a clarity rewrite over an unsupported claim is wasted work.

1. **Structural** — Reorder sections for argument flow. Eliminate duplicated ideas. One job per section. Section openers and closers carry the rhythm voice.md describes for the piece's register (rhetorical-question closers for essays, time-and-count for bts, short declarative reframes for prose practice, etc.).
2. **Epistemic** — Identify unsupported claims. Add citations, soften certainty, or remove. Verify quote attribution. **Flag uncertain factual claims explicitly; never silently rewrite them as facts.**
3. **Clarity + concision** — Apply voice.md's cut list (*"It's worth noting that…"*, *"This is important because…"*, soft qualifiers, restatements). Branch on the register for its moves: aphoristic short closers for essays, named-actor narration for bts, punchy claim openers for tools, named actors and artifacts as subjects for prose practice, "What to look for" captions for explorers. The register is the shelf's default unless the HANDOFF records otherwise — don't revert a recorded deviation.
4. **Linking + packaging** — Validate internal links, citations, CTAs. Tighten title / `ogDescription` / closing alignment. Check frontmatter against the table in voice.md.
5. **Micro copyedit** — Grammar, diction, punctuation. Em-dash discipline (real `—`, not `--` or `-`). Lowercase `@handle` attribution. Title Case for titles, Sentence case for section subheads. Final terminology sweep.

Detailed per-pass checklist: `references/pass-checklists.md`.

## Mode-specific behaviour

### `assembly` mode
- Allow net-positive edits to complete argument arc and transitions.
- Prioritise section completeness before aggressive trimming.
- Add missing connective framing and explicit claim scaffolding.
- Save aggressive cutting for a later `compression` run.

### `compression` mode
- **Cold-read gate first (before pass 1).** Spawn a cold-reader subagent given ONLY the draft and the links it contains — no notes pile, no sibling drafts, no briefs, no repo context. The editing session is always notes-saturated and structurally cannot see notes-dependence; a cold reader can (added 2026-07-12 after four BLOCKING clarity failures survived ten drafts and a graft pass on supramental-gold — see the cold-read entry in `_notes/NEXT_STEPS.md` § Friction observed). Report shape: exact quote → what the reader understood or failed to → BLOCKING / FOGGY / COSMETIC, closing with the reader's own two-sentence restatement of the thesis. Diagnosis only, no rewrites. Triage each finding with the showrunner before editing: gloss (+words) or cut (−words) — the cuts belong to this run anyway, and blockers often die by deletion.
- Bias toward net-negative edits. Removed text should outweigh added text by the end of the run.
- Remove redundancy, weak qualifiers, unsupported expansion.
- Preserve the core argument while reducing reader load and claim surface area.
- If a section can't be tightened without expansion, flag it and switch to assembly for that section only.

## Output contract

End every run with these four sections in this order (compression runs open with a fifth: **Cold read** — findings and their gloss/cut dispositions):

- **A. Changes by pass** — bullet list of what each of the five passes changed.
- **B. Unsupported claims** — what was removed, qualified, or flagged for the showrunner to verify.
- **C. Citations and links** — what was added, corrected, or removed.
- **D. Alternate title (optional)** — one alternate with a one-line rationale, only if the current title is weak or off-register.

If a pass made no changes, say "no changes" for that pass rather than omitting it. Visible nulls beat silent skips.

## Hand-off to `draft-article`

If during pass 1 (structural) you discover the draft is too thin to compress — entire sections missing, no argument arc — stop and hand back to `draft-article` in `assembly` mode. Don't try to draft new sections inside copyedit; that's outside this skill's scope.

## If invoked without guidance

Ask the user:

1. Which file? (path to the draft)
2. Mode preference, or should I infer from the draft state?
3. Any specific concern driving the edit (overlong, weak section, factual review, pre-publish polish)?
4. Register — the shelf's default from `group:`, unless the HANDOFF records a deviation. Confirm so I pick the right clarity-pass moves.

Then run mode selection (with reasoning) and execute the five passes in order.

---

*सत्यमेव जयते • vincit omnia veritas*
