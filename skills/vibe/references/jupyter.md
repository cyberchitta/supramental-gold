# Jupyter notebook guidelines

Ported 2026-07-12 from `llm-context` `lc/sty-jupyter.md`.

## Cell structure

- One logical concept per cell (single function, data transformation, or
  analysis step).
- Cells execute independently where possible — no hidden dependencies.
- Execution order tells a clear story.

## Documentation pattern

- Markdown cells for descriptions, not code comments.
- Code cells contain zero comments — expressive code speaks for itself.
- Markdown covers *why* and *context*, not *what* and *how*.

## Type annotations

- Use `jaxtyping` (and similar) for concrete, descriptive signatures —
  array shapes, dtypes, constraints explicit:

  ```python
  from jaxtyping import Float, Int, Array

  def process_features(
      data: Float[Array, "batch height width channels"],
      labels: Int[Array, "batch"]
  ) -> Float[Array, "batch features"]:
  ```
