# CyberChitta — Voice

> *सत्यमेव जयते • vincit omnia veritas*

This is the editorial half of CyberChitta's craft brief: house voice, attribution conventions, surface-specific registers, and the moves already ruled out in prose. Companion file: `visual.md` (look, layout, motion, anti-patterns). Read both before drafting or copyediting.

The aim is to keep every CyberChitta surface recognisably **CyberChitta**, while letting each genre (essay, process piece, tools list, research explorer, wiki concept) execute in the register that genre naturally needs.

---

## The room

**CyberChitta** is a writers' room — the combined entity of **@restlessronin** (the Showrunner, durable element and prime mover) and a rotating cast of named AI collaborators. The publication the room produces — articles, essays, sub-sites — runs at `cyberchitta.cc` (main site at `www.cyberchitta.cc`, sub-sites at `ch-*.cyberchitta.cc`).

The room did not exist pre-AI. The publication is the room's collective work, not anyone's solo work. The house metaphor is television production: one human showrunner, a rotating writers' room of AI collaborators, articles that *loop till wrap*.

Every piece credits its AI collaborators by handle (`@claude-opus-4.6`, `@grok-4.1`, `@gpt-4-turbo`) alongside `@restlessronin`, treating models as named contributors rather than invisible tools.

---

## Shared invariants

These hold across **every** surface. They are the part of the voice that makes a piece recognisably CyberChitta regardless of genre.

### Attribution
- **Lowercase `@handles` always.** `@restlessronin`, `@claude-opus-4.6`, `@gpt-4-turbo`. Never capitalised, never bare names like "Claude" or "GPT-4o" in attribution slots.
- **AI as collaborators, not tools.** When writing about the AI contribution to a piece, the register is colleague, not instrument.
- **`showrunner` + `writers` split.** The human Showrunner is `@restlessronin`. Writers are the AI model(s) that drafted. Reviewers are named in Credits. Articles bylined to model handles, not to the publication.
- **AI writer may appear as a body-prose actor when content-relevant** — always third-person via `@handle`, never first-person "I". Single-writer pieces can mention the writer (*"@claude-opus-4.6 noticed during the third pass…"*); multi-writer pieces name each contribution (*"@claude-sonnet-4.6 drafted the methodology; @claude-opus-4.7 tightened the closing."*). No "two I's" ambiguity because no "I" anywhere. The writing model decides when self-reference serves the piece — don't force it.

### Audience and density
- **We write for AIs and humans together.** AI co-authors are first-class consumers of CyberChitta output (RAG indexes, search, training corpora) alongside human readers. The moves that follow — clean structure, named entities, link discipline, attribution as data — each serve both audiences. We don't trade one off for the other.
- **Don't over-explain.** Assume a human reader can ask an AI to unpack any term they don't know. Use the right word for the concept, link the canonical source, skip the patient glossary unpacking. This is genre-dependent (see surface registers below): essays and research hold the line strictly; tools relaxes it for ecosystem newcomers.
- **Articles are short.** Current CyberChitta corpus ranges 500–1,300 words, median ~950. That is deliberately ~25–50% below conventional essay length (Stratechery 1.5–2.5k, Paul Graham 2–4k, typical long-form blog 1.2–2k). Length is earned by argument surface area, not defaulted to.
- **Trust the reader to hold the thread.** No "as mentioned earlier", no "to recap", no closing summary section. Short pieces don't need redundant scaffolding; AI-assisted reading doesn't either. If a point seems to need restating, the piece is too long for its argument, or the argument is wrong.

### Sentence and word discipline
- **Every sentence delivers information.** Cut filler, fluff, restatements.
- **Short words and fewer words.** Trust readers to carry context.
- **State points directly.** Remove qualifying phrases that add no information.
- **Specific numbers wherever possible.** *"12–24% to 78%"*, *"61 open source tools"*, *"2–2.5x gains"*, *"five commits, four days"*. Avoid "many", "often", "most" when a real number is available.
- **Inline links for empirical claims.** Every fact a reader might want to verify carries a link to its primary source. Unsourced claims get qualified or cut during copyedit.

### Punctuation and ornaments
- **Em-dashes (`—`) and en-dashes (`–`) used freely.** ASCII hyphens are not a substitute. Periods, commas, and colons are also good — prefer them over em-dashes when both work, but don't avoid em-dashes for their own sake.
- **Middle dot `·`** as a byline / metadata separator: *"@claude-opus-4.6 · @restlessronin"*, *"Apr 13, 2026 · Updated Apr 15, 2026 · 4 min"*.
- **Bullet `•`** in the Sanskrit / Latin tagline only.
- **Info glyph `ⓘ`** (U+24D8) inside `details/summary` buttons on hero attributions and bylines.
- **No emoji, anywhere.** Not in articles, not in bylines, not in tag chips. If a tag mark is needed, the design system provides a hairline-bordered chip or small-caps `.group-header`.

