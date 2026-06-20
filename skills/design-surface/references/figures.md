# Figures — the house treatment for charts, maps, and visualizations

**Status: candidate.** Not yet linked from `design-surface/SKILL.md`. Distilled
from the live figures on `www.cyberchitta.cc` (`vg-strip-plot`, `land-cover-map`,
`pc-chart`). Fold into the skill once a third surface confirms the line-chart
conventions generalize. See `TODO.md`.

This is the figure-level companion to `visual.md`. `visual.md` owns the page's
look (warm paper-ink, gold + bronze, hairline boundaries, *Less is More*, the
"what to avoid" tripwires). This doc owns what a **data figure** does inside that
look: container, axes, color, captions, controls, states. Read `visual.md`
first; nothing here overrides it.

`N` notes how many live figures establish each rule. `N=2` is a real house
pattern; `N=1` is the current reference implementation, proposed as the standard
and to be confirmed by the next figure.

## 1. Container (N=2)

`vg-strip-plot.ejs` and `land-cover-map.ejs` share an identical wrapper. Match it
for any framed figure:

```ejs
<div class="… bg-base-200 rounded-lg shadow-sm border border-base-300 overflow-hidden relative">
  <!-- floating controls cluster goes here (§5) -->
  <figure class="m-0 pt-5">
    <div class="px-1 sm:px-4 py-1">
      <div class="… bg-base-100 rounded border border-base-300">
        <!-- the plot / canvas / map -->
      </div>
    </div>
    <figcaption class="px-1 sm:px-4 py-1 mt-0 mb-1"><%= caption %></figcaption>
  </figure>
</div>
```

- Outer panel: `bg-base-200`, `rounded-lg`, `shadow-sm`, hairline
  `border-base-300`, `overflow-hidden`, **`relative`** (positioning context for
  the floating controls).
- Inner viewport: `bg-base-100`, `rounded`, hairline `border-base-300`. A map is
  `aspect-square`; a line chart is a fixed pixel height (§2).
- `<figure class="m-0 pt-5">` — the `pt-5` reserves headroom under the
  floating control cluster.

> **`pc-chart` is the outlier.** It uses a bare `<figure class="pc-chart">` with
> hand-rolled CSS and no panel/border. Bringing it onto this container is part of
> "figures into SG styling."

## 2. Axes & gridlines (N=1 — `pc-chart`, the reference line chart)

SVG drawn client-side; a 300px fixed height; margins `{ top, right: 10,
bottom: 26, left: 50 }`. Conventions, all in token colors so light/dark track
automatically:

| Element | Treatment |
|---|---|
| Horizontal gridlines | `stroke="var(--color-base-300)"` |
| Vertical gridlines | same, `opacity="0.5"` |
| Axis tick text | `fill="var(--color-base-content)" opacity="0.7" font-size="11"` |
| Baseline (x-axis) | one `base-300` line |
| Reference line (e.g. a ceiling) | `stroke="var(--color-base-content)" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"`, end-anchored label |
| Series stroke | `stroke-width` from a per-theme `--pc-stroke` token (light `1.5`, dark `1.35`); dashed series add `stroke-dasharray="4 3"` |
| Range band (min–max) | `stroke-width="1" opacity="0.35"` in the series color |

Gridlines and axis labels are quiet (base-300 / 70% opacity); the **data** is the
only thing at full strength. Log scales are first-class (`yLog`) — privacy-coin
volumes span orders of magnitude.

The series stroke is a hair thinner on dark (`--pc-stroke` 1.35 vs 1.5): bright
lines on a dark ground bloom (irradiation) and read heavier than the same width
on light paper, so dark gets trimmed to match the perceived weight. The token is
read via an inline `style` so theme toggles need no re-render, like the colors.

## 3. Color (N=1 palette mechanism, but a firm convention)

Series colors are a **named, semantic, page-scoped palette** — CSS custom
properties defined in the page layout's `:root` (light) and `[data-theme=dark]`
blocks, referenced by name in the series definitions:

```css
:root            { --pc-xmr: #f38230; --pc-zec: #4b80e6; --pc-x402: #00b89b;
                   --pc-railgun: #1eab53; --pc-tornado: #e73d55; --pc-pools: #8095a9; --pc-btc: #9e907a; }
/* same hue per entity, lifted lightness + moderate chroma for the dark paper */
[data-theme=dark]{ --pc-xmr: #ff9855; --pc-zec: #72a1fa; --pc-x402: #50ccbd;
                   --pc-railgun: #66cc80; --pc-tornado: #fa6773; --pc-pools: #80b1bd; --pc-btc: #b7ac9b; }
```
```js
{ name: 'XMR', color: 'var(--pc-xmr)', points: … }
```

Rules:

- **One hue per entity, reused across every chart.** XMR is always bronze, x402
  always teal, Tornado always rose. A reader learns the key once. Never recolor
  the same series differently between two charts.
- **Chroma tuned per paper, designed in OKLCH.** Pick one hue per entity, then
  set lightness and chroma *independently for each theme* so perceived
  separation matches on both papers. Light lines sit lower in lightness — where
  cool hues compress and crowd — so they need wider hue spacing and may run
  vivid to stay apart; dark lines sit high in lightness and read clean at
  moderate chroma. The palette stays inside `visual.md`'s spirit because it is
  **semantic, not decorative**: one stable hue per entity, none assigned for
  ornament — even where a hue runs saturated to hold a line apart from its
  neighbor. (Earlier guidance capped everything "desaturated and earthy"; that
  left light-mode lines muddy and hard to separate. Legibility on each paper
  wins — see `visual.md § What to avoid`, "rainbow category colors", now carved
  out for data figures.)
