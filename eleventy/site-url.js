// Resolve the absolute site URL for the current build context.
//
// Netlify sets `DEPLOY_PRIME_URL` in EVERY context, production included, where
// it names the branch subdomain (`main--<site>.netlify.app`). Reading it
// unconditionally therefore publishes a non-canonical host into `og:url`, the
// canonical link, the sitemap and the feed on the production site — where it is
// invisible, because every human-facing surface still works and analytics still
// reports the real domain. Only crawlers and social scrapers see it.
//
// SG renders `site.url` but historically did not own how consumers derived it,
// and the same wrong line turned up in two of them (www.cyberchitta.cc from
// 2026-05-23; sorted-studs with the same shape). The rule lives here now so a
// new sub-site inherits it instead of copying a neighbour's data file.
//
// Hosts that are not Netlify — GitHub Pages, e.g. ch-ai-tanya — set neither
// variable and fall through to the canonical URL, which is the right answer.
//
// Non-production deploys deliberately self-reference so a preview does not
// canonicalise to production. Pair that with `X-Robots-Tag: noindex` on those
// deploys; do NOT point their canonical at production, because combining
// noindex with a cross-host canonical risks the noindex propagating to the
// production URL.
export const resolveSiteUrl = (canonicalUrl) => {
  if (!canonicalUrl) {
    throw new Error('resolveSiteUrl: canonicalUrl is required');
  }
  return process.env.CONTEXT === 'production'
    ? canonicalUrl
    : process.env.DEPLOY_PRIME_URL || canonicalUrl;
};
