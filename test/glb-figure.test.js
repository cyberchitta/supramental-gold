import { expect, test } from 'bun:test';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import createRenderer from '../eleventy/custom-element-renderer.js';
import addGlbScripts from '../eleventy/glb-scripts.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const figure = path.join(root, '../eleventy/primitives/glb-figure.ejs');
const render = (locals) => ejs.renderFile(figure, locals);

test('alt and caption stay in the page', async () => {
  const html = await render({ src: '/m.glb', alt: 'A hex tower', caption: 'Three floors.' });
  expect(html).toContain('alt="A hex tower"');
  expect(html).toContain('>Three floors.</figcaption>');
  expect(html).toContain('src="/m.glb"');
  expect(html).not.toContain('data-sg-glb-base');
});

test('a themed model carries its base name, not a src', async () => {
  const html = await render({ src: '/m.glb', alt: 'x', themed: 'true' });
  expect(html).toContain('data-sg-glb-base="/m.glb"');
  expect(html).not.toMatch(/\ssrc="/);
});

test('src and alt are required', async () => {
  await expect(render({ src: '/m.glb' })).rejects.toThrow('src and alt are required');
});

test('a consumer shim registers its own tag to the primitive', async () => {
  const renderer = createRenderer(
    { 'glb-pane': 'model.ejs' },
    path.join(root, 'fixtures/custom-elements'),
  );
  const html = await renderer('<glb-pane src="d.glb" alt="Diverter" caption="Cap" />');
  expect(html).toContain('data-sg-glb-base="/models/d.glb"');
  expect(html).toContain('alt="Diverter"');
  expect(html).toContain('>Cap</figcaption>');
});

test('the scripts are added once, and only to a page with a figure', async () => {
  const fig = await render({ src: '/m.glb', alt: 'x' });
  const page = addGlbScripts(`<html><body>${fig}${fig}</body></html>`);
  expect(page.match(/model-viewer\.min\.js/g)).toHaveLength(1);
  expect(page.indexOf('model-viewer.min.js')).toBeGreaterThan(page.lastIndexOf('</figure>'));
  const plain = '<html><body><model-viewer data-glb-base="/x.glb"></model-viewer></body></html>';
  expect(addGlbScripts(plain)).toBe(plain);
  expect(() => addGlbScripts(fig)).toThrow('no </body>');
});
