import { expect, test } from 'bun:test';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import createRenderer from '../eleventy/custom-element-renderer.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const figure = path.join(root, '../eleventy/primitives/image-figure.ejs');
const render = (locals) => ejs.renderFile(figure, locals);

test('src, alt, size and caption stay in the page', async () => {
  const html = await render({ src: '/i/a.webp', alt: 'A card', frame: '1120x708', caption: 'One card.' });
  expect(html).toContain('src="/i/a.webp"');
  expect(html).toContain('alt="A card"');
  expect(html).toContain('width="1120" height="708"');
  expect(html).toContain('>One card.</figcaption>');
});

test('no caption, no figcaption', async () => {
  const html = await render({ src: '/i/a.webp', alt: 'x', frame: '2x1' });
  expect(html).not.toContain('<figcaption');
});

test('src and alt are required', async () => {
  await expect(render({ src: '/i/a.webp', frame: '2x1' })).rejects.toThrow('src and alt are required');
});

test('frame is required', async () => {
  await expect(render({ src: '/i/a.webp', alt: 'x' })).rejects.toThrow('frame="WxH" is required');
  await expect(render({ src: '/i/a.webp', alt: 'x', frame: 'wide' })).rejects.toThrow('frame="WxH" is required');
});

test('a showcase type registers straight to the SG primitive', async () => {
  const renderer = createRenderer(
    { showcase: { image: 'primitives/image-figure.ejs' } },
    path.join(root, 'fixtures/custom-elements'),
  );
  const html = await renderer(
    '<showcase type="image" src="/i/s.webp" frame="1600x904" alt="Two panes" caption="Cap" />',
  );
  expect(html).toContain('src="/i/s.webp"');
  expect(html).toContain('width="1600" height="904"');
  expect(html).toContain('>Cap</figcaption>');
});
