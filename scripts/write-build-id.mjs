import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

function resolveBuildSha() {
  const fromEnv =
    process.env.TWC_COMMIT_SHA ||
    process.env.CI_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.SOURCE_COMMIT ||
    process.env.VITE_BUILD_SHA;

  if (fromEnv) return String(fromEnv).slice(0, 12);

  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const stamp = `${resolveBuildSha()} ${new Date().toISOString()}`;
writeFileSync("public/build-id.txt", stamp, "utf8");
console.log(`build-id: ${stamp}`);
