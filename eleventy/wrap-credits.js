// Wrap the canonical `## Credits` section in a `.credits-section`
// container so SG's credits styling (border-top, smaller type) can target
// it. Matches the H2 with or without an `id` attribute, so consumers
// whose markdown pipeline doesn't auto-add heading anchors (e.g.
// sub-sites using the default 11ty markdown lib) still get the wrap.
//
// Eleventy-compatible transform: `(content) => rewritten`. Auto-registered
// by the SG plugin entry; consumers don't need to wire it up.

const CREDITS_PATTERN =
  /(<h2(?:\s[^>]*)?>Credits<\/h2>[\s\S]*?)(?=<h[1-6][\s>]|<\/(section|article|footer)>)/;

export default function wrapCredits(content) {
  if (typeof content !== 'string') return content;
  return content.replace(CREDITS_PATTERN, '<div class="credits-section">$1</div>');
}
