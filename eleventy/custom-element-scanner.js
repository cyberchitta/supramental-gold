// Custom-element scanner — the output-agnostic core under the renderer.
// Finds registered custom-element tags in a document, parses their
// attributes, resolves each to a template name through the element config,
// runs the tag's content parser over the body, and splices in whatever the
// caller's `renderTemplate` returns. The EJS → HTML renderer is one caller;
// a consumer generating another format (www's llms.txt markdown) is another.
//
//   const scan = createCustomElementScanner({
//     elementConfigs,          // { tag: 'file.ejs' | { attrValue: … } }
//     contentParsers,          // optional { tag: (body) => data }
//     renderTemplate,          // async ({ tagName, templateName, data, body, extra }) => string
//     onError,                 // optional (err, { tagName, attributes, fullMatch }) => string
//   });
//   const out = await scan(content, extra);   // `extra` reaches renderTemplate as-is
//
// `data` is the parsed body merged under the attributes. Without `onError`,
// an element that fails to resolve or render throws.

const noopParser = () => ({});

function parseAttributes(attributesString) {
  const attributeRegex = /(\w[\w-]*)="([^"]*)"/g;
  const attributes = {};
  let match;
  while ((match = attributeRegex.exec(attributesString)) !== null) {
    const [, key, value] = match;
    attributes[key] = value;
  }
  return attributes;
}

function resolveTemplate(obj, attrs) {
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object' || obj === null) return null;
  if (Object.keys(attrs).length === 0) return obj;
  for (const [key, value] of Object.entries(attrs)) {
    if (value in obj) {
      const { [key]: _omit, ...remaining } = attrs;
      const resolved = resolveTemplate(obj[value], remaining);
      if (resolved) return resolved;
    }
  }
  return null;
}

export default function createCustomElementScanner({
  elementConfigs,
  contentParsers = {},
  renderTemplate,
  onError = (err) => {
    throw err;
  },
}) {
  const tagRegex = Object.keys(elementConfigs)
    .map((tag) => (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(tag) ? tag.toLowerCase() : null))
    .filter(Boolean)
    .join('|');
  if (!tagRegex) {
    throw new Error('No valid tag names provided to custom-element scanner.');
  }

  async function renderElement(tagName, attrsString, body, fullMatch, extra) {
    const attributes = parseAttributes(attrsString);
    try {
      const templateName = resolveTemplate(elementConfigs[tagName], attributes);
      if (!templateName) {
        throw new Error(
          `No template resolves for <${tagName}> with attributes ${JSON.stringify(attributes)}`,
        );
      }
      const parser = contentParsers[tagName] || noopParser;
      const data = { ...(body ? parser(body) : {}), ...attributes };
      return await renderTemplate({ tagName, templateName, data, body, extra });
    } catch (err) {
      return onError(err, { tagName, attributes, fullMatch });
    }
  }

  return async function scan(content, extra) {
    // One alternation scanned once, self-closing branch first: a separate
    // paired pass also matched `<tag … />` (`[^>]*?` admits the `/`) and ran
    // its body on to the next element's closing tag, swallowing that element.
    const element = new RegExp(
      `<(${tagRegex})\\s*([^>]*?)\\s*/>|<(${tagRegex})\\s*([^>]*?)>([\\s\\S]*?)<\\/(?:${tagRegex})>`,
      'g',
    );

    let out = '';
    let last = 0;
    let m;
    while ((m = element.exec(content)) !== null) {
      const [fullMatch, closedTag, closedAttrs, pairedTag, pairedAttrs, body] = m;
      const rendered = closedTag
        ? await renderElement(closedTag, closedAttrs, '', fullMatch, extra)
        : await renderElement(pairedTag, pairedAttrs, body.trim(), fullMatch, extra);
      out += content.slice(last, m.index) + rendered;
      last = m.index + fullMatch.length;
    }
    return out + content.slice(last);
  };
}
