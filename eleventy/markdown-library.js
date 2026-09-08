// House markdown library — the canonical CC article-markdown shape.
//
// Bundles the constructor options + plugins + transforms that complement
// SG-owned CSS and templates:
//   - `html: true, breaks: true, linkify: true` — house rendering defaults
//   - `class="link"` on every <a> → SG's `.link` styles apply uniformly
//   - `markdown-it-anchor` → heading IDs (linkable headings)
//   - `markdown-it-external-links` → new tab + noopener for off-site links
//   - `markdown-it-footnote` → `.footnotes` section that SG already styles
//   - build-time syntax highlighting via highlight.js → `.hljs-*` spans
//
// Two entry points:
//   - `createHouseMarkdownLibrary({ internalDomains })` — for consumers
//     that need a fresh markdown-it instance (e.g. live site's custom
//     `_data/markdown.js`, which wraps render with `removeFirstHeading`).
//   - `applyHousePlugins(md, { internalDomains })` — amends an existing
//     instance (used by SG's eleventy plugin to amend eleventy's default
//     markdown library for consumers that don't roll their own).
//
// `internalDomains` is the only site-specific bit — each consumer passes
// its own list so external-link detection works correctly.

import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItExternalLinks from 'markdown-it-external-links';
import markdownItFootnote from 'markdown-it-footnote';
import hljs from 'highlight.js/lib/core';
import graphql from 'highlight.js/lib/languages/graphql';
import lean4 from 'highlightjs-lean4';

const HOUSE_OPTIONS = { html: true, breaks: true, linkify: true };

// Registered once at module load, not per instance. Only the languages the
// corpus actually uses: `graphql` (llm-compare-shopify-api) and `lean4`
// (apodictic). Add a language when an article needs one — a speculative set
// is dead weight in every consumer's build.
hljs.registerLanguage('graphql', graphql);
hljs.registerLanguage('lean4', lean4);
// Articles fence Lean as ```lean, which is the Lean 3 name upstream; there is
// no Lean 3 in the corpus, so point it at the Lean 4 grammar.
hljs.registerAliases(['lean'], { languageName: 'lean4' });

// Returns the highlighted *inner* HTML and lets markdown-it wrap it in its own
// `<pre><code class="language-x">`. Returning a full `<pre>` would take over
// the wrapper (markdown-it skips its own when the string starts with `<pre`)
// and with it responsibility for escaping the language name out of the fence
// info string. The existing `.article-content pre / pre code` rules already
// style the container, so there is nothing to gain by owning it.
//
// An unlabelled or unknown fence returns '' — markdown-it then escapes the
// code itself and emits the plain default wrapper. That is a real case
// (`web-structure.md` has an unlabelled block), not a defensive fallback.
function highlightCode(code, lang) {
  if (!lang || !hljs.getLanguage(lang)) return '';
  return hljs.highlight(code, { language: lang }).value;
}

function addLinkClass(md) {
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const aIndex = token.attrIndex('class');
    if (aIndex < 0) {
      token.attrPush(['class', 'link']);
    } else {
      const currentClasses = token.attrs[aIndex][1];
      token.attrs[aIndex][1] = `${currentClasses} link`.trim();
    }
    return defaultRender(tokens, idx, options, env, self);
  };
}

export function applyHousePlugins(md, { internalDomains = [] } = {}) {
  // Ensure house options even if `md` was created with different defaults
  // (e.g. eleventy's default md has `breaks: false`).
  md.options.html = HOUSE_OPTIONS.html;
  md.options.breaks = HOUSE_OPTIONS.breaks;
  md.options.linkify = HOUSE_OPTIONS.linkify;
  md.options.highlight = highlightCode;

  md.use(markdownItAnchor, {
    permalink: false,
    slugify: (s) => s.toLowerCase().replace(/\s+/g, '-'),
  });
  md.use(markdownItExternalLinks, {
    externalTarget: '_blank',
    externalRel: 'noopener',
    internalDomains,
  });
  md.use(markdownItFootnote);
  addLinkClass(md);
  return md;
}

export function createHouseMarkdownLibrary(options = {}) {
  const md = markdownIt(HOUSE_OPTIONS);
  return applyHousePlugins(md, options);
}
