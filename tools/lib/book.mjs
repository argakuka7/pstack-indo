import { readdirSync, readFileSync } from "node:fs";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export const SOURCE = { sha: "adf3218ca2f5b9971eedc07a76bef22df7701539", version: "0.15.5" };
export const VERSION = `${SOURCE.version}-id.0`;
export const filename = (ext) => `pstack-guide-${VERSION}.${ext}`;
export const escapeHtml = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const md = new MarkdownIt({ html: false, linkify: false, typographer: false, xhtmlOut: true, highlight(code, lang) {
  return lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : "";
} });

export function loadBook() {
  const files = readdirSync("manuscript").filter((f) => f.endsWith(".md")).sort();
  const items = files.map((file) => {
    const source = readFileSync(`manuscript/${file}`, "utf8");
    const title = source.match(/^#\s+(.+)$/m)?.[1];
    if (!title) throw new Error(`${file}: missing H1 title`);
    return { file, id: file.replace(/\.md$/, ""), title, source, html: md.render(source.replace(/^#\s+.+\n/, "")) };
  });
  const bodyFiles = items.filter((item) => /-(?:part|ch)-/.test(item.file));
  if (items.length !== 37 || bodyFiles.length !== 31) throw new Error(`expected 37 manuscript files (31 part/chapter files), found ${items.length} (${bodyFiles.length} part/chapter files)`);
  return items;
}

export const xhtml = (title, body) => `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="id" lang="id"><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title><link rel="stylesheet" href="style.css"/></head><body>${body}</body></html>`;
