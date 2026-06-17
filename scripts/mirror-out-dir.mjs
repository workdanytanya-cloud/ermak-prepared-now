import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    const to = join(dest, name);
    if (statSync(from).isDirectory()) {
      copyDir(from, to);
    } else {
      mkdirSync(dirname(to), { recursive: true });
      writeFileSync(to, readFileSync(from));
    }
  }
}

const outDir = "dist";
const mirrorDir = "build";

if (!existsSync(outDir)) {
  console.error(`mirror-out-dir: ${outDir}/ не найден`);
  process.exit(1);
}

copyDir(outDir, mirrorDir);
console.log(`mirror-out-dir: ${outDir}/ → ${mirrorDir}/`);
