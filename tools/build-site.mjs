import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "vitepress";
import { filename, loadBook } from "./lib/book.mjs";

console.log("Menyiapkan berkas situs web pstack-indo...");

// 1. Pastikan manuskrip valid
const items = loadBook();
console.log(`Manuskrip valid: ${items.length} berkas.`);

// 2. Buat direktori docs/ dan docs/public/
mkdirSync("docs/public", { recursive: true });

// 3. Bersihkan berkas .md lama di docs/ (kecuali index.md yang dikomit)
for (const file of readdirSync("docs")) {
  if (file.endsWith(".md") && file !== "index.md") {
    unlinkSync(resolve("docs", file));
  }
}

// 4. Salin seluruh manuskrip ke docs/
for (const item of items) {
  copyFileSync(resolve("manuscript", item.file), resolve("docs", item.file));
}
console.log(`Disalin: ${items.length} berkas naskah ke docs/.`);

// 5. Salin artefak EPUB dan PDF dari dist/ jika ada
const epubName = filename("epub");
const pdfName = filename("pdf");
if (existsSync(resolve("dist", epubName))) {
  copyFileSync(resolve("dist", epubName), resolve("docs/public", epubName));
  console.log(`Disalin: dist/${epubName} -> docs/public/${epubName}`);
} else {
  console.warn(`Peringatan: dist/${epubName} belum dibuat. Jalankan bun run build terlebih dahulu.`);
}

if (existsSync(resolve("dist", pdfName))) {
  copyFileSync(resolve("dist", pdfName), resolve("docs/public", pdfName));
  console.log(`Disalin: dist/${pdfName} -> docs/public/${pdfName}`);
} else {
  console.warn(`Peringatan: dist/${pdfName} belum dibuat.`);
}

// 6. Jalankan build VitePress
if (process.argv.includes("--prep")) {
  console.log("Persiapan berkas docs/ selesai (mode --prep).");
} else {
  console.log("Membangun situs web statis dengan VitePress...");
  await build("docs");
  console.log("Situs web selesai dibangun di site/.");
}

