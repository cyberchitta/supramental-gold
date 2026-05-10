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
};

export default helpers;
