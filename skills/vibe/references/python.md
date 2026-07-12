# Python guidelines

Ported 2026-07-12 from `llm-context` `lc/sty-python.md`.

## Pythonic patterns

- Use list/dict comprehensions over traditional loops.
- Leverage tuple unpacking and multiple assignment.
- Use conditional expressions for simple conditional logic.
- Prefer single-pass operations: `sum(x for x in items if condition)` over
  separate filter+sum.

## Type system

- Comprehensive type hints throughout.
- Import types from `typing` as needed.
- Specific types: `list[str]` not `list`, `dict[str, int]` not `dict`.

## Class design

- `@dataclass(frozen=True)` as the default for all classes.
- Trivial `__init__`; delegate complex construction to `@staticmethod create()`.
- Design for immutability to enable functional composition.
- `@property` for computed attributes.

## Import organization

- Imports at module top; never function-level except documented
  lazy-loading scenarios.
- Order: standard library, third-party, local modules.
- PEP 8 naming: snake_case for functions/variables, PascalCase for classes.

## Idioms

- `isinstance()` for type checking.
- `enumerate()` and `zip()` for iteration.
- Context managers (`with`) for resource management.
- `pathlib.Path` over string path manipulation.
