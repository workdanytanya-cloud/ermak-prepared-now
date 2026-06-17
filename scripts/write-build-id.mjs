import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";

let sha = "unknown";
try {
  sha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
} catch {
  sha = process.env.VITE_BUILD_SHA || sha;
}

const stamp = `${sha} ${new Date().toISOString()}`;

writeFileSync("public/build-id.txt", stamp, "utf8");
if (existsSync("dist")) {
  writeFileSync("dist/build-id.txt", stamp, "utf8");
}

console.log(`build-id: ${stamp}`);
