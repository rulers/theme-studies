import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const output = path.resolve(process.argv[2] || "out");
const basePath = process.argv[3] || "";
const pages = [
  "",
  "themes/cube",
  "themes/focus300",
  "themes/move",
  "themes/move-v2",
  "themes/video",
];
let resources = 0;

function checkResource(url, sourceFile) {
  if (/^(data:|https?:|\/\/|#)/.test(url)) return;
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  let target;
  if (pathname.startsWith("/")) {
    assert.ok(
      pathname.startsWith(`${basePath}/`),
      `Missing basePath in ${url}`,
    );
    target = path.join(output, pathname.slice(basePath.length));
  } else target = path.resolve(path.dirname(sourceFile), pathname);
  assert.ok(existsSync(target), `Missing resource: ${url} in ${sourceFile}`);
  resources += 1;
}

for (const page of pages) {
  const filename = path.join(output, page, "index.html");
  assert.ok(existsSync(filename), `Missing exported page: ${page || "/"}`);
  const html = readFileSync(filename, "utf8");
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    // Navigation to the other edition is checked after the artifacts are merged.
    if (match[1].includes("/_next/") || match[1].includes("/images/")) {
      checkResource(match[1].replaceAll("&amp;", "&"), filename);
    }
  }
}

for (const file of readdirSync(output, { recursive: true })) {
  if (!file.endsWith(".css")) continue;
  const filename = path.join(output, file);
  for (const match of readFileSync(filename, "utf8").matchAll(
    /url\(["']?([^)'"\s]+)["']?\)/g,
  )) {
    checkResource(match[1], filename);
  }
}

for (const image of ["blue", "orange", "pink"]) {
  assert.ok(existsSync(path.join(output, "images", `${image}.svg`)));
}
console.log(
  `Verified ${pages.length} exported pages and ${resources} resource references at ${basePath || "/"}.`,
);
