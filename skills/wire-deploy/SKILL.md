---
name: wire-deploy
description: Set up a CyberChitta consumer site for Netlify deploy with git LFS for binary assets, immutable cache headers on date-suffixed filenames, and the production-context build step that copies headers into the publish dir. One-shot setup; complements wire-consumer (which handles design plumbing). Skip for GitHub Pages or other non-Netlify targets.
user-invocable: true
---

For **first-time deploy setup** of a new CyberChitta consumer site that targets **Netlify**. Pairs with `wire-consumer` (design plumbing); this one handles the deploy / asset side.

Skip this skill if the consumer deploys via GitHub Pages or any non-Netlify target — the `_headers` mechanism and the production-context `cp` step are Netlify-specific. The date-suffix filename convention is platform-agnostic and worth adopting either way (see piece 4).

## Read these first

1. **`www.cyberchitta.cc/.gitattributes`** — the canonical LFS list. Every Netlify consumer mirrors it; extend per-consumer for additional binary types.
2. **`www.cyberchitta.cc/.netlify/_productionHeaders`** — the canonical cache-header file. New consumers copy and customize the path globs.
3. **`www.cyberchitta.cc/netlify.toml`** — the canonical `[context.production]` block that copies the headers into `_site/_headers`.

## The four plumbing pieces

### 1. `.gitattributes` — git LFS for binary assets

At git repo root (not under any `base = ` subdir):

```
*.woff2 filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.tif filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.bmp filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
*.ico filter=lfs diff=lfs merge=lfs -text

netlify.toml merge=ours
```

Extend per consumer for new binary types:

- `*.glb` for sites with 3D model viewers (e.g. CAD subsites).
- `*.mp3` / `*.wav` for audio.
- `*.zip` / `*.tar.gz` for downloadable bundles.

The `netlify.toml merge=ours` line is the standard "don't merge our deploy config" guard — keeps branch syncs from clobbering deploy-context customizations.

If the repo already has binary assets in regular git history, run `git lfs migrate import --include="*.glb,*.png,..."` to move them. Files added after `.gitattributes` is in place go to LFS automatically on first `git add`.

### 2. `.netlify/_productionHeaders` — immutable cache rules

At the directory referenced by Netlify's `base = "..."` (repo root if `base` is unset):

```
/assets/images/**
  Cache-Control: public, max-age=31536000, immutable
```

Add one rule per asset tree that uses immutable (date-suffixed) filenames. Examples from live consumers:

- `www.cyberchitta.cc`: `/assets/images/**`, `/assets/data/vg-data/**/raw/**`, `/assets/data/geo-darshan/*.tif`
- `sorted-studs.cyberchitta.cc` (CAD subsite): `/assets/exhibits/**`

`max-age=31536000, immutable` is the standard cache-forever incantation (1 year max-age + the `immutable` directive signaling no revalidation). Pair this only with filenames that change when the content changes — see piece 4.

### 3. `netlify.toml` — production-context copy step

```toml
[context.production]
command = "bun run build && cp ./.netlify/_productionHeaders ./_site/_headers"
```

Append the `cp` to whatever the consumer's normal `command` is. The headers file ends up at `_site/_headers` where Netlify reads it. (`.netlify/_productionHeaders` is the consumer's source-of-truth; `_site/_headers` is the build artifact.)

The production context replaces the default `command` for production builds only — staging / preview builds skip the cache-forever headers. Set deliberately if previews need different caching.

If the consumer uses a `base = "subdir"` in `[build]`, the `cp` paths resolve relative to that base — verify `.netlify/_productionHeaders` lives under the same base directory.

### 4. Date-suffix filenames for immutable assets

Any asset served from a path covered by the immutable cache rule must change filename when its content changes — otherwise the cache-forever URL serves stale bytes indefinitely. Convention:

- **Format:** `<basename>-<YYMMDD>.<ext>` — e.g. `lego-scanner-tight-260507.webp`.
- **Hour precision:** `<basename>-<YYMMDDHH>.<ext>` — e.g. `lego-scanner-tight-26050702.webp` — when multiple revisions land in the same day.
- **Bump on meaningful change.** Regenerating with identical content does not warrant a new date; substantive content/visual changes do.
- **Per-publication, not per-build.** The build pipeline can write to a stable working name (e.g. `diverter.glb`); the human assigns the date stamp at publication time when copying / renaming into the immutable path.

For iterating artifacts (CAD exports, render proofs), keep the stable name during iteration and rename to `<basename>-<YYMMDD>.<ext>` at publication. Mention the convention in the consumer's `CLAUDE.md` so AI collaborators don't accidentally overwrite a published-date filename mid-iteration.

## Validating the wiring

After applying the four pieces:

1. `git lfs ls-files` (in the consumer repo) lists every binary that should be in LFS.
2. Run `bun run build` locally and verify `_site/_headers` is present in the build output with the expected rules.
3. Deploy to a Netlify preview; `curl -I https://<preview-url>/assets/<sample-immutable-path>` should return `cache-control: public, max-age=31536000, immutable`.
4. Sanity-check: a non-immutable path (e.g. `/index.html`) should NOT carry the cache-forever header.

## If invoked without guidance

Default to applying all four pieces, using:

- **Piece 1** (`.gitattributes`) at git repo root regardless of Netlify `base`.
- **Pieces 2 + 3** (`_productionHeaders` + `netlify.toml`) under the consumer's Netlify `base = ` directory if set, otherwise repo root.
- **Piece 4** (naming) documented in the consumer's `CLAUDE.md`; not a code change.

Ask the consumer once: which asset trees use immutable filenames? Default to `/assets/images/**` if unsure. Add additional trees as separate rules in `_productionHeaders`.

## Reporting friction

Same as the other SG skills — log gotchas in the SG repo's `TODO.md` under `## Friction observed (from live skill use)`.
