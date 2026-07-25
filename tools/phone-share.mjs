/* Serves one folder to a phone on the same network, byte for byte.
 *
 * The whole point is what does NOT happen: the file is streamed unchanged and
 * sent with Content-Disposition: attachment, so Safari offers a download
 * instead of displaying the image. A displayed image can only be long-pressed
 * into the Photos library, and iOS re-encodes anything it hands back from
 * there — which strips the alpha channel and kills the effect before X ever
 * sees the file. Downloads land in the Files app, where the bytes survive.
 *
 *   node tools/phone-share.mjs [folder] [port]
 */
import { createServer } from "node:http";
import { readdir, stat, readFile } from "node:fs/promises";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { join, extname, basename, normalize } from "node:path";
import { networkInterfaces, homedir } from "node:os";

const FOLDER = process.argv[2] || join(homedir(), "Desktop", "Bilder fuers iPhone");
const PORT = Number(process.argv[3]) || 4322;

const TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime"
};

if (!existsSync(FOLDER)) mkdirSync(FOLDER, { recursive: true });

/* The address the phone has to reach. Skip loopback and virtual adapters —
   Hyper-V and WSL both add interfaces the phone cannot see. */
function lanAddresses() {
  const found = [];
  for (const [name, list] of Object.entries(networkInterfaces())) {
    for (const net of list || []) {
      if (net.family !== "IPv4" || net.internal) continue;
      if (/^(vEthernet|VirtualBox|VMware|Loopback)/i.test(name)) continue;
      found.push({ name, address: net.address });
    }
  }
  // 192.168.x and 10.x are the usual home ranges; put them first.
  return found.sort((a, b) => {
    const score = (ip) => (/^192\.168\./.test(ip) ? 0 : /^10\./.test(ip) ? 1 : 2);
    return score(a.address) - score(b.address);
  });
}

function human(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function listing() {
  let names = [];
  try {
    names = await readdir(FOLDER);
  } catch {
    names = [];
  }

  const files = [];
  for (const name of names) {
    if (name.startsWith(".")) continue;
    try {
      const info = await stat(join(FOLDER, name));
      if (info.isFile()) files.push({ name, size: info.size, time: info.mtimeMs });
    } catch {
      /* vanished between readdir and stat */
    }
  }
  files.sort((a, b) => b.time - a.time);

  const rows = files.length
    ? files
        .map((f) => {
          const type = TYPES[extname(f.name).toLowerCase()];
          const warn = f.size > 5 * 1024 * 1024 ? '<span class="warn">über 5 MB</span>' : "";
          return `<li>
      <a href="/f/${encodeURIComponent(f.name)}" download>
        <span class="name">${esc(f.name)}</span>
        <span class="meta">${human(f.size)}${type ? "" : " · kein Bild"} ${warn}</span>
      </a>
    </li>`;
        })
        .join("\n    ")
    : `<li class="empty">Noch nichts im Ordner. Leg ein PNG hinein und lade neu.</li>`;

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bilder aufs iPhone</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; padding:20px 16px 48px; background:#14100e; color:#f4eadc;
         font:16px/1.5 -apple-system, "Segoe UI", system-ui, sans-serif; }
  h1 { margin:0 0 4px; font-size:20px; letter-spacing:.02em; text-transform:uppercase; }
  .sub { margin:0 0 20px; color:#a08f80; font-size:13px; }
  ol { margin:0 0 22px; padding-left:20px; color:#a08f80; font-size:13.5px; }
  ol strong { color:#f4eadc; }
  ul { list-style:none; margin:0; padding:0; display:grid; gap:8px; }
  a { display:flex; flex-direction:column; gap:3px; padding:14px;
      border:1px solid rgba(244,234,220,.1); border-radius:4px;
      background:rgba(9,6,5,.42); color:inherit; text-decoration:none; }
  a:active { border-color:#ff521f; }
  .name { font-weight:600; word-break:break-all; }
  .meta { color:#a08f80; font-size:12.5px; font-variant-numeric:tabular-nums; }
  .warn { color:#ff8a5c; }
  .empty { padding:14px; color:#a08f80; font-size:14px; }
  .note { margin-top:26px; padding:14px; border-left:2px solid #ff521f;
          background:rgba(255,82,31,.06); color:#a08f80; font-size:13px; }
  .note strong { color:#f4eadc; }
</style>
</head>
<body>
  <h1>Bilder aufs iPhone</h1>
  <p class="sub">${files.length} Datei${files.length === 1 ? "" : "en"} · nur in deinem WLAN erreichbar</p>
  <ol>
    <li>Datei antippen &rarr; Safari fragt nach dem Download</li>
    <li><strong>„Laden"</strong> bestätigen &mdash; landet unter Dateien &rsaquo; Downloads</li>
    <li>In X das Bild über <strong>„Dateien durchsuchen"</strong> anhängen</li>
  </ol>
  <ul>
    ${rows}
  </ul>
  <p class="note"><strong>Nicht über Fotos.</strong> Wird das Bild in der Mediathek gespeichert und von
  dort hochgeladen, kodiert iOS es neu. Der Alphakanal geht verloren und das Bild verändert sich
  auf X nicht mehr.</p>
</body>
</html>`;
}

createServer(async (req, res) => {
  const path = decodeURIComponent((req.url || "/").split("?")[0]);

  if (path === "/" || path === "/index.html") {
    const html = await listing();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    res.end(html);
    return;
  }

  if (path.startsWith("/f/")) {
    // basename() alone stops any attempt to walk out of the folder.
    const name = basename(normalize(path.slice(3)));
    const file = join(FOLDER, name);

    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error("not a file");

      res.writeHead(200, {
        /* attachment is the whole trick: Safari downloads instead of
           displaying, so the file reaches Files rather than Photos. */
        "content-disposition": `attachment; filename="${name.replace(/"/g, "")}"`,
        "content-type": TYPES[extname(name).toLowerCase()] || "application/octet-stream",
        "content-length": info.size,
        "cache-control": "no-store"
      });
      createReadStream(file).pipe(res);
      console.log(`sent ${name} (${human(info.size)})`);
      return;
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Datei nicht gefunden");
      return;
    }
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("404");
}).listen(PORT, "0.0.0.0", () => {
  const addresses = lanAddresses();
  console.log("");
  console.log(`  Ordner:  ${FOLDER}`);
  console.log("");
  if (!addresses.length) {
    console.log("  Keine WLAN-Adresse gefunden. Ist der PC im Netzwerk?");
  } else {
    console.log("  Am iPhone in Safari eingeben:");
    console.log("");
    addresses.forEach((a, i) => {
      console.log(`      http://${a.address}:${PORT}${i === 0 ? "" : `      (${a.name})`}`);
    });
  }
  console.log("");
  console.log("  Beide Geräte müssen im selben WLAN sein.");
  console.log("  Fragt Windows nach der Firewall: Zugriff im privaten Netz erlauben.");
  console.log("");
});
