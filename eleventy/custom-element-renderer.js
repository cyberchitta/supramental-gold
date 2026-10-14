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
import fs from 'fs';
import helpers from './helpers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import createCustomElementScanner from './custom-element-scanner.js';

// SG's own eleventy dir, the fallback after the consumer's includes both for
// an element's template (a tag can register straight to
// `primitives/<name>.ejs`) and for EJS `include`s inside it. A consumer file at
// the same path shadows SG's.
const sgEleventyDir = path.dirname(fileURLToPath(import.meta.url));

export default function createRenderer(
  elementConfigs,
  includesRoot,
  context = {},
  contentParsers = {},
) {
  const roots = [includesRoot, sgEleventyDir];
  const templatePath = (templateName) => {
    const found = roots
      .map((root) => path.join(root, templateName))
      .find((p) => fs.existsSync(p));
    if (!found) throw new Error(`No template ${templateName} under ${roots.join(' or ')}`);
    return found;
  };

  return createCustomElementScanner({
    elementConfigs,
    contentParsers,
    renderTemplate: ({ templateName, data }) =>
      ejs.renderFile(
        templatePath(templateName),
        {
          ...data,
          ...context,
          // Same global Eleventy registers for page templates, so primitives
          // rendered here can call sgHelpers too (article-list's byline).
          sgHelpers: helpers,
        },
        { views: roots },
      ),
    onError: (err, { tagName, fullMatch }) => {
      console.error(`[sg] Error rendering <${tagName}>:`, err);
      return fullMatch;
    },
  });
}
