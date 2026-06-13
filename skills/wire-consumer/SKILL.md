---
name: wire-consumer
description: Use this skill to set up a new CyberChitta consumer site that pulls Supramental Gold via npm dep-pin, _data/sg.js helper, the jsDelivr CSS bundle, and a Claude Code skill pointer. One-shot wiring; afterwards you use design-surface for ongoing design work.
user-invocable: true
---

For **first-time wiring** of a new consumer site (a new sub-site, a new sibling repo) into Supramental Gold. After this is done, ongoing design work uses `design-surface`. If you're producing a one-off mock and don't need the Eleventy plugin, use `design-throwaway` instead.

## Read these first

1. **`../../README.md § How consumers wire it in`** — the canonical wiring runbook. Three things flow from SG to consumers: the compiled CSS bundle (via jsDelivr), the brand assets (via jsDelivr), and the Eleventy plugin (via npm).
2. **`../../CLAUDE.md § Deployments`** — confirms what each consumer site is and where it deploys. Useful context when wiring a new one.
3. **`../../package.json`** — for the canonical `name`, `exports`, and the dep-pin format consumers reference.
4. **`references/eleventy-config.md`** — the universal `eleventy.config.js` wiring beyond the four basic pieces below: EJS-views shadowing, the SG plugin, the optional markdown-library override, template engines, and the SG-vs-consumer ownership split. **Read when setting up or debugging a consumer's Eleventy config.**
5. **`references/custom-elements.md`** — the **opt-in** `createCustomElementRenderer` contract: registering your own HTML-tag namespace, the optional content parser, the `.ejs` template locals, and the authoring rules (self-closing for content-less tags, the blank-line rule, markdown-table-as-content). **Read before adding a custom element to a consumer.** Site-specific elaborations (e.g. a text-mirror/llms.txt rendering of the same elements) are documented by that consumer, not here.

## The four plumbing pieces

A wired consumer has all four of these:

### 1. npm dep-pin in `package.json`

```json
"dependencies": {
  "@cyberchitta/supramental-gold": "github:cyberchitta/supramental-gold#<tag>"
}
```

Use a real tag (e.g. `v0.3.2`), never `main`. The tag is what every other piece derives from.

### 2. `_data/sg.js` deriving URLs from the pin

A small Eleventy data file that reads the pinned tag out of `package.json` and exposes jsDelivr URLs:

```js
import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const pinRef = pkg.dependencies['@cyberchitta/supramental-gold'];
const tag = pinRef.split('#')[1];
const base = `https://cdn.jsdelivr.net/gh/cyberchitta/supramental-gold@${tag}`;

export default {
  tag,
  cssBundleUrl: `${base}/dist/styles.css`,
  logoSvgUrl: `${base}/assets/cc-260508.svg`,
  logoPngUrl: `${base}/assets/cc-260508.png`,
};
```

Wire `sg.cssBundleUrl` into the consumer's `<head>` template; wire `sg.logoSvgUrl` into chrome / footer primitives.

### 3. Eleventy plugin registration

In the consumer's `eleventy.config.js`:

```js
import sgPlugin from '@cyberchitta/supramental-gold/eleventy';

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(sgPlugin);
  // ...
}
```

This registers `sgHelpers` as Eleventy global data (`formatDate`, `parentConcepts`, `findingBySlug`, etc.) and exposes the `eleventy/primitives/` directory for `<%- include('primitives/...') %>`.

### 4. Claude Code skill pointer

For consumers that use Claude Code, install a one-file pointer at `.claude/skills/supramental-gold/SKILL.md` so the SG router is discoverable by name. This is an editable-install pattern — edits to canonical SG skills propagate to every consumer on next invocation, no re-sync.

```bash
mkdir -p .claude/skills/supramental-gold
```

Then write `.claude/skills/supramental-gold/SKILL.md` with this content (copy the `description` field verbatim from the canonical SG root SKILL.md so the trigger blurb stays current):

```markdown
---
name: supramental-gold
description: <copy verbatim from supramental-gold/SKILL.md frontmatter>
user-invocable: true
---

This is a pointer. The canonical Supramental Gold skill lives in the sibling repo.

**Load and follow:** `../../../../supramental-gold/SKILL.md`

When the canonical SKILL.md or any child references a relative path, resolve it under the SG root:

- Children: `../../../../supramental-gold/skills/<name>/SKILL.md`
- Briefs: `../../../../supramental-gold/voice.md`, `../../../../supramental-gold/visual.md`
- Child references: `../../../../supramental-gold/skills/<name>/references/<file>.md`

When a child SKILL.md says `../../voice.md`, treat it as `../../../../supramental-gold/voice.md`.
```

**Sibling-checkout assumption.** The `../../../../supramental-gold/` path math counts four levels up from `.claude/skills/supramental-gold/SKILL.md`: out of the pointer folder, out of `.claude/skills/`, out of `.claude/`, out of the consumer repo, then sideways into `supramental-gold/`. If the consumer's checkout layout differs, rewrite the four `..`s accordingly — they're the only paths to update.

**Frontmatter drift surface.** Only the `description` field is duplicated; everything else is loaded from canonical. If the SG root SKILL.md's description changes meaningfully (rare), sweep `grep -r "description: Router for the CyberChitta" $HOME/GitHub/*/. claude/skills/supramental-gold/` to find pointers needing an update.

**Invocation.** After install, the user can invoke `supramental-gold` directly; the canonical router lists the six children (design-throwaway, design-surface, wire-consumer, wire-deploy, draft-article, copyedit) and Claude reads whichever child the task matches. No per-child pointer needed — lazy loading through the router is sufficient.

## Brand assets — never copy

The brand mark (`cc-260508.svg`, `.png`) is **always referenced via the jsDelivr URL from `sg.logoSvgUrl`**, never copied into the consumer repo. The dep-pin tag is the source of truth for which version each consumer ships.

If the consumer needs a favicon, derive it from the jsDelivr SVG at build time or use the jsDelivr URL directly via `<link rel="icon">`. Don't commit a copy.

## Verifying the wiring

After all four pieces land, smoke-check:

1. `npm install` resolves the dep-pin without error.
2. `<head>` renders the jsDelivr `<link>` with the pinned tag.
3. A page using `primitives/chrome` renders with the brand mark visible.
4. A page using `formatDate` from `sgHelpers` formats a date correctly.
5. From inside the consumer repo, Claude Code discovers the `supramental-gold` skill (it should appear in the user-invocable skills list and respond to invocation).

If pinning a different SG tag bumps everything correctly (CSS, mark, helpers all updated on the next deploy), the npm side is sound. The Claude Code pointer is independent of the dep-pin — it tracks the **filesystem checkout** of SG, not the tagged release. That's by design: editorial / design work happens against the working tree, not a tagged snapshot.

## If invoked without guidance

Ask the user:

1. New sub-site (e.g. `ch-<name>.cyberchitta.cc`) or a sibling repo with its own domain?
2. Does the consumer already have an Eleventy setup, or starting from scratch?
3. Which SG tag should we pin? (`git -C /Users/ad/GitHub/supramental-gold tag --sort=-v:refname | head -1` for the latest)
4. Will the consumer be edited via Claude Code? (If yes, also install the skill pointer; if not, the first three pieces are enough.)

Then walk the user through the plumbing pieces in order: `package.json` pin, `_data/sg.js`, plugin registration, Claude Code skill pointer (if applicable). After all are in place, switch to `design-surface` for any actual design work.
