import { readFileSync, readdirSync } from "node:fs";
import JSZip from "jszip";
import { EpubCheck } from "@likecoin/epubcheck-ts";
import { filename, loadBook } from "./lib/book.mjs";

const problems = [];
for (const file of readdirSync(".").filter((f) => f.endsWith(".md"))) {
  if (readFileSync(file, "utf8").includes("—")) problems.push(`${file}: em dash is not allowed`);
}
for (const file of readdirSync("manuscript").filter((f) => f.endsWith(".md"))) {
  const source = readFileSync(`manuscript/${file}`, "utf8");
  if (!source.includes("<!-- TODO: isi bab pada tahap penerjemahan. -->")) problems.push(`${file}: missing scaffold placeholder`);
}
const items = loadBook();
if (items.length !== 37 || items.filter((i) => /-(?:part|ch)-/.test(i.file)).length !== 31) problems.push(`expected 37 files including 31 part/chapter files, found ${items.length}`);
const glossary = readFileSync("GLOSSARY.md", "utf8");
for (const term of ["skill", "playbook", "blast radius", "review", "automations"]) {
  if (!glossary.includes(`| ${term} |`)) problems.push(`GLOSSARY.md: missing ${term}`);
}
const epub = readFileSync(`dist/${filename("epub")}`);
const zip = await JSZip.loadAsync(epub);
if (Object.keys(zip.files)[0] !== "mimetype") problems.push("EPUB: mimetype must be the first ZIP entry");
const validation = await EpubCheck.validate(new Uint8Array(epub));
for (const message of validation.messages ?? []) if (["fatal", "error", "warning"].includes(String(message.severity).toLowerCase())) problems.push(`EPUB ${message.severity}: ${message.message}`);
if (!validation.valid) problems.push("EPUB failed epubcheck validation");
const pdf = readFileSync(`dist/${filename("pdf")}`);
if (!pdf.subarray(0, 8).toString("ascii").startsWith("%PDF-") || !pdf.toString("ascii").trimEnd().endsWith("%%EOF")) problems.push("PDF: invalid header or missing EOF marker");
if (problems.length) {
  console.error(problems.map((p) => `FAIL ${p}`).join("\n"));
  process.exit(1);
}
console.log(`style ok; manuscript scaffold ok (${items.length} files, 31 part/chapter files); EPUB valid; PDF signature valid`);
