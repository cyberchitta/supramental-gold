// Shared helpers for cyberchitta consumers.
// Registered as global data `sgHelpers` by the plugin; can also be
// imported directly: `import { helpers } from '@cyberchitta/supramental-gold/eleventy'`.

const helpers = {
  byTitle: (arr) =>
    [...arr].sort((a, b) =>
      (a.data.title || a.fileSlug).localeCompare(b.data.title || b.fileSlug),
    ),
  byDateDesc: (arr) =>
    [...arr].sort((a, b) => {
      const aD = a.data.date instanceof Date ? a.data.date : new Date(a.data.date || 0);
      const bD = b.data.date instanceof Date ? b.data.date : new Date(b.data.date || 0);
      return bD - aD;
    }),
  yearMonth: (d) => {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return isNaN(date) ? '' : date.toISOString().slice(0, 7);
  },
  formatDate: (d) => {
    if (!d) return '';
    if (d instanceof Date) {
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    if (typeof d === 'string') {
      if (/^\d{4}-\d{2}$/.test(d)) {
        const [y, m] = d.split('-').map(Number);
        const dt = new Date(Date.UTC(y, m - 1, 1));
        return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }
      const dt = new Date(d);
      if (!isNaN(dt)) {
        return dt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    return String(d);
  },
  findingBySlug: (arr, slug) => arr.find((f) => f.fileSlug === slug),
  conceptBySlug: (arr, slug) => arr.find((c) => c.fileSlug === slug),
  parentConcepts: (concepts, findingSlug) =>
    concepts.filter((c) => (c.data.findings || []).includes(findingSlug)),
  removeFirstHeading: (content) => {
    if (typeof content !== 'string') return content;
    // Consumers may call this on either markdown source (the live site's
    // markdown library hook does so before render) or rendered HTML
    // (sub-sites without that hook). Handle both: strip a leading `# `
    // line if present; otherwise strip the first `<h1>...</h1>`.
    const lines = content.split('\n');
    const mdIdx = lines.findIndex((line) => line.trim().startsWith('# '));
    if (mdIdx !== -1) {
      lines.splice(mdIdx, 1);
      return lines.join('\n');
    }
    return content.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>\s*/, '');
  },
  getLatestUpdateDate: (updates) =>
    !updates || updates.length === 0 ? null : updates[updates.length - 1].date,
  stripPTags: (html) => {
    if (typeof html !== 'string') return html;
    if (html.startsWith('<p>') && html.endsWith('</p>\n') && !html.slice(3, -5).includes('\n')) {
      return html.slice(3, -5);
    }
    return html;
  },
  stripHtml: (html) => (html ? html.replace(/<[^>]*>/g, '') : ''),
  // Collapse named `## ` sections into a house <details> in the rendered HTML.
  // A section is matched by its <h2> text and runs from that <h2> to just
  // before the next <h2> (or end of document). Used for reference apparatus
  // that should be present but out of the primary flow (a data-sources
  // appendix, a secondary-chart appendix). HTML path only: a consumer's text
  // mirror (llms.txt) is generated separately from source markdown, so the
  // section stays a normal `## Title` there. The real <h2> (with its anchor
  // id) is kept inside the <summary> so the folded heading keeps full h2
  // styling and stays a link target; the heading is set inline so it sits
  // beside the disclosure marker rather than below it. Margins mirror
  // `.article-content h2`.
  foldSections: (html, titles) => {
    if (typeof html !== 'string' || !titles || titles.length === 0) return html;
    const strip = (s) => (s ? s.replace(/<[^>]*>/g, '') : '');
    const set = new Set(titles.map((t) => t.trim()));
    return html
      .split(/(?=<h2\b)/i)
      .map((part) => {
        const m = part.match(/^(<h2\b[^>]*>)([\s\S]*?)<\/h2>/i);
        if (!m || !set.has(strip(m[2]).trim())) return part;
        const heading = `${m[1].replace(/^<h2\b/i, '<h2 style="display:inline"')}${m[2]}</h2>`;
        const body = part.slice(m[0].length);
        return `<details style="margin-top:2rem;margin-bottom:.75rem"><summary class="cursor-pointer py-2">${heading}</summary>${body}</details>`;
      })
      .join('');
  },
};

export default helpers;
