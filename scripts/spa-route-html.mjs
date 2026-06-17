/**
 * Для статического хостинга (Timeweb React): копирует index.html
 * в папки маршрутов, чтобы прямые ссылки /courses, /course/... открывались без 404.
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const indexPath = join(dist, "index.html");

const coursesFile = readFileSync(join(root, "src/data/courses.ts"), "utf8");
const courseIds = [...coursesFile.matchAll(/^\s+id:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);

const legacyRoutes = [
  "/engineeringtraining",
  "/raspisanie",
  "/deti",
  "/csp-deti",
  "/video2",
  "/samooborona",
  "/o-centre",
  "/otzyv",
  "/combattraining",
  "/smi",
];

const routes = [
  "/courses",
  "/privacy-policy",
  "/admin",
  ...legacyRoutes,
  ...courseIds.map((id) => `/course/${id}`),
];

function writeRoute(route) {
  const relative = route.replace(/^\//, "");
  const dir = join(dist, relative);
  mkdirSync(dir, { recursive: true });
  copyFileSync(indexPath, join(dir, "index.html"));
}

for (const route of routes) {
  writeRoute(route);
}

console.log(`spa-route-html: ${routes.length} маршрутов (копии index.html в dist/)`);