- **Light + dark pairs for every token**, same hue, lightness/chroma re-tuned per
  paper — not the dark value mechanically lightened. A practical generator
  (`drafts/pc-palette/gen-palette.mjs` on the consumer) holds one `(hue, L, C)`
  row per entity per theme and converts OKLCH → sRGB hex.
- **Only co-occurring series must separate.** Tune the tight pairs that share a
  chart (on `pc-chart`: teal↔blue, orange↔rose, blue↔slate); two hues that never
  appear together may sit close. Context/baseline series (a taupe BTC, a slate
  Privacy Pools) stay **low-chroma neutrals** and clear their saturated
  neighbors by that chroma drop, not by a hue they'd lose at low lightness.
- **Name by what the series *is*** (`--pc-xmr`), not by slot (`--series-3`) or
  raw hue (`--orange`).
- Keep the palette **page-local** unless a set of entities recurs across pages;
  only then consider promoting tokens into SG. Each research page tends to chart
  its own cast.

## 4. Captions — two levels

A house data figure is captioned twice, at two altitudes:

1. **`<figcaption>` — the label.** Short, neutral, says *what this view is*
   (and updates with the active mode on interactive charts). On `pc-chart`:
   `font-size: 0.8125rem; opacity: 0.7`.
2. **"What to look for" — the interpretation.** A **bold-lead-in prose line in
   the article body, right after the figure**, telling the reader what the chart
   is *for* and what reading to take from it:

   > **What to look for**: the slope, not the level, and how far below the
   > transparent rails the privacy lines sit.

   The figcaption labels; the prose interprets. Every `pc-chart` in
   `private-canary.md` carries one. (This is also a `voice.md` concern — keep the
   two consistent if that brief grows a figures section.)

## 5. Controls — floating cluster + modal legend (N=2)

When a figure needs controls (mode/layer toggles, density switch, opacity) and a
legend, both `land-cover-map.ejs` and `vg-strip-plot.ejs` use one treatment:
**controls float in a top-corner cluster over the figure; the legend is a
`<dialog class="modal">` summoned by an `ⓘ` button in that cluster.** There is no
floating-legend *panel* — the "floating legend" is the modal. Floating
*controls* are the house thing; *modal* legends are the house thing.

### The floating cluster

The container (§1) is already `relative`; the cluster is absolutely positioned in
a corner. The wrapper is `pointer-events-none` so it never steals plot
interaction; each interactive child re-enables `pointer-events-auto`.

```ejs
<div class="absolute top-2 right-2 z-10 flex items-center gap-2 pointer-events-none">
  <div class="flex items-center gap-1 pointer-events-auto">
    <input type="checkbox" class="toggle toggle-sm toggle-primary" id="…-<%= id %>" title="…" />
    <span class="text-xs text-base-content/70 drop-shadow-sm">Label</span>
  </div>
  <button
    class="btn btn-outline btn-xs text-base-content border-base-content/30 hover:bg-base-100/20 backdrop-blur-sm pointer-events-auto"
    onclick="document.getElementById('legend-modal-<%= id %>').showModal()"
    title="Show Legend">ⓘ Legend</button>
</div>
```

### The modal legend

```ejs
<dialog id="legend-modal-<%= id %>" class="modal">
  <div class="modal-box max-w-md">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-lg">Legend title</h3>
      <form method="dialog"><button class="btn btn-sm btn-circle btn-ghost">✕</button></form>
    </div>
    <div class="… max-h-96 overflow-y-auto"><!-- swatch + label rows / grid --></div>
  </div>
  <form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
```

### Rules

- **`pointer-events-none` on the cluster, `-auto` on each control.** The cluster
  sits over interactive content — non-negotiable.
- **`backdrop-blur-sm` / `drop-shadow-sm`** so controls stay legible over any
  plot/map beneath.
- **daisyUI vocabulary**, not bespoke widgets: `toggle toggle-sm toggle-primary`,
  `btn btn-outline btn-xs`, `range range-xs`, `modal` / `modal-box` /
  `modal-backdrop`.
- **The modal is a reference key, not a control.** Toggles that change *what's
  shown* live in the cluster; the modal is the color key you consult. Keep that
  separation unless a figure has a strong reason to merge them (document the why
  in `NOTES.md`).
- **Top-right** is the established corner.

**Why a modal, not an inline/floating legend panel:** it keeps the figure
footprint **fixed**. A variable-height inline legend changes the figure's total
height and reflows the page on every toggle or mode switch; a modal is out of
flow entirely. Reach for it whenever an in-flow legend would otherwise resize the
figure as its contents change.

**Open extension (not yet house):** making the legend *interactive* — clicking
group entries to toggle series visibility — diverges from modal-as-reference, and
a modal covers the figure so the reader can't watch the change. The
house-consistent way to expose group on/off is **toggles in the floating
cluster** (as land-cover's Detail and vg's Session-overlay do), modal staying a
pure key. If a consumer ships interactive group-toggling this way, record it here
as the second data point.

## 6. Loading & error states (N=2)

- **Loading:** an overlay or centered placeholder on `bg-base-100`, dimmed
  (`opacity ~0.5`, or `bg-opacity-90` for a map's full-cover overlay), with a
  quiet "Loading…" line. Sized to the final figure so nothing jumps when data
  arrives.
- **Error:** a daisyUI `alert alert-error` block, or an inline "failed to load"
  fallback inside the figure mount. Never leave a bare broken figure.

## 7. Accessibility

The SVG carries `role="img"` and an `aria-label` set from the figcaption, so the
figure announces its own description. Keep that when adding new chart types.
