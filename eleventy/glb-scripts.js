// GLB page scripts — added once, before </body>, to any page carrying a
// `primitives/glb-figure` (marked `data-sg-glb`). Pages without one load
// nothing. Registered by the SG plugin as the `sgGlbScripts` transform;
// Eleventy runs plugin transforms after the consumer's own, so figures that
// custom-element transforms render are already in the page.
//
// Theme: a themed viewer carries its base name in `data-sg-glb-base`, and
// `src` follows `data-theme` as `-light` / `-dark`. It is set only once
// <model-viewer> is defined: setting it on instances still upgrading can
// flash one GLB into every viewer.
//
// Reduced motion drops autoplay. This classic script runs before the
// deferred module upgrades the viewers, so a model loaded under the
// preference never starts; a change while the page is open pauses or resumes.

const SCRIPTS = `<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js"></script>
<script>
  (function () {
    var root = document.documentElement;
    function apply() {
      var t = root.dataset.theme === 'dark' ? 'dark' : 'light';
      document.querySelectorAll('model-viewer[data-sg-glb-base]').forEach(function (mv) {
        var themed = mv.dataset.sgGlbBase.replace(/\\.glb$/i, '-' + t + '.glb');
        if (mv.getAttribute('src') !== themed) mv.setAttribute('src', themed);
      });
    }
    if (window.customElements && customElements.whenDefined) {
      customElements.whenDefined('model-viewer').then(apply);
    } else {
      apply();
    }
    new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
    function motion() {
      document.querySelectorAll('model-viewer[data-sg-glb]').forEach(function (mv) {
        if (reduce.matches) {
          mv.removeAttribute('autoplay');
          if (mv.pause) mv.pause();
        } else {
          mv.setAttribute('autoplay', '');
          if (mv.play && mv.loaded) mv.play();
        }
      });
    }
    if (reduce) {
      motion();
      if (reduce.addEventListener) reduce.addEventListener('change', motion);
    }
  })();
</script>
`;

export default function addGlbScripts(html) {
  if (!/<model-viewer[^>]*\sdata-sg-glb[\s>=]/.test(html)) return html;
  const at = html.lastIndexOf('</body>');
  if (at === -1) throw new Error('sgGlbScripts: a page with a glb-figure has no </body>');
  return html.slice(0, at) + SCRIPTS + html.slice(at);
}
