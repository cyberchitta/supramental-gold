// markdown-it-footnote appends the footnotes section at the end of the
// rendered document. For CC articles the canonical structure is
// body → footnotes → credits, so reorder when both blocks are present.
//
// Looks for `<div class="credits-section">…</div>` (emitted by wrap-credits)
// followed by the markdown-it-footnote separator + section, and swaps them
// so footnotes precede credits.
//
// Eleventy-compatible transform: `(content) => rewritten`. Auto-registered
// by the SG plugin entry to run after `sgWrapCredits`.

const PATTERN =
  /(<div class="credits-section">[\s\S]*?<\/div>)(\s*)(<hr class="footnotes-sep">[\s\S]*?<section class="footnotes">[\s\S]*?<\/section>)/;

export default function repositionFootnotes(content) {
  if (typeof content !== 'string') return content;
  return content.replace(PATTERN, '$3$2$1');
}
