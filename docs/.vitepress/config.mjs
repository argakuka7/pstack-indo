import { defineConfig } from "vitepress";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const manuscriptDir = resolve(rootDir, "manuscript");

function buildSidebar() {
  const files = readdirSync(manuscriptDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const items = files.map((file) => {
    const content = readFileSync(resolve(manuscriptDir, file), "utf8");
    const title = content.match(/^#\s+(.+)$/m)?.[1] || file;
    const id = file.replace(/\.md$/, "");
    return { file, id, title };
  });

  const groups = [];
  let currentGroup = null;

  for (const item of items) {
    if (item.file.startsWith("0")) {
      if (!currentGroup || currentGroup.key !== "front") {
        currentGroup = { key: "front", text: "Awal", collapsed: false, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push({ text: item.title, link: `/${item.id}` });
    } else if (item.file.includes("-part-")) {
      currentGroup = {
        key: item.id,
        text: `Bagian · ${item.title}`,
        collapsed: false,
        items: [
          { text: `Pengantar: ${item.title}`, link: `/${item.id}` }
        ]
      };
      groups.push(currentGroup);
    } else if (item.file.includes("-ch-")) {
      if (currentGroup) {
        currentGroup.items.push({ text: item.title, link: `/${item.id}` });
      }
    } else if (item.file.includes("-app-") || item.file.startsWith("9")) {
      if (!currentGroup || currentGroup.key !== "app") {
        currentGroup = { key: "app", text: "Lampiran", collapsed: false, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push({ text: item.title, link: `/${item.id}` });
    }
  }

  return groups.map(({ key, ...group }) => group);
}

export default defineConfig({
  lang: "id",
  title: "Panduan pstack",
  description: "Buku kerja rangka Bahasa Indonesia untuk plugin pstack di Cursor",
  cleanUrls: true,
  outDir: resolve(rootDir, "site"),
  srcDir: resolve(rootDir, "docs"),
  head: [
    ["meta", { name: "theme-color", content: "#1f6b88" }],
    ["meta", { name: "robots", content: "index, follow" }]
  ],
  themeConfig: {
    siteTitle: "Panduan pstack",
    nav: [
      { text: "Beranda", link: "/" },
      { text: "Mulai Membaca", link: "/01-front-colophon" },
      { text: "Daftar Isi", link: "/10-part-start" },
      { text: "Glosarium", link: "/92-app-glossary" },
      {
        text: "Unduh",
        items: [
          { text: "Edisi EPUB", link: "/pstack-guide-0.15.5-id.0.epub" },
          { text: "Edisi PDF", link: "/pstack-guide-0.15.5-id.0.pdf" }
        ]
      },
      { text: "GitHub", link: "https://github.com/cursor/plugins/tree/adf3218ca2f5b9971eedc07a76bef22df7701539/pstack" }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/madearga/pstack-indo" }
    ],
    sidebar: buildSidebar(),
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "Cari", buttonAriaLabel: "Cari di dokumentasi" },
          modal: {
            displayDetails: "Tampilkan detail",
            backButtonTitle: "Tutup pencarian",
            noResultsText: "Tidak ada hasil yang cocok",
            resetButtonTitle: "Bersihkan pencarian",
            footer: { selectText: "Pilih", navigateText: "Navigasi", closeText: "Tutup" }
          }
        }
      }
    },
    outline: {
      level: [2, 3],
      label: "Di halaman ini"
    },
    docFooter: {
      prev: "Sebelumnya",
      next: "Berikutnya"
    },
    sidebarMenuLabel: "Daftar isi",
    darkModeSwitchLabel: "Tema tampilan",
    lightModeSwitchTitle: "Beralih ke mode terang",
    darkModeSwitchTitle: "Beralih ke mode gelap",
    returnToTopLabel: "Kembali ke atas",
    footer: {
      message: "Edisi Bahasa Indonesia tidak resmi · Berdasarkan naskah asli Lauren Tan",
      copyright: "Lisensi MIT · Metadata sumber v0.15.5"
    }
  }
});
