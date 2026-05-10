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

import createCustomElementRenderer from './custom-element-renderer.js';
import createSectionTitleTransform from './section-title-transform.js';
import helpers from './helpers.js';

export { createCustomElementRenderer, createSectionTitleTransform, helpers };

export default function supramentalGold(eleventyConfig) {
  eleventyConfig.addGlobalData('sgHelpers', helpers);
}
