/* A local static server that resolves directory URLs to index.html, the way
   Cloudflare Pages and Netlify do.
 *
 * Opening the built site straight off the disk does not work: `./ja/` is a
 * directory, and file:// has nothing to turn it into `./ja/index.html`. Rather
 * than rewriting every link to end in index.html — which would mean testing
 * URLs you never ship — serve the folder over HTTP and the local URLs match
 * production exactly.
 *
 *   npm run preview
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

async function resolve(pathname) {
  // Strip the query, decode, and refuse anything trying to climb out of ROOT.
  const clean = normalize(decodeURIComponent(pathname.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const target = join(ROOT, clean);
  if (!target.startsWith(ROOT)) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = join(target, "index.html");
      await stat(index);
      return index;
    }
    return target;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolve(req.url || "/");

  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(`404 — nothing at ${req.url}`);
    console.log(`404 ${req.url}`);
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(body);
    console.log(`200 ${req.url}`);
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`500 — ${error.message}`);
  }
}).listen(PORT, () => {
  console.log(`Tap Me Studio → http://localhost:${PORT}/`);
  console.log(`Japanese      → http://localhost:${PORT}/ja/`);
});
