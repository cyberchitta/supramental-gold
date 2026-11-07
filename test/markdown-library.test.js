import { expect, test } from 'bun:test';
import { createHouseMarkdownLibrary } from '../eleventy/markdown-library.js';

const md = createHouseMarkdownLibrary();
const fence = (lang, body) => md.render(`\`\`\`${lang}\n${body}\n\`\`\`\n`);

test.each([
  ['ts', 'const f = async (x: number): Promise<void> => {};'],
  ['typescript', 'const f = async (x: number): Promise<void> => {};'],
  ['graphql', 'query { shop { name } }'],
  ['lean', 'theorem t : 1 = 1 := rfl'],
])('a %s fence is highlighted', (lang, body) => {
  expect(fence(lang, body)).toContain('class="hljs-');
});

test('an unknown fence is escaped, not highlighted', () => {
  const html = fence('nosuchlang', '<b>');
  expect(html).not.toContain('hljs-');
  expect(html).toContain('&lt;b&gt;');
});
