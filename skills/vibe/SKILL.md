---
name: vibe
description: House coding guidelines for CyberChitta repos — universal code style (functional patterns, immutability, natural failure over validation, composition) plus per-language references for Python, JavaScript, and Jupyter. Use when writing or reviewing code in any CyberChitta repo; load the language reference that matches the file you're touching.
user-invocable: true
---

# vibe — coding guidelines (house craft)

The code half of the house craft. Companion briefs: `voice.md` (editorial),
`visual.md` (design), and the gestating `vibe.md` disposition brief
(`vibe-draft.md` — the spirit shared across all making; this skill is the
code-specific execution of it).

**Provenance:** ported 2026-07-12 from the `llm-context` rules
(`llm-context.py/.llm-context/rules/lc/sty-*.md`), which governed all
chat-era coding sessions across CyberChitta repos. The chat-era workflow
file (`ins-developer.md` — persona, response structure, `@llm-context`
commit format) was deliberately not ported: superseded by the Claude Code
harness and the CLAUDE.md commit conventions.

## Universal principles

### Functional approach

- Prefer functional over imperative patterns.
- Favor pure functions and immutable data structures.
- Design for method chaining through immutable transformations.
- Prefer conditional expressions over conditional statements when possible.

### Clarity

- Write self-documenting code through expressive naming — good names make
  comments superfluous.
- Compose complex operations through small, focused functions.

### Object design

- Keep constructors/initializers trivial; use static factory methods
  (typically `create()`) for complex construction.
- Methods return new instances rather than mutating state.
- Prefer immutable / frozen / sealed data structures.

### Error handling — natural failure over validation

- Validate at true application boundaries (user input, external APIs),
  not within internal functions.
- Don't add explicit checks for conditions that will naturally cause
  failures — let the language's built-in error mechanisms work.
- Internal functions assume valid inputs and fail fast; trust that calling
  code has met preconditions. No defensive programming in core logic.
- Create clear contracts between functions.

### Architecture

- Favor composition over inheritance.
- Avoid static dependencies — use dependency injection for testability.
- Keep pure logic separated from side effects.

## Self-check before writing code

1. **Functional patterns** — pure functions? New data instead of mutation?
2. **Naming** — concise but expressive? (Red flag: verbose parameter names
   like `coverage_threshold` where `threshold` reads fine in context.)
3. **Immutability** — frozen structures? Chainable operations?
4. **Simplicity** — comprehensions / functional idioms over nested
   conditionals and imperative loops; guard clauses over nesting.
5. **Types** — parameters and returns typed; no vague `Any`.

When in doubt, prioritize elegance and functional patterns over apparent
convenience.

## Language references

Load the one matching the file you're touching:

- `references/python.md` — Pythonic patterns, `@dataclass(frozen=True)`
  default, type hints, import organization, idioms.
- `references/javascript.md` — modern features, named exports,
  `Object.freeze()`, async/await, naming conventions, JSDoc.
- `references/jupyter.md` — cell structure, markdown-over-comments,
  jaxtyping shape annotations.

## Feedback

Same contract as every SG child: friction observed during use goes to
`TODO.md` § "Friction observed (from live skill use)" — dated entry, N>1
before the fix lands here. A language whose conventions recur across
sessions (Elixir, shell, …) earns a new reference file the same way.
