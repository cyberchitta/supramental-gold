// Custom-element renderer.
// Scans rendered HTML for registered custom-element tags and replaces
// each with the result of rendering the matching EJS template. Supports
// both paired (`<tag>...</tag>`) and self-closing (`<tag />`) forms.
// Per-tag content parsers are optional; the default is a no-op.
//
// This file is the canonical implementation for the CyberChitta design
// system. Both supramental-gold's plugin and any consumer that needs a
// renderer of its own (for site-specific tag namespaces) should use
// `createRenderer(...)` from here.

import ejs from 'ejs';
import path from 'path';

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

class CustomElementRenderer {
  constructor(elementConfigs, includesRoot, context, contentParsers) {
    const tagRegex = Object.keys(elementConfigs)
      .map((tag) => (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(tag) ? tag.toLowerCase() : null))
      .filter(Boolean)
      .join('|');
    if (!tagRegex) {
      throw new Error('No valid tag names provided to custom-element renderer.');
    }
    this.elementConfigs = elementConfigs;
    this.tagRegex = tagRegex;
    this.includesRoot = includesRoot;
    this.context = context || {};
    this.contentParsers = contentParsers || {};
  }

  async renderCustomElements(content) {
    const replacements = [];
    const selfClosing = new RegExp(
      `<(${this.tagRegex})\\s*([^>]*?)\\s*/>`,
      'g',
    );
    const paired = new RegExp(
      `<(${this.tagRegex})\\s*([^>]*?)>([\\s\\S]*?)<\\/(?:${this.tagRegex})>`,
      'g',
    );

    let m;
    while ((m = selfClosing.exec(content)) !== null) {
      const [fullMatch, tagName, attrs] = m;
      replacements.push({
        fullMatch,
        rendered: await this.render(tagName, attrs, '', fullMatch),
      });
    }
    while ((m = paired.exec(content)) !== null) {
      const [fullMatch, tagName, attrs, body] = m;
      replacements.push({
        fullMatch,
        rendered: await this.render(tagName, attrs, body.trim(), fullMatch),
      });
    }
    return replacements.reduce(
      (out, { fullMatch, rendered }) => out.replace(fullMatch, rendered),
      content,
    );
  }

  async render(tagName, attrsString, body, fullMatch) {
    try {
      const attributes = parseAttributes(attrsString);
      const templateName = resolveTemplate(
        this.elementConfigs[tagName],
        attributes,
      );
      if (!templateName) {
        console.error(
          `[sg] Failed to resolve template for <${tagName}> with attributes:`,
          attributes,
        );
        return fullMatch;
      }
      const parser = this.contentParsers[tagName] || noopParser;
      const parsedBody = body ? parser(body) : {};
      const templatePath = path.join(this.includesRoot, templateName);
      return await ejs.renderFile(templatePath, {
        ...parsedBody,
        ...attributes,
        ...this.context,
      });
    } catch (err) {
      console.error(`[sg] Error rendering <${tagName}>:`, err);
      return fullMatch;
    }
  }
}

export default function createRenderer(
  elementConfigs,
  includesRoot,
  context,
  contentParsers,
) {
  const renderer = new CustomElementRenderer(
    elementConfigs,
    includesRoot,
    context,
    contentParsers,
  );
  return (content) => renderer.renderCustomElements(content);
}
