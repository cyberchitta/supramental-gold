// Build-time helpers used by consumer indexers.
//
// Separate from `eleventy/helpers.js` because these import `fs` and
// `gray-matter` and aren't intended for template-time use. Templates read
// `readingTime` off `site.articles[]`; this module is what consumers'
// build scripts call to put it there.
//
// House convention: Credits and Document History don't count as reading
// material. The split markers are the canonical markdown headings used
// across CC articles.

import { readFileSync } from 'fs';
import matter from 'gray-matter';

const WORDS_PER_MINUTE = 200;
const NON_READING_MARKERS = ['\n\n## Credits', '\n\n---\n\n## Document History'];

// Markdown table syntax — the `|` cell delimiters and `| --- |` divider rows —
// is layout, not reading. Drop divider rows and strip pipes from data rows so a
// table counts its cell *contents*, not its scaffolding: a 6-column row is ~7
// cells but tokenizes to ~15 whitespace-split "words" once the pipes count, and
// divider rows are 100% phantom. Universal markdown logic, so it lives here
// rather than in each consumer.
export function stripTableSyntax(body) {
  return body
    .split('\n')
    .filter((line) => !(line.includes('|') && /^[\s|:-]*$/.test(line))) // drop | --- | dividers
    .map((line) => (/^\s*\|.*\|\s*$/.test(line) ? line.replace(/\|/g, ' ') : line)) // de-pipe data rows
    .join('\n');
}

export function calculateReadingTime(text) {
  return Math.ceil(stripTableSyntax(text).trim().split(/\s+/).length / WORDS_PER_MINUTE);
}

export function stripNonReadingSections(body) {
  let out = body;
  for (const marker of NON_READING_MARKERS) out = out.split(marker)[0];
  return out;
}

export function readingTimeForFile(absPath) {
  const { content } = matter(readFileSync(absPath, 'utf8'));
  return calculateReadingTime(stripNonReadingSections(content));
}
