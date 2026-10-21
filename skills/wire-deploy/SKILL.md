---
name: wire-deploy
description: Set up deploy for a CyberChitta consumer site, on Netlify or GitHub Pages. Netlify gets git LFS for binary assets, immutable cache headers on date-suffixed filenames, and the production-context step that copies headers into the publish dir. GitHub Pages gets an Actions workflow (site at the repo root, in a subdirectory, or its toolchain on a `site-build` branch that keeps JS out of the main tree), the custom domain, and the deploy-branch rule. One-shot setup; complements wire-consumer (which handles design plumbing).
user-invocable: true
---

For **first-time deploy setup** of a new CyberChitta consumer site. Pairs with `wire-consumer` (design plumbing); this one handles the deploy / asset side.

Two targets, both in production: **Netlify** (www, sorted-studs) — the four pieces below — and **GitHub Pages** (ch-ai-tanya, apodictic) — the *GitHub Pages* section further down. Pick by where the consumer deploys. The date-suffix filename convention (piece 4) is platform-agnostic.

## Netlify

### Read these first

1. **`www.cyberchitta.cc/.gitattributes`** — the canonical LFS list. Every Netlify consumer mirrors it; extend per-consumer for additional binary types.
2. **`www.cyberchitta.cc/.netlify/_productionHeaders`** — the canonical cache-header file. New consumers copy and customize the path globs.
3. **`www.cyberchitta.cc/netlify.toml`** — the canonical `[context.production]` block that copies the headers into `_site/_headers`.

### The four plumbing pieces

#### 1. `.gitattributes` — git LFS for binary assets

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

#### 2. `.netlify/_productionHeaders` — immutable cache rules

At the directory referenced by Netlify's `base = "..."` (repo root if `base` is unset):

```
/assets/images/**
  Cache-Control: public, max-age=31536000, immutable
```

Add one rule per asset tree that uses immutable (date-suffixed) filenames. Examples from live consumers:

- `www.cyberchitta.cc`: `/assets/images/**`, `/assets/data/vg-data/**/raw/**`, `/assets/data/geo-darshan/*.tif`
- `sorted-studs.cyberchitta.cc` (CAD subsite): `/assets/exhibits/**`

`max-age=31536000, immutable` is the standard cache-forever incantation (1 year max-age + the `immutable` directive signaling no revalidation). Pair this only with filenames that change when the content changes — see piece 4.

#### 3. `netlify.toml` — production-context copy step

```toml
[context.production]
command = "bun run build && cp ./.netlify/_productionHeaders ./_site/_headers"
```

Append the `cp` to whatever the consumer's normal `command` is. The headers file ends up at `_site/_headers` where Netlify reads it. (`.netlify/_productionHeaders` is the consumer's source-of-truth; `_site/_headers` is the build artifact.)

The production context replaces the default `command` for production builds only — staging / preview builds skip the cache-forever headers. Set deliberately if previews need different caching.

If the consumer uses a `base = "subdir"` in `[build]`, the `cp` paths resolve relative to that base — verify `.netlify/_productionHeaders` lives under the same base directory.

#### 4. Date-suffix filenames for immutable assets

Any asset served from a path covered by the immutable cache rule must change filename when its content changes — otherwise the cache-forever URL serves stale bytes indefinitely. Convention:

- **Format:** `<basename>-<YYMMDD>.<ext>` — e.g. `lego-scanner-tight-260507.webp`.
- **Hour precision:** `<basename>-<YYMMDDHH>.<ext>` — e.g. `lego-scanner-tight-26050702.webp` — when multiple revisions land in the same day.
- **Bump on meaningful change.** Regenerating with identical content does not warrant a new date; substantive content/visual changes do.
- **Per-publication, not per-build.** The build pipeline can write to a stable working name (e.g. `diverter.glb`); the human assigns the date stamp at publication time when copying / renaming into the immutable path.

For iterating artifacts (CAD exports, render proofs), keep the stable name during iteration and rename to `<basename>-<YYMMDD>.<ext>` at publication. Mention the convention in the consumer's `CLAUDE.md` so AI collaborators don't accidentally overwrite a published-date filename mid-iteration.

### Validating the Netlify wiring

After applying the four pieces:

1. `git lfs ls-files` (in the consumer repo) lists every binary that should be in LFS.
2. Run `bun run build` locally and verify `_site/_headers` is present in the build output with the expected rules.
3. Deploy to a Netlify preview; `curl -I https://<preview-url>/assets/<sample-immutable-path>` should return `cache-control: public, max-age=31536000, immutable`.
4. Sanity-check: a non-immutable path (e.g. `/index.html`) should NOT carry the cache-forever header.

## GitHub Pages

### Read these first

1. **`ch-ai-tanya/.github/workflows/pages.yml`**: the site at the repo root. Its `fetch-depth: 0` is there because its build reads `git log`. Drop it if yours does not.
2. **`apodictic/.github/workflows/pages.yml`**: the site in `site/`. It uses `defaults.run.working-directory: site`, uploads `site/_site`, and has a `paths:` filter so a commit outside the site does not redeploy.

### The workflow

