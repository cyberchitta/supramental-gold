// Custom-element renderer.
// Scans rendered HTML for registered custom-element tags and replaces
// each with the result of rendering the matching EJS template. Supports
// both paired (`<tag>...</tag>`) and self-closing (`<tag />`) forms.
// Per-tag content parsers are optional; the default is a no-op.
//
// This file is the canonical implementation for the CyberChitta design
// system. Both supramental-gold's plugin and any consumer that needs a
// renderer of its own (for site-specific tag namespaces) should use
// `createRenderer(...)` from here. The scan itself lives in
// `custom-element-scanner.js`, shared with non-HTML outputs.

import ejs from 'ejs';
import helpers from './helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import createCustomElementScanner from './custom-element-scanner.js';

// SG's own eleventy dir, exposed to templates as an EJS `views` fallback so a
// consumer's element template can `include('primitives/<name>')` directly.
const sgEleventyDir = path.dirname(fileURLToPath(import.meta.url));

export default function createRenderer(
  elementConfigs,
  includesRoot,
  context = {},
  contentParsers = {},
) {
  return createCustomElementScanner({
    elementConfigs,
    contentParsers,
    renderTemplate: ({ templateName, data }) =>
      ejs.renderFile(
        path.join(includesRoot, templateName),
        {
          ...data,
          ...context,
          // Same global Eleventy registers for page templates, so primitives
          // rendered here can call sgHelpers too (article-list's byline).
          sgHelpers: helpers,
        },
        { views: [includesRoot, sgEleventyDir] },
      ),
    onError: (err, { tagName, fullMatch }) => {
      console.error(`[sg] Error rendering <${tagName}>:`, err);
      return fullMatch;
    },
  });
}
