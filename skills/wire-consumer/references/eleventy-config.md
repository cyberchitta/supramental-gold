# Wiring `eleventy.config.js`

What an SG consumer's `eleventy.config.js` sets up, beyond the four plumbing
pieces in `SKILL.md`. All of this is common to SG consumers; site-specific build
steps (a text-mirror pass, a client-side template precompiler, etc.) are the
consumer's own and aren't covered here.

1. **EJS plugin + views.** `addPlugin(ejsPlugin, { views: [<consumer>/src/_includes,
   <sg>/eleventy] })` — **consumer first**, so consumer files shadow SG defaults.
   This ordering is what makes consumer overrides of SG partials (e.g.
   `partials/site-analytics.ejs`, `partials/site-scripts.ejs`) actually resolve.
2. **SG plugin.** `addPlugin(sgPlugin)` — registers `sgHelpers` as global data,
   adds the `sgWrapCredits` + `sgRepositionFootnotes` HTML transforms, and amends
   Eleventy's default markdown library via `applyHousePlugins`.
3. **Markdown library (optional override).** Out of the box the SG plugin amends
   the default library, so most consumers need nothing. A consumer with custom
   markdown needs calls SG's `createHouseMarkdownLibrary` directly and
   `setLibrary('md', …)`. (The main site does this in `_data/markdown.js`, wrapping
   it with a `removeFirstHeading` step.)
4. **Template engines.** `markdownTemplateEngine: 'ejs'`,
   `htmlTemplateEngine: 'ejs'`. The markdown engine being EJS means a `.md` file
   runs through **EJS first, then markdown** — relevant to anything that authors
   EJS in markdown or post-processes the rendered HTML.
5. **Passthrough copy.** `src/assets/` and friends.
6. **Custom-element transform (optional).** Consumers that author custom
   HTML-tag elements register `createCustomElementRenderer` as a transform here —
   see `custom-elements.md`.

## What SG provides vs. what the consumer owns

**SG** (`@cyberchitta/supramental-gold/eleventy`): the plugin (`index.js`),
`createCustomElementRenderer`, `createHouseMarkdownLibrary` / `applyHousePlugins`,
the build-time `build-helpers.js` (`calculateReadingTime`,
`stripNonReadingSections` — keying off `## Credits` / `## Document History`),
template `helpers.js`, the `section-title` / `wrap-credits` / `reposition-footnotes`
transforms, and the `primitives/` + `layouts/`.

**The consumer**: `package.json` build scripts, `eleventy.config.js`,
`_data/sg.js` + `_data/site.js`, any custom-element templates and their content
parsers, and any site-specific build steps (text mirrors, precompilers, data
fetchers, minifiers).
