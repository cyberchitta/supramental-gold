---
name: vidhi
description: House craft for authoring and maintaining Claude skills across CyberChitta repos — anatomy conventions, the engine/domain-pack and router/child splits, and the mandatory feedback loop (capture surface, entry shape, two-speed promotion). Use when writing a new SKILL.md, restructuring an existing skill, or adding the self-improvement loop to a skill that lacks one.
user-invocable: true
---

# vidhi — writing skills (house craft)

*Vidhi* (विधि): procedure, method, rule. A skill is a codified vidhi.

A skill is a living procedure, not documentation — every session that uses one
should be able to leave it better than it found it. This file codifies what our
skills share, distilled from the live exemplars:

- **supramental-gold** (this repo) — router + eight task children; friction log in `TODO.md`.
- **cad-khana** `skills/cad-khana/` — single deep skill + `references/`; feedback → gitignored `field-notes.md`.
- **geo-darshan** `.claude/skills/cluster-labeling{,-auroville}/` — engine + AOI pack; corrections loop per run dir.

Read the nearest exemplar before writing; don't design skill structure from
scratch.

## Anatomy

- **Frontmatter `description` is the trigger, not a summary.** Third person,
  says what the skill does *and* when to invoke it ("Use when…"), names its
  complement skills ("pairs with X", "load together with Y"). This is the only
  text the router/model sees before deciding to load the file — write it for
  that decision.
- **Point, don't duplicate.** A skill references canonical files ("Read these
  first") rather than copying their content. One source of truth per fact;
  the skill holds the *procedure* and the *pointers*.
- **State the consumption contract.** What the skill consumes vs. produces,
  and who produces the inputs. If inputs are missing, the instruction is
  "stop and point at the producer", never "reimplement it here".
- **Hard-won rules carry their incident.** A methodology rule states the *why*
  in one parenthetical ("a heavy tint turned a coconut grove into scrub") —
  that's what stops a future session from relitigating it.
- **Absolute dates everywhere.** "2026-07-05", never "last week".

## Structural splits (pick by shape)

- **Router + children** (SG): one lazy-loading router, task-scoped children.
  Use when one domain has several distinct workflows. The router carries the
  pick-a-child table and the friction-reporting contract; children carry work.
- **Engine + domain pack** (geo-darshan): an agnostic procedure skill plus a
  per-domain pack holding paths, priors, references, and state/history. Use
  when the same procedure will run over multiple domains/AOIs/sites. State
  lives in the pack, never the engine.
- **Single deep skill + `references/`** (cad-khana): one SKILL.md with
  progressive-disclosure reference files. Use for a library/tool where the
  workflows interleave too much to split.

## The feedback loop (mandatory)

Every skill ships with one. A skill without a feedback loop is frozen
documentation and will rot. Four elements:

1. **A capture surface separate from the skill file.** Somewhere cheap to
   append without touching the skill: SG uses `TODO.md` ("Friction observed"
   section), cad-khana a gitignored `field-notes.md` (issues when installed
   from git), geo-darshan a per-run `corrections.md`. Pick the surface nearest
   to where the friction is felt.
2. **A low-friction entry shape.** Date, source (project / run / commit),
   observation (1–3 sentences: what surfaced, one-off or pattern?), suggested
   home (which file or section should absorb it — `still-unsure` is a valid
   answer). Log first, don't filter: a pattern only emerges from honestly
   recorded one-offs.
3. **Two-speed promotion.**
   - *Maintainer-confirmed corrections fold in immediately* — user feedback is
     ground truth, route it to its home before the session closes. A session
     that ends with an unrecorded surprise isn't done.
   - *Self-observed friction accumulates first* — one session's hunch gets an
     entry, not an edit; the same friction in a second session (N>1) earns the
     fix. This protects the skill from over-fitting to one task's shape.
4. **Tooling promotes on reuse.** Scripted helpers are a floor, not a ceiling —
   improvise the view/check/script the moment needs, and when an ad-hoc one
   earns a second use, graduate it into the skill's `scripts/` (or equivalent)
   with a line in the procedure. That's how every durable script started.

When adding the loop to an existing skill, add a short `## Self-improvement`
(or `## Feedback`) section naming the capture surface, the entry shape, and
the promotion policy — geo-darshan's `cluster-labeling` engine is the current
reference implementation of the full pattern.

## What to leave out

- Session-specific state (belongs in the domain pack, a HANDOFF, or the
  capture surface).
- Content another canonical file already owns (link it).
- Speculative workflow branches nobody has run — skills record what happened
  and survived, not what might.
