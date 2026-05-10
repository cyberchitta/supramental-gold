// supramental-gold — Eleventy plugin entry.
// Registers the custom-element renderer for the SG primitive set
// (cc-header, cc-footer, sub-site-bar, status-badge, entry-title-row,
//  provenance, outbound-action, section-title) and exposes the helpers
// as global data under `sgHelpers`.
//
// Consumers that need additional tag namespaces (e.g. the live site's
// <showcase>/<showtable>) should call `createCustomElementRenderer`
// directly and register their own transform.

import path from 'path';
import { fileURLToPath } from 'url';
import createCustomElementRenderer from './custom-element-renderer.js';
import primitivesConfig from './primitives/config.json' with { type: 'json' };
import helpers from './helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRIMITIVES_ROOT = path.join(__dirname, 'primitives');

export { createCustomElementRenderer, helpers, primitivesConfig, PRIMITIVES_ROOT };

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @param {object} [options]
 * @param {object} [options.siteData]   Site metadata (title, tagline, etc.)
 *                                       passed into primitive templates as `data.site`.
 * @param {string} [options.transformName='sgPrimitives']
 * @param {object} [options.extraConfigs]   Extra tag→template entries merged into
 *                                           the default primitives map. Templates
 *                                           must live under `PRIMITIVES_ROOT`.
 */
export default function supramentalGold(eleventyConfig, options = {}) {
  const {
    siteData = {},
    transformName = 'sgPrimitives',
    extraConfigs = {},
  } = options;

  const config = { ...primitivesConfig, ...extraConfigs };
  const render = createCustomElementRenderer(
    config,
    PRIMITIVES_ROOT,
    { data: { site: siteData }, helpers },
  );

  eleventyConfig.addTransform(transformName, async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
      return await render(content);
    }
    return content;
  });

  eleventyConfig.addGlobalData('sgHelpers', helpers);
}
