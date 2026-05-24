// supramental-gold — Eleventy plugin entry.
//
// What this plugin does, by default:
//   - Registers the SG helpers as global data under `sgHelpers`.
//
// SG primitives (header, chrome, footer, sub-site-bar, status-badge,
// entry-title-row, provenance, outbound-action, section-title, plus
// the unregistered samples) are EJS partials, included via
// `<%- include('primitives/<name>', { ... }) %>`. Consumers expose
// SG's eleventy/ directory to EJS by passing `views` to the
// eleventy-plugin-ejs setup; the package's path is found via:
//
//   import path from 'path';
//   import { fileURLToPath } from 'url';
//   const sgRoot = path.dirname(
//     fileURLToPath(import.meta.resolve('@cyberchitta/supramental-gold/package.json'))
//   );
//   const sgEleventy = path.join(sgRoot, 'eleventy');
//   eleventyConfig.addPlugin(ejsPlugin, { views: [sgEleventy] });
//
// `createCustomElementRenderer` is exported for consumers that want
// HTML-tag-style authoring for their own primitives (e.g. the live
// site's <showcase>/<showtable>). SG itself doesn't use it.
//
// The plugin also registers a `wrapCredits` HTML transform so the
// canonical `## Credits` section gets its `.credits-section` wrapper
// (which SG's CSS targets) without each consumer wiring it up.

import createCustomElementRenderer from './custom-element-renderer.js';
import createSectionTitleTransform from './section-title-transform.js';
import wrapCredits from './wrap-credits.js';
import helpers from './helpers.js';
import { applyHousePlugins } from './markdown-library.js';

export {
  createCustomElementRenderer,
  createSectionTitleTransform,
  wrapCredits,
  helpers,
};

export default function supramentalGold(eleventyConfig, options = {}) {
  const { internalDomains = [] } = options;
  eleventyConfig.addGlobalData('sgHelpers', helpers);
  eleventyConfig.addTransform('sgWrapCredits', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      return wrapCredits(content);
    }
    return content;
  });
  // Amend eleventy's default markdown library with house plugins. Consumers
  // that call `setLibrary('md', ...)` themselves (e.g. live site's custom
  // wrapper) override this — they should use `createHouseMarkdownLibrary`
  // from `./markdown-library` to get the same shape on their own instance.
  eleventyConfig.amendLibrary('md', (md) => applyHousePlugins(md, { internalDomains }));
}
