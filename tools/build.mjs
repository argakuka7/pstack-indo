import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import JSZip from "jszip";
import puppeteer from "puppeteer-core";
import { filename, loadBook, xhtml, escapeHtml, VERSION } from "./lib/book.mjs";
import { minimalPdf } from "./lib/minimal-pdf.mjs";

let chromePdf = false;
const target = process.argv[2] ?? "all";
if (!["all", "epub", "pdf"].includes(target)) throw new Error("usage: bun tools/build.mjs [epub|pdf|all]");
const items = loadBook();
const css = readFileSync("assets/style.css", "utf8");
mkdirSync("dist", { recursive: true });

if (target === "all" || target === "epub") {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml", '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const book = zip.folder("OEBPS");
  book.file("style.css", css);
  const manifest = [];
  const spine = [];
  items.forEach((item, i) => {
    const id = `doc${i}`;
    book.file(`${item.id}.xhtml`, xhtml(item.title, `<main><h1>${escapeHtml(item.title)}</h1>${item.html}</main>`));
    manifest.push(`<item id="${id}" href="${item.id}.xhtml" media-type="application/xhtml+xml"/>`);
    spine.push(`<itemref idref="${id}"/>`);
  });
  book.file("nav.xhtml", xhtml("Daftar isi", `<nav epub:type="toc" xmlns:epub="http://www.idpf.org/2007/ops"><h1>Daftar isi</h1><ol>${items.map((i) => `<li><a href="${i.id}.xhtml">${escapeHtml(i.title)}</a></li>`).join("")}</ol></nav>`));
  book.file("content.opf", `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">urn:pstack-guide:${VERSION}</dc:identifier><dc:title>Panduan pstack: Buku kerja rangka Bahasa Indonesia</dc:title><dc:language>id</dc:language><dc:creator>Edisi Bahasa Indonesia tidak resmi</dc:creator><meta property="dcterms:modified">2026-09-29T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>${manifest.join("")}</manifest><spine>${spine.join("")}</spine></package>`);
  const data = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
  writeFileSync(`dist/${filename("epub")}`, data);
  console.log(`epub: ${data.length} bytes, ${items.length} documents`);
}

if (target === "all" || target === "pdf") {
  const chrome = process.env.CHROME_PATH ?? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].find(existsSync);
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>${css}${readFileSync("assets/print.css", "utf8")}</style></head><body>${items.map((i) => `<section id="${i.id}"><h1>${escapeHtml(i.title)}</h1>${i.html.replaceAll(/href="([^"]+)\.xhtml"/g, 'href="#$1"')}</section>`).join("")}</body></html>`;
  mkdirSync("build", { recursive: true });
  writeFileSync("build/book.html", html);
  if (!chrome) {
    writeFileSync(`dist/${filename("pdf")}`, minimalPdf(items));
    console.log(`pdf: ${filename("pdf")} (browserless scaffold preview; install Chrome for full layout)`);
  } else {
    const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
    try {
      const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.addScriptTag({ path: resolve("node_modules/pagedjs/dist/paged.polyfill.js") });
    await page.evaluate(() => window.PagedPolyfill.preview());
    await page.pdf({ path: `dist/${filename("pdf")}`, preferCSSPageSize: true, printBackground: true });
      chromePdf = true;
      console.log(`pdf: ${filename("pdf")} (Chrome)`);
    } finally { await browser.close(); }
  }
}

// publish step: make build/ a self-contained site root (Netlify publish dir)
mkdirSync("build", { recursive: true });
if (existsSync("build/book.html")) {
  copyFileSync("build/book.html", "build/index.html");
  const page = readFileSync("build/book.html", "utf8");
  if (page.includes(".xhtml")) throw new Error("book.html: internal links must be same-page anchors, not .xhtml");
  for (const m of page.matchAll(/href="#([^"]+)"/g)) if (!page.includes(`id="${m[1]}"`)) throw new Error(`book.html: broken anchor #${m[1]}`);
}
if (existsSync(`dist/${filename("epub")}`)) copyFileSync(`dist/${filename("epub")}`, `build/${filename("epub")}`);
if (chromePdf) copyFileSync(`dist/${filename("pdf")}`, `build/${filename("pdf")}`);