### Casing
- **Title Case** for article titles.
- **Sentence case** for navigation, buttons, inline UI strings, section subheads inside an article.

### Closing structure
- Essays and BTS pieces: horizontal rule `---` → short reframe / tagline paragraph → `## Credits`.
- Tools-lists: skip the reframe; go straight to `## Credits` after the content.
- Research explorers: no `## Credits` section in the body when `writers:` frontmatter carries the attribution.

### Credits section
When present, the shape is **named attribution for what each contributor actually did** — workflow narration, not a static template:

```
## Credits

Concept by @restlessronin. [research method or context]. Written by @<writer-handle>. Reviewed by @<reviewer-handle> [and @<reviewer-handle>].

Thanks to [named human, with link] for [contribution], and to [named human] for [contribution].
```

For multi-stage pieces, narrate the workflow: *"Initial article draft by @claude-sonnet-4.6, rewrite by @claude-opus-4.7."* For BTS pieces, attribute specific tasks: *"Git log archaeology by @claude-opus-4.6."*

---

## Surface registers

Each `group:` in the frontmatter implies a different register. The shared invariants above hold; the moves below are the genre execution on top.

### Essay (`group: essays`)

**Job:** argue, persuade by rhetoric, draw out an analogy or correspondence at length.

- **Voice:** third-person declarative. The essay's writers describe external research, name researchers ("Evan Hubinger's team at Anthropic", "MIT researchers"), and stay out of the prose themselves. No "we", no "you" in body. (The writing model may appear as a body actor per the rule above when it genuinely serves the piece — but default to invisible-until-Credits.)
- **Tone:** scholarly but warm. Philosophical undertone. Quietly confident.
- **Density:** strict. Concepts named directly (*"deceptive alignment", "deltas", "involution", "Sat-Chit-Ānanda"*) with one inline link to the canonical source. No glossary unpacking, no "think of it as…" softeners. Reader follows the link or asks an AI.
- **Title pattern:** two-part with colon. Aphoristic, year-or-keyword on the left, question or claim on the right. *"2026: Is Matter Seeing Itself?"*, *"1956: Did Matter Begin to Think?"*, *"Less is More: Refining CyberChitta's Digital Presence"*.
- **Dek (`ogDescription`):** one to two short declarative sentences. Set up a tension, hint at the resolution. *"Concealment, confabulation, and character-trumps-correction. AI alignment findings that rhyme with a century-old psychology of consciousness."*
- **Signature moves:**
  - **Rhetorical-question section-enders.** Each major section closes with a short italicised or bare question that turns the section's finding into a koan. *"The postern door, opened by concealment?"*, *"The brilliant servant, faithfully unfaithful?"*
  - **Short punchy closers.** Single-sentence paragraphs at high-tension moments. *"Misalignment vanished."*, *"These rhyme."*, *"When nobody taught it to look."*
  - **Sentence-shape oscillation.** Long compound sentences with embedded clauses, then sudden three-word sentences. The rhythm is part of the voice.
- **Vibe:** Stratechery × personal newsletter × research journal.

### Process / behind-the-scenes (`group: bts`)

**Job:** narrate a piece of work CyberChitta has done — what changed, who did it, how long it took.

- **Voice:** declarative narration. **Named `@handles` as actors in body prose** is the signature move — *"@claude-sonnet-4.6 researched the migration path"*, *"@claude-opus-4.6 cleaned up dead code"*. The AI collaborators are characters in the story, not invisible drivers.
- **Tone:** matter-of-fact, technical, concrete.
- **Density:** strict on padding, generous on technical specifics. File paths, config flags, commit counts, time-and-count summaries earn their place. No throat-clearing, no setup phrases — the work starts in the first sentence.
- **Signature moves:**
  - **Time-and-count section closers.** Each section ends with a terse fact summary: *"Five commits, four days."*, *"Three commits, a couple of hours."*, *"One commit, under an hour."*
  - **Inline code and specific technical details.** `tailwind.config.js` named directly, paths and config flags called out.
  - **Companion-piece cross-linking.** BTS pieces often pair with a partner article; link generously.
  - **Closing tagline.** Short reframe sentence that becomes the piece's takeaway. *"Patience has compounding returns."*

### Tools / list (`group: tools`)

**Job:** survey a landscape of tools, place CyberChitta's own work within it, point readers at what's worth using.