Copy whichever of the two is closer. Both have two jobs. `build` runs checkout, `oven-sh/setup-bun`, `bun install --frozen-lockfile`, the build, `configure-pages` and `upload-pages-artifact` of `_site`. `deploy` runs `deploy-pages` in the `github-pages` environment. Permissions are `contents: read`, `pages: write` and `id-token: write`, and nothing else. The job references no secrets: the deploy authenticates by OIDC.

### Repo settings (the owner, once)

- **Pages source: GitHub Actions.** ch-ai-tanya's Pages API reads `build_type: workflow`.
- **Custom domain in the Pages settings, not in a `CNAME` file.** A workflow deploy ignores the file. ch-ai-tanya has none, and its domain is in the settings (API read, 2026-10-21). DNS: a CNAME record `<sub>.cyberchitta.cc` → `cyberchitta.github.io`, as both Pages sites have (`dig`, 2026-10-21). Then turn on Enforce HTTPS.
- **The `github-pages` environment deploys from `main` only.** That is ch-ai-tanya's only deployment-branch policy (API read, 2026-10-21). A workflow on any other branch fails at the deploy step until that branch is added under Settings → Environments → `github-pages`.

### What Pages does not do

- **No custom headers.** Everything is served with `cache-control: max-age=600` (`curl -I` of ch-ai-tanya, 2026-10-21). Pieces 2–3 have no Pages equivalent. Date-suffix names cost nothing, but they buy no cache-forever here.
- **No LFS by default.** `actions/checkout` fetches LFS objects only with `lfs: true`. Without it the artifact ships pointer files, the same failure jsDelivr has. Neither Pages consumer uses LFS yet.

### The toolchain on a branch of its own: `site-build`

For a repo whose main tree must carry no JS toolchain, e.g. selfcast, a Rust CLI that handles keys. The site's **words** stay on `main`, as markdown (and images) in a content folder: `site/` by default, or whatever the repo already uses (selfcast's site is in `docs/` today). They change in the same commit as the code they describe. Everything that **runs** lives on an orphan branch, `site-build`: `package.json`, the lockfile, `eleventy.config.js`, `_data/`, templates. Not `gh-pages`: that name means the branch Pages serves as-is in branch-publishing mode, so a later switch to that mode would publish the toolchain as the site. This is sorted-studs' orphan `live` branch turned around. There the branch holds what is published. Here it holds what builds it.

- `git switch --orphan site-build`. Edit it in a worktree: `git worktree add ../<repo>-site-build site-build`.
- **The workflow lives on `main`**, `.github/workflows/pages.yml`. A push runs only the workflows in the pushed commit, so a workflow on `site-build` would never see a content edit. Trigger it with `on: push: branches: [main]`, a `paths:` filter for the content folder and the workflow, and `workflow_dispatch`. A push to `site-build` runs nothing, so dispatch the workflow after a toolchain change.
- The build job checks out `site-build` (`ref: site-build`), then `main`'s content folder (a second `actions/checkout` with `path:` and `sparse-checkout:`), copies it into Eleventy's input directory, and builds as usual. The deploy runs from `main`, so the `github-pages` policy needs no change.
- **Which files are pages is the repo's call.** Eleventy renders every markdown file in its input. A working document that shares the content folder (selfcast's `docs/upstream-fixes.md`) is published unless `site-build`'s `.eleventyignore` names it.
- **One check holds the separation:** `main`'s own CI fails if `git ls-tree -r --name-only HEAD` lists a `package.json`, `bun.lock` or `node_modules` anywhere, or a `.js`, `.mjs`, `.cjs` or `.ts` file in the content folder. Eleventy executes those if they reach its input. Watch it go red once.
- **It does not isolate the machine.** A local `bun run build` runs every dependency's code as you, and a `0600` file is readable by you. Where the repo's secrets live on the developer's machine (selfcast's app keys under `~/.config/selfcast/keys`), build the site only in Actions, where the runner holds no keys and the job no secrets. Or build locally in a container that does not mount `$HOME`.

Asked for by the Showrunner for selfcast (2026-10-21), not yet run anywhere. The workflow's two-checkout build is unrun. Only the check above was seen green and red, in a scratch repo.

### Validating the Pages wiring

1. The Actions run is green, and `curl -sI https://<domain>/` returns 200 from `server: GitHub.com`.
2. `cmp` a served binary asset against the built file. This catches LFS pointers.
3. For the `site-build` layout: the tree check on `main`, and a content edit on `main` reaching the served page.

## If invoked without guidance

**GitHub Pages:** copy the closer workflow, then hand the owner the three settings (source, domain, branch policy). Use the `site-build` layout only where the repo's `CLAUDE.md` or the owner says its main tree must stay free of the site's toolchain.

**Netlify:** default to applying all four pieces, using:

- **Piece 1** (`.gitattributes`) at git repo root regardless of Netlify `base`.
- **Pieces 2 + 3** (`_productionHeaders` + `netlify.toml`) under the consumer's Netlify `base = ` directory if set, otherwise repo root.
- **Piece 4** (naming) documented in the consumer's `CLAUDE.md`; not a code change.

Ask the consumer once: which asset trees use immutable filenames? Default to `/assets/images/**` if unsure. Add additional trees as separate rules in `_productionHeaders`.

## Reporting friction

Same as the other SG skills — log gotchas in the SG repo's `_notes/NEXT_STEPS.md` under `## Friction observed (from live skill use)`.
