# Pass checklists

Concrete checks for each of the five gated passes. Run in order. Don't skip; if a pass has nothing to do, record "no changes" in the output contract rather than dropping it.

The voice rules these passes enforce live in `../../voice.md`. Surface-specific moves are in voice.md's "Surface registers" section — check the article's `group:` frontmatter to know which apply.

---

## Pass 1 — Structural

**Goal:** argument flows; each section has one job; no duplication.

- [ ] Every section has a single, statable job. (If you can't say it in one sentence, the section needs splitting or merging.)
- [ ] Sections appear in the order the argument needs, not the order they were written.
- [ ] No two sections cover overlapping ground. Merge duplicates; redirect references.
- [ ] Intro sets up the claim or tension that the close resolves. If they don't match, fix one of them.
- [ ] Section openers and closers carry the rhythm voice.md describes for the relevant surface:
  - **essay** — rhetorical-question or aphoristic short-sentence closer.
  - **bts** — time-and-count closer ("Five commits, four days.").
  - **tools** — short claim-shaped opener; closers point outward (CTA, repo, thread).
  - **research** — "What to look for" caption on each chart / interactive section.
- [ ] The article's `group:` matches what the structure is actually doing. If a piece tagged `essays` reads like `bts`, flag the mismatch.

**Assembly-mode emphasis:** add missing connective sections, write transitions, fill stubs.

**Compression-mode emphasis:** cut sections that don't earn their place, merge sections that pair, drop digressions.

---

## Pass 2 — Epistemic

**Goal:** every claim is either supported, qualified, or removed. No silent rewrites.

- [ ] Each empirical claim carries a link to its primary source, or is qualified ("according to one report…", "@<handle>'s reading was…"), or is cut.
- [ ] Quote attribution checked: the named person actually said this, in this context, in the source linked.
- [ ] Specific numbers verified against the cited source, not paraphrased from memory. (*"12–24% to 78%"*, *"5,000 hours"*, etc.)
- [ ] Soft certainty hedges added where the underlying evidence is weaker than the prose suggests ("appears to", "in this benchmark", "@<handle>'s reading").
- [ ] Strong certainty kept where evidence supports it; don't over-hedge as a tic.
- [ ] **Uncertain factual claims are flagged in prose or in Section B of the output**, never silently rewritten as facts. Surface them for the showrunner to verify.
- [ ] AI-attributed actions (in bts pieces, named-actor narration) match what actually happened. *"@claude-opus-4.6 noticed during the third pass…"* needs to correspond to a real moment.

**Assembly-mode emphasis:** add citations alongside new prose; don't write claims you can't source.

**Compression-mode emphasis:** cut unsupported claims rather than trying to retrofit citations.

---

## Pass 3 — Clarity + concision

**Goal:** every sentence delivers; surface register is on-key.

### Universal (every surface)

- [ ] Voice.md's "What to cut" list applied:
  - "It's worth noting that…" → just note it.
  - "This is important because…" → show why through content.
  - "Understanding X helps you Y" → explain X directly.
  - Soft qualifiers without function ("in a sense", "to some extent", "it could be argued").
  - Setup phrases that delay the point ("Let's take a moment to consider…").
  - Restatements of concepts already introduced.
- [ ] Short words preferred over long. Fewer words preferred over more.
- [ ] Concrete verbs and explicit referents. Resolve "this", "that", "it" when ambiguous.
- [ ] Specific numbers where available — replace "many", "often", "most" with the actual figure if the source supplies it.
- [ ] No first-person singular "I" in body prose anywhere.
- [ ] AI writers, if named in body prose, appear as `@handle` third-person, never as "I".

### Surface-specific (branch on `group:`)

**`group: essays`**
- [ ] Voice is third-person declarative. No "we" or "you" in body prose (except where explicitly setting up a question to the reader).
- [ ] Title is two-part with colon, aphoristic.
- [ ] At least one short punchy single-sentence paragraph at a high-tension moment.
- [ ] Section-end koan / rhetorical question pattern present where the section has a finding worth crystallising.
- [ ] Sentence-shape oscillation: long compound + sudden short.

**`group: bts`**
- [ ] `@handles` appear as actors in body prose, not just in frontmatter.
- [ ] Each major section closes with a time-and-count or similarly terse fact summary.
- [ ] Specific technical details called out: file paths, config flags, commit counts.
- [ ] Companion-piece cross-linking present if a partner article exists.

**`group: tools`**
- [ ] First-person plural ("our take", "we chose") when CyberChitta is the subject.
- [ ] Direct "you" address for tool-use guidance.
- [ ] Opener is short, claim-shaped, punchy.
- [ ] Body prose sets up comparison axes; `<showcase>` carries the data.
- [ ] CTA points to repo + announcement thread for reader contribution.

**`group: research` / `practice`**
- [ ] First-person plural for prior-work reference; imperative second person for interactions.
- [ ] "What to look for" caption on every chart / interactive section.
- [ ] Frontmatter includes layout-specific fields (`forceUTC`, etc.) where the layout needs them.

**Assembly-mode emphasis:** clarity passes on newly written prose. Don't over-tighten a draft that's still finding its register.

**Compression-mode emphasis:** cut hard. The clarity pass is where most of the net-negative churn lands.

---

## Pass 4 — Linking + packaging

**Goal:** the piece is discoverable, navigable, and frames itself correctly.

- [ ] Every internal link resolves. Every external link still loads (spot-check at minimum).
- [ ] Citations from pass 2 are formatted consistently (inline link vs footnote vs reference list — match the article's existing convention).
- [ ] Title aligned with `ogDescription` aligned with the closing paragraph. If they hint at three different pieces, fix at least two.
- [ ] `ogDescription` is one to two short declarative sentences setting tension; not a summary.
- [ ] Frontmatter complete against voice.md's table: `layout`, `title`, `ogDescription`, `publishedAt`, `group`, `showrunner`, `writers`, `tags`. Optional fields (`cta`, `updates`, `xConversationId`) included if relevant.
- [ ] `writers` list reflects who actually drafted. `showrunner` is `@restlessronin`.
- [ ] `tags` are lowercase-hyphenated.
- [ ] CTA block present where the surface convention calls for one (companion-piece links for essays / bts, repo + thread for tools, companion-article for research).
- [ ] Credits section shape matches voice.md: named attribution for what each contributor did, with the workflow narrated where it's multi-stage.

---

## Pass 5 — Micro copyedit

**Goal:** punctuation, casing, glyphs, terminology — the last 1% that separates published from drafted.

- [ ] Em-dashes are real `—` (U+2014), not `--` or `-`. En-dashes are real `–` (U+2013).
- [ ] Middle dot `·` used as byline / metadata separator only.
- [ ] No emoji anywhere.
- [ ] `@handles` are lowercase. No bare names ("Claude", "GPT-4o") in attribution slots.
- [ ] Title Case for article titles. Sentence case for nav, buttons, inline UI strings, section subheads.
- [ ] Terminology consistent within the article: pick one of "model" / "writer" / "collaborator" for a given reference type and use it throughout.
- [ ] Grammar / diction / punctuation final sweep.
- [ ] If `updates:` frontmatter present, append a new entry for non-trivial post-publish edits.

---

## When to stop

A pass is done when no further checks fire and no changes are pending. The whole run is done when all five passes are done and the output contract (A/B/C/D) is written. Resist the urge to loop back; if a later pass surfaces an issue that needs an earlier one, note it in the output and let the showrunner trigger a follow-up run.