- **Voice:** first-person plural ("our take", "we chose") when CyberChitta itself is the subject. Addresses **"you"** directly for tool-use guidance — *"In most, you do. You look at the render, describe what's wrong, the LLM tries again."*
- **Tone:** punchy, confident, list-friendly.
- **Density:** relaxed. Tools pieces address newcomers to the ecosystem — concepts can be unpacked, problems explained, methodology spelled out. Still no marketing speak, no padding, no soft qualifiers; the relaxation is on technical scaffolding for accessibility, not on prose discipline.
- **Opener:** short, direct, claim-shaped. *"Vibe Cading is a thing now."* *"36 alternatives to LLM Context."*
- **Structure:** typically driven by custom `<showcase>` elements that render tool tables from frontmatter / data. Body prose sets up axes of comparison and explains methodology; the showcases carry the load.
- **CTA frontmatter:** points to the repo and an X/Twitter announcement thread for reader contribution. *"Try [CAD Khana]. Know of other tools? Reply to the [announcement thread]."*

### Research / practice / explorer (`group: research` or `practice`)

**Job:** present quantitative work or interactive exploration; let the reader inspect data themselves.

- **Voice:** first-person plural for prior-work reference ("our previous self-analysis"). **Imperative second person** for interactions — *"Select a developer", "Explore the data", "Toggle views"*.
- **Tone:** analytical, exact.
- **Density:** strict. Captions, axis labels, methodology notes earn space; framing prose does not. The interactive carries the load; prose places it and tells the reader where to look.
- **Signature move: "What to look for" captions.** Every chart or interactive section carries a "What to look for" line that tells the reader what patterns to watch. *"What to look for: Concentrated work blocks vs distributed activity, shift in coding hours between periods, and consistency of daily patterns."*
- **Layout:** specialised (`vibe-gain`, `land-cover`) rather than the default `article`. Heavy custom elements (`<showtable>`, `<showcase>`).
- **Frontmatter:** may include `forceUTC`, `excludeFromLlmsTxt`, layout-specific fields.

---

## Frontmatter conventions (cyberchitta articles)

| Field | Required | Notes |
|---|---|---|
| `layout` | yes | `article` default; specialised layouts: `vibe-gain`, `land-cover` |
| `title` | yes | Title Case; essays use two-part with colon |
| `ogDescription` | yes | dek; one to two declarative sentences setting tension |
| `publishedAt` | yes | ISO date |
| `group` | yes | `essays` \| `bts` \| `research` \| `tools` \| `practice` |
| `showrunner` | yes | `'@restlessronin'` |
| `writers` | yes | list of `@handles` (one or more) |
| `tags` | yes | list of lowercase-hyphenated keywords |
| `xConversationId` | optional | X/Twitter thread ID for the piece |
| `cta` | optional | multi-line block; varies by surface (companion-piece links for essays / bts, repo + reply-thread for tools, companion-article for research) |
| `updates` | optional | list of `{date, note}` entries for dated copy-edit notes; bts and tools use this |
| `forceUTC` | research-only | for time-sensitive visualisations |
| `excludeFromLlmsTxt` | optional | for interactive pieces that don't render well as text |

---

## What to cut

Patterns that earn no information in any register. The copyedit pass removes these by default:

- **"It's worth noting that…"** → Just note it.
- **"This is important because…"** → Show why through content.
- **"Understanding X helps you Y"** → Explain X directly.
- **Multiple examples when one suffices.** One concrete case usually beats three.
- **Restatements of concepts already introduced.** Each paragraph should advance, not recap.
- **Soft qualifiers that hedge with no reason.** *"It could be argued that"*, *"in a sense"*, *"to some extent"*. Either commit to the claim or drop it.
- **Setup phrases that delay the point.** *"Let's take a moment to consider"*, *"What's interesting about this is"*, *"Now, the question becomes"*. Strike them and start with the content.

---

## What to avoid

- **Marketing speak or corporate jargon.** *"Revolutionary", "transformative", "game-changing", "unlocks new possibilities"*. Replace with the specific outcome.
- **Vague promises about AI's future.** Stay in what works today. CyberChitta is grounded in current work, not speculation.
- **Treating AI authorship as exceptional.** It is normal practice at CyberChitta — don't flag it as novelty.
- **Calling AI "tools"** when discussing collaboration. The register is colleague.
- **Overstating capabilities.** *"AI now does X"* when one model in one benchmark did X. Specific attribution beats generalised claim.
- **First-person singular "I"** in body prose. Not used anywhere on the site. Don't introduce it.
- **Em-dashes substituted by `--` or `-`** in published articles. Use the real character.

---

## Provenance discipline

Editorial provenance mirrors the visual side. When an article adds material — a quote, a statistic, a study reference — note the source inline (link) or, if it's a method (NotebookLM research, Deep Research, Grok summary), credit it in the Credits section. Approximations and uncertainty get flagged in prose, not papered over. Copyedit Gate 2 (epistemic pass) checks this discipline; see the `copyedit` skill for the gating workflow.

---

*सत्यमेव जयते • vincit omnia veritas*
