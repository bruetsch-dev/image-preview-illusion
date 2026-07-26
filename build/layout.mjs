import { SITE, UI } from "./content.mjs";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Locale-aware URL. English lives at the root, Japanese under /ja/. */
export function url(locale, path = "") {
  const base = locale === "en" ? "" : `/${locale}`;
  const clean = path ? `/${path}` : "";
  return `${base}${clean}/` || "/";
}

export function absolute(locale, path = "") {
  return SITE.domain + url(locale, path);
}

/* Depth of a page below the root, so assets can be referenced relatively and
   the site works from a file:// path as well as a domain. */
function assetPrefix(locale, path) {
  const depth = (locale === "en" ? 0 : 1) + (path ? path.split("/").length : 0);
  return depth === 0 ? "./" : "../".repeat(depth);
}

/* Every internal link is relative for the same reason: the built site opens
   correctly from a folder, not only from a domain root. */
function link(fromLocale, fromPath, toLocale, toPath = "") {
  const prefix = assetPrefix(fromLocale, fromPath);
  const target = (toLocale === "en" ? "" : `${toLocale}/`) + (toPath ? `${toPath}/` : "");
  return target ? prefix + target : prefix;
}

export function adSlot(locale, kind) {
  const t = UI[locale];
  const slot = kind === "article" ? SITE.ads.slotArticle : SITE.ads.slotInline;
  if (!SITE.ads.client || !slot) return "";
  return `
      <aside class="ad-slot" aria-label="${esc(t.adLabel)}">
        <span class="ad-label">${esc(t.adLabel)}</span>
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${esc(SITE.ads.client)}"
             data-ad-slot="${esc(slot)}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </aside>`;
}

function head({ locale, path, title, description, jsonLd, extraCss }) {
  const t = UI[locale];
  const p = assetPrefix(locale, path);
  const other = locale === "en" ? "ja" : "en";
  const ld = (jsonLd || [])
    .map((o) => `\n    <script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("");

  return `<!doctype html>
<html lang="${locale}" dir="${t.dir}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)} — ${esc(SITE.name)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${absolute(locale, path)}">
    <link rel="alternate" hreflang="en" href="${absolute("en", path)}">
    <link rel="alternate" hreflang="ja" href="${absolute("ja", path)}">
    <link rel="alternate" hreflang="x-default" href="${absolute("en", path)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(SITE.name)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${absolute(locale, path)}">
    <meta property="og:image" content="${SITE.domain}/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="${p}icon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${p}site.css?v=1">${extraCss ? `\n    <link rel="stylesheet" href="${p}${extraCss}">` : ""}${ld}
  </head>
  <body data-locale="${locale}" data-other-locale="${other}" data-other-url="${url(other, path)}">
    <a class="skip-link" href="#main">${esc(t.skip)}</a>`;
}

function header(locale, path) {
  const t = UI[locale];
  const nav = [
    ["", t.nav.home],
    ["editor", t.nav.editor],
    ["how-to", t.nav.howto],
    ["faq", t.nav.faq],
    ["blog", t.nav.blog],
    ["about", t.nav.about]
  ];
  const other = locale === "en" ? "ja" : "en";

  return `
    <header class="site-header">
      <a class="brand" href="${link(locale, path, locale)}">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="brand-text">Tap&nbsp;Me<em>Studio</em></span>
      </a>
      <nav class="site-nav" aria-label="Main">
        ${nav
          .map(
            ([slug, label]) =>
              `<a href="${link(locale, path, locale, slug)}"${
                (path || "").split("/")[0] === slug ? ' aria-current="page"' : ""
              }>${esc(label)}</a>`
          )
          .join("\n        ")}
      </nav>
      <a class="lang-switch" href="${link(locale, path, other, path)}" hreflang="${other}" lang="${other}">${esc(
    UI[locale].otherLangName
  )}</a>
    </header>`;
}

function footer(locale, path) {
  const t = UI[locale];
  return `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <h2>${esc(t.footer.product)}</h2>
          <a href="${link(locale, path, locale)}">${esc(t.nav.home)}</a>
          <a href="${link(locale, path, locale, "how-to")}">${esc(t.nav.howto)}</a>
          <a href="${link(locale, path, locale, "faq")}">${esc(t.nav.faq)}</a>
          <a href="${link(locale, path, locale, "blog")}">${esc(t.nav.blog)}</a>
        </div>
        <div class="footer-col">
          <h2>${esc(t.footer.company)}</h2>
          <a href="${link(locale, path, locale, "about")}">${esc(t.nav.about)}</a>
          <a href="${link(locale, path, locale, "privacy")}">${esc(t.footer.privacy)}</a>
          <a href="${link(locale, path, locale, "terms")}">${esc(t.footer.terms)}</a>
          <button type="button" class="link-button" data-consent-reopen>${esc(t.consent.title)}</button>
        </div>
        <div class="footer-col footer-contact">
          <h2>${esc(t.footer.contact)}</h2>
          <p>${esc(t.footer.contactLine)}</p>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
      </div>
      <p class="footer-note">${esc(t.footer.rights)}</p>
    </footer>

    <div class="consent" id="consent" hidden role="dialog" aria-modal="false" aria-labelledby="consentTitle">
      <div class="consent-body">
        <h2 id="consentTitle">${esc(t.consent.title)}</h2>
        <p>${esc(t.consent.body)} <a href="${link(locale, path, locale, "privacy")}">${esc(t.consent.more)}</a></p>
      </div>
      <div class="consent-actions">
        <button type="button" class="mini-button" data-consent="reject">${esc(t.consent.reject)}</button>
        <button type="button" class="mini-button mini-button-accent" data-consent="accept">${esc(
          t.consent.accept
        )}</button>
      </div>
    </div>`;
}

function scripts(locale, path, extraJs) {
  const p = assetPrefix(locale, path);
  const cfg = JSON.stringify({
    adsClient: SITE.ads.client,
    analyticsId: SITE.analyticsId
  });
  return `
    <script>window.__TMS__ = ${cfg};</script>
    <script src="${p}site.js?v=1" defer></script>${
      extraJs ? `\n    <script src="${p}${extraJs}" defer></script>` : ""
    }
  </body>
</html>
`;
}

export function page({ locale, path, title, description, jsonLd, body, extraCss, extraJs }) {
  return (
    head({ locale, path, title, description, jsonLd, extraCss }) +
    header(locale, path) +
    `\n    <main id="main">` +
    body +
    `\n    </main>` +
    footer(locale, path) +
    scripts(locale, path, extraJs)
  );
}

export { esc, link };
