/* Inlines the built landing page into one self-contained file, for preview
   surfaces that cannot fetch sibling assets. Not part of the deployed site. */
import { readFileSync, writeFileSync } from "node:fs";

const [, , src = "index.html", out = "preview.html"] = process.argv;
let html = readFileSync(src, "utf8");

const inlineCss = (file) => `<style>\n${readFileSync(file, "utf8")}\n</style>`;
const inlineJs = (file) => `<script>\n${readFileSync(file, "utf8")}\n</script>`;

html = html
  .replace(/<link rel="stylesheet" href="\.\/site\.css[^"]*">/, inlineCss("site.css"))
  .replace(/<link rel="stylesheet" href="\.\/styles\.css[^"]*">/, inlineCss("styles.css"))
  .replace(/<script src="\.\/site\.js[^"]*"\s*defer><\/script>/, inlineJs("site.js"))
  .replace(/<script src="\.\/app\.js[^"]*"\s*defer><\/script>/, inlineJs("app.js"))
  .replace(/<link rel="icon"[^>]*>/, "");

writeFileSync(out, html, "utf8");
console.log(`${out}: ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB, remaining external refs:`,
  [...html.matchAll(/(?:src|href)="(?!#|mailto:|data:)([^"]+)"/g)].map((m) => m[1]).join(", ") || "none");
