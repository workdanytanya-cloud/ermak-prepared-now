import { existsSync, readdirSync } from "node:fs";

if (!existsSync("dist/index.html")) {
  console.error("verify-dist: dist/index.html не найден");
  process.exit(1);
}

const js = readdirSync("dist/assets").filter((f) => f.endsWith(".js"));
if (js.length === 0) {
  console.error("verify-dist: нет JS в dist/assets");
  process.exit(1);
}

if (!existsSync("dist/build-id.txt")) {
  console.error("verify-dist: dist/build-id.txt не найден");
  process.exit(1);
}

console.log(`verify-dist: OK (${js.join(", ")})`);
