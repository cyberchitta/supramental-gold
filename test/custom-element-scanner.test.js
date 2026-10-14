import { expect, test } from 'bun:test';
import createCustomElementScanner from '../eleventy/custom-element-scanner.js';

const configs = { showcase: { glb: 'glb', 'themed-image': 'themed-image' } };
const markdown = ({ templateName, data, body, extra }) =>
  `[${templateName} ${data.src}${body ? ` "${body}"` : ''} @${extra}]`;

test('another output format plugs in through renderTemplate, with extra passed through', async () => {
  const scan = createCustomElementScanner({ elementConfigs: configs, renderTemplate: markdown });
  const out = await scan(
    '<showcase type="glb" src="a.glb" />\n<showcase type="themed-image" src="b.png">Caption</showcase>',
    '/page.html',
  );
  expect(out).toBe('[glb a.glb @/page.html]\n[themed-image b.png "Caption" @/page.html]');
});

test('the content parser feeds data, and attributes win over it', async () => {
  const scan = createCustomElementScanner({
    elementConfigs: configs,
    contentParsers: { showcase: (body) => ({ caption: body, src: 'from-body' }) },
    renderTemplate: ({ data }) => `${data.src}|${data.caption}`,
  });
  expect(await scan('<showcase type="themed-image" src="b.png">Cap</showcase>')).toBe('b.png|Cap');
});

test('an unresolvable element throws unless onError handles it', async () => {
  const content = '<showcase type="nope" />';
  const strict = createCustomElementScanner({ elementConfigs: configs, renderTemplate: markdown });
  await expect(strict(content)).rejects.toThrow('No template resolves for <showcase>');
  const lenient = createCustomElementScanner({
    elementConfigs: configs,
    renderTemplate: markdown,
    onError: (err, { fullMatch }) => `<!-- ${fullMatch} -->`,
  });
  expect(await lenient(content)).toBe('<!-- <showcase type="nope" /> -->');
});
