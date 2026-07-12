# JavaScript guidelines

Ported 2026-07-12 from `llm-context` `lc/sty-javascript.md`.

## Modern features

- Array methods (`map`, `filter`, `reduce`) over traditional loops.
- Arrow functions for concise expressions.
- Destructuring assignment for objects and arrays.
- Template literals over string concatenation.
- Spread syntax (`...`) for array/object operations.

## Module system

- Named exports over default exports (better tree-shaking and refactoring).
- Consistent import/export patterns.
- Modules with clear, focused responsibilities.

## Object design

- `Object.freeze()` to enforce immutability.
- Simple constructors; static factory methods for complex creation.
- Class syntax for object-oriented patterns.
- Composition through mixins or utility functions.

## Asynchronous code

- `async/await` over Promise chains.
- Proper try/catch error handling.
- Error messages include: what failed, why, and suggested action.

## Naming

- kebab-case file names; PascalCase classes/constructors; camelCase
  functions/variables/methods; UPPER_SNAKE_CASE constants.

## Documentation

- JSDoc for public APIs and complex business logic, with parameter and
  return types.
