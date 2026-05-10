// Section-title transform factory.
//
// Given a rule list keyed by H2 text, rewrites authored `<h2>Name</h2>`
// into the SG section-title shape (`<h2 class="group-header">name</h2>`)
// and optionally classes the immediately-following `<ul>` with a list
// class (e.g. `backlink-list`, `finding-list`).
//
// Consumers wire in their own canonical-name list. The live site has a
// long-standing `## Credits` wrapper (`wrap-credits.js`); SG sub-sites
// like `ch-ai-tanya` use this factory to recognise wiki-canonical H2s
// (`Concepts`, `Sources`, `Cited in`, `Cross-references`, `Threads`,
// `Findings`, `Interpretive tensions`).
//
// Returns an Eleventy-compatible transform function: `(content) =>
// rewritten`. Register with `eleventyConfig.addTransform(...)`.

const H2_PATTERN = /<h2(?:\s[^>]*)?>([^<]+)<\/h2>(\s*<ul(?:\s[^>]*)?>)?/g;

function normalizeRules(rules) {
  if (Array.isArray(rules)) {
    return Object.fromEntries(rules.map((r) => [r.name.toLowerCase(), r]));
  }
  return Object.fromEntries(
    Object.entries(rules).map(([name, opts]) => [
      name.toLowerCase(),
      { name, ...(opts || {}) },
    ]),
  );
}

function injectListClass(ulOpening, listClass) {
  if (!ulOpening) return '';
  const classMatch = ulOpening.match(/class\s*=\s*"([^"]*)"/);
  if (classMatch) {
    const existing = classMatch[1].split(/\s+/).filter(Boolean);
    if (existing.includes(listClass)) return ulOpening;
    return ulOpening.replace(
      /class\s*=\s*"([^"]*)"/,
      `class="$1 ${listClass}"`,
    );
  }
  return ulOpening.replace(/<ul/, `<ul class="${listClass}"`);
}

export default function createSectionTitleTransform(rules, options = {}) {
  const ruleMap = normalizeRules(rules);
  const titleClass = options.titleClass || 'group-header';
  const lowercase = options.lowercase !== false;
  return function sectionTitleTransform(content) {
    if (typeof content !== 'string') return content;
    return content.replace(H2_PATTERN, (match, rawName, ulOpening) => {
      const trimmed = rawName.trim();
      const rule = ruleMap[trimmed.toLowerCase()];
      if (!rule) return match;
      const h2Open = match.slice(0, match.indexOf('>') + 1);
      const alreadyTitled = new RegExp(
        `class\\s*=\\s*["'][^"']*\\b${titleClass}\\b`,
      ).test(h2Open);
      const display = lowercase ? trimmed.toLowerCase() : trimmed;
      const newH2 = alreadyTitled
        ? match.slice(0, match.indexOf('</h2>') + '</h2>'.length)
        : `<h2 class="${titleClass}">${display}</h2>`;
      const newUl = rule.listClass
        ? injectListClass(ulOpening || '', rule.listClass)
        : ulOpening || '';
      return newH2 + newUl;
    });
  };
}
