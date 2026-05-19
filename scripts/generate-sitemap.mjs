import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const coursesFile = readFileSync(join(root, "src/data/courses.ts"), "utf8");

const siteUrl = (process.env.VITE_SITE_URL || "https://ermakcentr.ru").replace(/\/$/, "");
const courseIds = [...coursesFile.matchAll(/^\s+id:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/courses", changefreq: "weekly", priority: "0.9" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
];

const coursePages = courseIds.map((id) => ({
  loc: `/course/${id}`,
  changefreq: "weekly",
  priority: "0.8",
}));

const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = [...staticPages, ...coursePages]
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml, "utf8");
console.log(`sitemap.xml: ${staticPages.length + coursePages.length} URLs → ${siteUrl}/sitemap.xml`);
