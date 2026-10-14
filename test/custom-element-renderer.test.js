import { expect, test } from 'bun:test';
import path from 'path';
import { fileURLToPath } from 'url';
import createRenderer from '../eleventy/custom-element-renderer.js';

const includes = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/custom-elements');
const render = createRenderer(
  { showcase: { glb: 'glb.ejs', 'themed-image': 'themed-image.ejs' } },
  includes,
  {},
  { showcase: (body) => ({ caption: body }) },
);

test('a self-closing element does not swallow the paired one after it', async () => {
  const out = await render(
    '<showcase type="glb" src="a.glb" />\n<p>between</p>\n<showcase type="themed-image" src="b.png">Caption</showcase>',
  );
  expect(out).toBe(
    '<model src="a.glb"></model>\n\n<p>between</p>\n<figure data-src="b.png">Caption</figure>\n',
  );
});

test('rendered output is inserted literally, not as a replacement pattern', async () => {
  const out = await render('<showcase type="themed-image" src="c.png">costs $&amp; $1</showcase>');
  expect(out).toBe('<figure data-src="c.png">costs $&amp;amp; $1</figure>\n');
});
