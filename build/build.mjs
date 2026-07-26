import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE, LOCALES, UI, HOME, FAQ, HOWTO, BLOG, ABOUT, PRIVACY, TERMS } from "./content.mjs";
import { page, url, absolute, adSlot, esc, link } from "./layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function emit(locale, path, html) {
  const dir = join(ROOT, locale === "en" ? "" : locale, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf8");
  return url(locale, path);
}

/* ---------- the editor, embedded in the landing page ------------------- */

function editor(locale) {
  const isJa = locale === "ja";
  const T = isJa
    ? {
        mode: "モードを選ぶ",
        hide: "隠して見せる",
        solid: "ソリッドモアレ (Solid Moiré)",
        swap: "2 枚入れ替え",
        drop: "画像をドロップ",
        dropMeta: "PNG または JPG。端末から送信されません。",
        dropB: "現れる画像をドロップ",
        dropBMeta: "長押しで現れる画像です。",
        hint: "1 枚の画像がタイムラインでは隠れ、長押しすると戻ります。",
        hintSolid: "透明度を使わず、ピクセルパターンを用いてタイムライン上で画像を単色のグレーのブロックとして隠します。",
        visible: "見せる部分",
        vNone: "すべて隠す",
        vNoneS: "タイムラインではほぼ空白になります。",
        vDark: "暗い部分を残す",
        vDarkS: "影と輪郭が予告として残ります。",
        vPaint: "手描きで指定",
        vPaintS: "サムネイルに残す範囲を塗ります。",
        threshold: "明るさのしきい値",
        vObject: "オブジェクトを選択",
        vObjectS: "対象をクリックすると輪郭に沿って選択され、そのまま表示されます。",
        tolerance: "許容範囲",
        toleranceS: "選択がどこまで色の違いを許すか。Alt を押しながらクリックで選択解除。",
        markAdd: "選択",
        markRemove: "解除",
        clearMarks: "選択を消去",
        blackPoint: "黒を締める",
        blackPointS: "トリックの前に暗部を黒に寄せます。ダークモードのタイムラインで効きます。",
        moireContrast: "モアレのコントラスト",
        moireContrastS: "コントラストを下げると、パターンがより自然に見えAI検知を回避しやすくなりますが、読みづらくなります。",
        groundLabel: "タイムラインの背景",
        groundLight: "ライト",
        groundDark: "ダーク",
        brush: "ブラシサイズ",
        keep: "残す",
        hideBrush: "また隠す",
        clear: "塗りを消去",
        output: "書き出し",
        size: "サイズ",
        auto: "自動 — 元の比率",
        upscale: "高解像度で読み込ませる",
        upscaleS: "推奨。長押し時に元ファイルを配信させます。",
        lineArt: "線画の予告を自動生成",
        lineArtS: "輪郭だけがタイムラインに残ります。",
        boost: "明るさを強調",
        boostS: "暗い背景でも現れる側が読めるようにします。",
        check: "投稿する前に",
        checkBody:
          "変化には X が元の PNG を配信する必要があるため、5 MB 未満に保ってください。X は予告なく画像処理を変更します。まず非公開アカウントでテスト投稿を。",
        status: "ステータス",
        outputKey: "出力",
        waiting: "待機中",
        start: "画像をドロップして開始",
        reset: "リセット",
        download: "PNG をダウンロード",
        noImage: "画像が読み込まれていません",
        hideTimeline: "タイムラインを隠す",
        fit: "全体表示",
        timeline: "タイムライン",
        timelineS: "X に表示される状態",
        full: "拡大表示",
        fullS: "長押しで現れる状態"
      }
    : {
        mode: "Pick a mode",
        hide: "Hide &amp; reveal",
        solid: "Solid Moiré",
        swap: "Two-image swap",
        drop: "Drop an image",
        dropMeta: "PNG or JPG. Nothing leaves your device.",
        dropB: "Drop the reveal image",
        dropBMeta: "The picture the tap uncovers.",
        hint: "One picture hides in the timeline and comes back when someone taps and holds it.",
        hintSolid: "The image hides as a solid gray block in the timeline using a pixel pattern, requiring no transparency.",
        visible: "What stays visible",
        vNone: "Hide everything",
        vNoneS: "The timeline shows an almost blank frame.",
        vDark: "Keep dark parts visible",
        vDarkS: "Shadows and outlines survive as a teaser.",
        vPaint: "Paint by hand",
        vPaintS: "Brush the areas that stay in the thumbnail.",
        threshold: "Brightness cutoff",
        vObject: "Mark objects",
        vObjectS: "Click an object and it is selected along its edges, then stays visible.",
        tolerance: "Tolerance",
        toleranceS: "How much colour variation a selection accepts. Alt-click to unmark.",
        markAdd: "Mark",
        markRemove: "Unmark",
        clearMarks: "Clear marks",
        blackPoint: "Deepen blacks",
        blackPointS: "Crushes shadows toward true black before the trick runs. This is what makes tones vanish on a dark-mode timeline.",
        moireContrast: "Moiré Pattern Contrast",
        moireContrastS: "Low contrast makes the pattern look more natural to avoid AI detection, but harder to read.",
        groundLabel: "Timeline background",
        groundLight: "Light",
        groundDark: "Dark",
        brush: "Brush size",
        keep: "Keep visible",
        hideBrush: "Hide again",
        clear: "Clear painting",
        output: "Output",
        size: "Size",
        auto: "Auto — original ratio",
        upscale: "Upscale for hi-res load",
        upscaleS: "Recommended. Pushes X to serve the original file on tap.",
        lineArt: "Auto line-art teaser",
        lineArtS: "Keeps the strongest edges readable in the timeline.",
        boost: "Brightness boost",
        boostS: "Lifts the reveal so it reads on a dark backdrop.",
        check: "Before you post",
        checkBody:
          "The reveal needs X to serve the original PNG, so keep the file under 5&nbsp;MB. Post it once from a private account first — X changes its image pipeline without warning.",
        status: "Status",
        outputKey: "Output",
        waiting: "Waiting",
        start: "Drop an image to start",
        reset: "Reset",
        download: "Download PNG",
        noImage: "No image loaded",
        hideTimeline: "Hide timeline",
        fit: "Fit",
        timeline: "Timeline",
        timelineS: "What X shows",
        full: "Full view",
        fullS: "What the tap reveals"
      };

  return `
        <div class="app-shell">
          <header class="topbar">
            <div class="readout" aria-label="Render status">
              <span class="readout-cell">
                <span class="readout-key">${T.status}</span>
                <strong id="statusText">${T.start}</strong>
              </span>
              <span class="readout-cell">
                <span class="readout-key">${T.outputKey}</span>
                <strong id="outputSize">${T.waiting}</strong>
              </span>
            </div>
            <div class="action-row">
              <button class="secondary-button" id="resetButton" type="button">${T.reset}</button>
              <button class="primary-button" id="downloadButton" type="button" disabled>${T.download}</button>
            </div>
          </header>

          <section class="creator-panel" aria-label="${T.output}">
            <section class="module">
              <div class="module-head"><span class="eyebrow">01</span><h3>${T.mode}</h3></div>
              <div class="rule" aria-hidden="true"></div>
              <div class="module-body">
                <div class="tabs" role="tablist">
                  <button class="tab is-active" id="modeHide" type="button" role="tab" aria-selected="true">${T.hide}</button>
                  <button class="tab" id="modeSolid" type="button" role="tab" aria-selected="false">${T.solid}</button>
                  <button class="tab" id="modeSwap" type="button" role="tab" aria-selected="false">${T.swap}</button>
                </div>
                <label class="drop-zone" for="sourceInput" id="sourceDrop">
                  <input id="sourceInput" type="file" accept="image/*">
                  <span class="drop-mark" aria-hidden="true"></span>
                  <span class="drop-title" id="sourceTitle">${T.drop}</span>
                  <span class="drop-meta" id="sourceMeta">${T.dropMeta}</span>
                </label>
                <label class="drop-zone" for="secondInput" id="secondDrop" hidden>
                  <input id="secondInput" type="file" accept="image/*">
                  <span class="drop-mark" aria-hidden="true"></span>
                  <span class="drop-title">${T.dropB}</span>
                  <span class="drop-meta" id="secondMeta">${T.dropBMeta}</span>
                </label>
                <p class="hint" id="modeHint">${T.hint}</p>
                <p class="hint" id="modeSolidHint" hidden>${T.hintSolid}</p>
              </div>
            </section>

            <section class="module" id="visibilityModule">
              <div class="module-head"><span class="eyebrow">02</span><h3>${T.visible}</h3></div>
              <div class="rule" aria-hidden="true"></div>
              <div class="module-body">
                <div class="choice-group" role="radiogroup" aria-label="${T.visible}">
                  <label class="choice">
                    <input type="radio" name="visibility" value="none" checked>
                    <span><strong>${T.vNone}</strong><small>${T.vNoneS}</small></span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="visibility" value="dark">
                    <span><strong>${T.vDark}</strong><small>${T.vDarkS}</small></span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="visibility" value="object">
                    <span><strong>${T.vObject}</strong><small>${T.vObjectS}</small></span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="visibility" value="paint">
                    <span><strong>${T.vPaint}</strong><small>${T.vPaintS}</small></span>
                  </label>
                </div>
                <label class="range-row" id="thresholdRow" hidden>
                  <span><strong>${T.threshold}</strong><em id="thresholdValue">150</em></span>
                  <input id="threshold" type="range" min="40" max="240" value="150">
                </label>

                <div class="paint-tools" id="objectTools" hidden>
                  <label class="range-row">
                    <span><strong>${T.tolerance}</strong><em id="toleranceValue">34</em></span>
                    <input id="tolerance" type="range" min="6" max="90" value="34">
                    <small class="range-note">${T.toleranceS}</small>
                  </label>
                  <div class="pattern-actions">
                    <button class="mini-button" id="markAdd" type="button" aria-pressed="true">${T.markAdd}</button>
                    <button class="mini-button" id="markRemove" type="button" aria-pressed="false">${T.markRemove}</button>
                  </div>
                  <button class="mini-button mini-button-wide" id="clearMarks" type="button">${T.clearMarks}</button>
                </div>

                <div class="paint-tools" id="paintTools" hidden>
                  <label class="range-row">
                    <span><strong>${T.brush}</strong><em id="brushSizeValue">64px</em></span>
                    <input id="brushSize" type="range" min="8" max="240" value="64">
                  </label>
                  <div class="pattern-actions">
                    <button class="mini-button" id="brushKeep" type="button" aria-pressed="true">${T.keep}</button>
                    <button class="mini-button" id="brushHide" type="button" aria-pressed="false">${T.hideBrush}</button>
                  </div>
                  <button class="mini-button mini-button-wide" id="clearPaint" type="button">${T.clear}</button>
                </div>
              </div>
            </section>

            <section class="module">
              <div class="module-head"><span class="eyebrow">03</span><h3>${T.output}</h3></div>
              <div class="rule" aria-hidden="true"></div>
              <div class="module-body">
                <label class="field-row">
                  <span>${T.size}</span>
                  <select id="outputRatio">
                    <option value="auto" selected>${T.auto}</option>
                    <option value="1:1">1:1 — 2432 x 2432</option>
                    <option value="2:3">2:3 — 1664 x 2432</option>
                    <option value="4:5">4:5 — 1946 x 2432</option>
                    <option value="9:16">9:16 — 1368 x 2432</option>
                    <option value="16:9">16:9 — 2432 x 1368</option>
                    <option value="3:2">3:2 — 2432 x 1621</option>
                  </select>
                </label>
                <label class="range-row">
                  <span><strong>${T.blackPoint}</strong><em id="blackPointValue">0</em></span>
                  <input id="blackPoint" type="range" min="0" max="90" value="0">
                  <small class="range-note">${T.blackPointS}</small>
                </label>
                <label class="range-row" id="moireContrastRow" hidden>
                  <span><strong>${T.moireContrast}</strong><em id="moireContrastValue">100%</em></span>
                  <input id="moireContrast" type="range" min="10" max="100" value="100">
                  <small class="range-note">${T.moireContrastS}</small>
                </label>

                <label class="toggle-row">
                  <span><strong>${T.upscale}</strong><small>${T.upscaleS}</small></span>
                  <input id="upscale" type="checkbox" checked>
                </label>
                <label class="toggle-row">
                  <span><strong>${T.lineArt}</strong><small>${T.lineArtS}</small></span>
                  <input id="lineArt" type="checkbox">
                </label>
                <label class="toggle-row">
                  <span><strong>${T.boost}</strong><small>${T.boostS}</small></span>
                  <input id="brightnessBoost" type="checkbox">
                </label>
              </div>
            </section>

            <section class="module">
              <div class="module-head"><span class="eyebrow">!</span><h3>${T.check}</h3></div>
              <div class="rule" aria-hidden="true"></div>
              <p class="hint">${T.checkBody}</p>
            </section>
          </section>

          <section class="simulator-panel" aria-label="Preview">
            <div class="sim-header">
              <div class="sim-title"><span id="renderBadge">${T.noImage}</span></div>
              <div class="canvas-toolbar">
                <button class="tool-button" id="timelineToggle" type="button">${T.hideTimeline}</button>
                <span class="toolbar-sep" aria-hidden="true"></span>
                <button class="icon-button" id="canvasZoomOut" type="button" aria-label="Zoom out">&minus;</button>
                <input id="canvasZoom" type="range" min="25" max="400" value="100" aria-label="Zoom">
                <span class="zoom-readout" id="canvasZoomValue">100%</span>
                <button class="icon-button" id="canvasZoomIn" type="button" aria-label="Zoom in">+</button>
                <button class="tool-button" id="canvasZoomReset" type="button">${T.fit}</button>
              </div>
            </div>
            <div class="preview-grid">
              <article class="preview-card is-hidden-state">
                <header class="preview-title">
                  <span class="state-dot" aria-hidden="true"></span>
                  <div class="preview-title-text">
                    <span class="eyebrow">${T.timeline}</span><strong>${T.timelineS}</strong>
                  </div>
                  <div class="ground-toggle" role="group" aria-label="${T.groundLabel}">
                    <button type="button" id="themeLight" class="ground-button is-active" aria-pressed="true">${T.groundLight}</button>
                    <button type="button" id="themeDark" class="ground-button" aria-pressed="false">${T.groundDark}</button>
                  </div>
                </header>
                <div class="image-stage preview-stage" id="timelineFrame">
                  <canvas id="timelineCanvas" width="680" height="425"></canvas>
                </div>
              </article>
              <article class="preview-card is-revealed-state">
                <header class="preview-title">
                  <span class="state-dot" aria-hidden="true"></span>
                  <div class="preview-title-text">
                    <span class="eyebrow">${T.full}</span><strong>${T.fullS}</strong>
                  </div>
                </header>
                <div class="image-stage expanded-stage" id="openedStage">
                  <div class="canvas-wrap">
                    <canvas id="openedCanvas" width="900" height="1125"></canvas>
                    <canvas id="paintOverlayCanvas" class="paint-overlay" width="900" height="1125" aria-hidden="true"></canvas>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>`;
}

/* ---------- the hero demo ---------------------------------------------
   The thesis of the page: not a headline about the effect, the effect. The
   plate is screened and washed out until you hold it, then it develops. */

function demoPlate(c) {
  return `
          <figure class="demo" id="demo">
            <div class="demo-plate" id="demoPlate" tabindex="0" role="button" aria-pressed="false"
                 data-hidden-label="${esc(c.demoHidden)}" data-held-label="${esc(c.demoRevealed)}">
              <svg class="demo-art" viewBox="0 0 400 500" aria-label="Demo artwork" role="img">
                <defs>
                  <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#ff6a2b"/>
                    <stop offset="0.55" stop-color="#c8324f"/>
                    <stop offset="1" stop-color="#2b1c4a"/>
                  </linearGradient>
                  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stop-color="#ffe6a8"/>
                    <stop offset="1" stop-color="#ffb03a"/>
                  </radialGradient>
                </defs>
                <rect width="400" height="500" fill="url(#sky)"/>
                <circle cx="200" cy="212" r="86" fill="url(#sun)"/>
                <path d="M0 330 L104 236 L182 316 L262 214 L400 348 L400 500 L0 500 Z" fill="#150f1c"/>
                <path d="M0 392 L92 330 L206 404 L318 340 L400 396 L400 500 L0 500 Z" fill="#0b0810"/>
                <g fill="#150f1c">
                  <circle cx="120" cy="150" r="5"/><circle cx="286" cy="128" r="7"/><circle cx="322" cy="176" r="4"/>
                </g>
              </svg>
              <span class="demo-screen" aria-hidden="true"></span>
              <span class="demo-hold" aria-hidden="true">${esc(c.demoHint)}</span>
            </div>
            <figcaption class="demo-caption">
              <span class="demo-state" id="demoState"></span>
            </figcaption>
          </figure>`;
}

/* ---------- pages -------------------------------------------------------- */

function homePage(locale) {
  const c = HOME[locale];
  const t = UI[locale];
  const faq = FAQ[locale].items.slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: SITE.name,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: absolute(locale),
      description: c.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const body = `
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${esc(c.heroEyebrow)}</p>
          <h1><span>${esc(c.heroTitle[0])}</span>${locale === "ja" ? "" : " "}${esc(
    c.heroTitle[1]
  )}</h1>
          <p class="lede">${esc(c.heroBody)}</p>
          <a class="cta" href="#main-editor">${esc(c.heroCta)}</a>
          <p class="hero-note">${esc(c.heroNote)}</p>
        </div>
        ${demoPlate(c)}
      </section>

      <section class="section" id="main-editor">
        <div class="section-head">
          <span class="eyebrow">${esc(c.editorEyebrow)}</span>
          <h2>${esc(c.editorTitle)}</h2>
        </div>
        ${editor(locale)}
      </section>
${adSlot(locale, "inline")}
      <section class="section">
        <div class="section-head">
          <span class="eyebrow">${esc(c.stepsEyebrow)}</span>
          <h2>${esc(c.stepsTitle)}</h2>
        </div>
        <ol class="steps">
          ${c.steps
            .map(
              (s, i) => `<li>
            <span class="step-index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
            <h3>${esc(s.h)}</h3>
            <p>${esc(s.p)}</p>
          </li>`
            )
            .join("\n          ")}
        </ol>
        <p class="section-more"><a href="${link(locale, "", locale, "how-to")}">${esc(c.howtoMore)} →</a></p>
      </section>

      <section class="section section-alt">
        <div class="section-head">
          <span class="eyebrow">${esc(c.whyEyebrow)}</span>
          <h2>${esc(c.whyTitle)}</h2>
        </div>
        <div class="cards">
          ${c.why
            .map(
              (w) => `<article class="card">
            <h3>${esc(w.h)}</h3>
            <p>${esc(w.p)}</p>
          </article>`
            )
            .join("\n          ")}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <span class="eyebrow">${esc(t.nav.faq)}</span>
          <h2>${esc(c.faqTitle)}</h2>
        </div>
        <div class="qa-list">
          ${faq
            .map(
              (f) => `<details class="qa">
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`
            )
            .join("\n          ")}
        </div>
        <p class="section-more"><a href="${link(locale, "", locale, "faq")}">${esc(c.faqMore)} →</a></p>
      </section>`;

  return page({
    locale,
    path: "",
    title: c.title,
    description: c.description,
    jsonLd,
    body,
    extraCss: "styles.css?v=2",
    extraJs: "app.js?v=3"
  });
}

function proseHeader(title, updated) {
  return `
      <header class="page-head">
        <h1>${esc(title)}</h1>
        ${updated ? `<p class="page-meta">${esc(updated)}</p>` : ""}
      </header>`;
}

function articlePage(locale, path, data, opts = {}) {
  const blocks = data.body || data.sections || [];
  const half = Math.ceil(blocks.length / 2);

  const rendered = blocks
    .map((b, i) => {
      const chunk = `${b.h ? `<h2>${esc(b.h)}</h2>` : ""}
        ${b.p.map((para) => `<p>${esc(para)}</p>`).join("\n        ")}`;
      // One ad break, roughly mid-article, never adjacent to the heading above it.
      return i === half && opts.ads ? `${adSlot(locale, "article")}\n        ${chunk}` : chunk;
    })
    .join("\n        ");

  const body = `
      <article class="prose">
        ${proseHeader(data.title, data.updated)}
        ${data.intro ? `<p class="lede">${esc(data.intro)}</p>` : ""}
        ${rendered}
      </article>`;

  return page({
    locale,
    path,
    title: data.title,
    description: data.description,
    jsonLd: opts.jsonLd,
    body
  });
}

function faqPage(locale) {
  const c = FAQ[locale];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];
  const half = Math.ceil(c.items.length / 2);

  const body = `
      <article class="prose">
        ${proseHeader(c.title)}
        <p class="lede">${esc(c.intro)}</p>
        <div class="qa-list">
          ${c.items
            .map(
              (f, i) =>
                `${i === half ? adSlot(locale, "article") + "\n          " : ""}<details class="qa"${
                  i === 0 ? " open" : ""
                }>
            <summary>${esc(f.q)}</summary>
            <p>${esc(f.a)}</p>
          </details>`
            )
            .join("\n          ")}
        </div>
      </article>`;

  return page({ locale, path: "faq", title: c.title, description: c.description, jsonLd, body });
}

function blogIndex(locale) {
  const c = BLOG[locale];
  const body = `
      <article class="prose">
        ${proseHeader(c.title)}
        <p class="lede">${esc(c.intro)}</p>
        <ul class="post-list">
          ${c.posts
            .map(
              (p) => `<li>
            <a href="${link(locale, "blog", locale, `blog/${p.slug}`)}">
              <time datetime="${p.date}">${p.date}</time>
              <h2>${esc(p.title)}</h2>
              <p>${esc(p.summary)}</p>
            </a>
          </li>`
            )
            .join("\n          ")}
        </ul>
      </article>`;

  return page({ locale, path: "blog", title: c.title, description: c.description, body });
}

function blogPost(locale, post) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      dateModified: post.date,
      description: post.summary,
      mainEntityOfPage: absolute(locale, `blog/${post.slug}`),
      author: { "@type": "Organization", name: SITE.name }
    }
  ];

  const half = Math.ceil(post.body.length / 2);
  const rendered = post.body
    .map((b, i) => {
      const chunk = `${b.h ? `<h2>${esc(b.h)}</h2>` : ""}
        ${b.p.map((para) => `<p>${esc(para)}</p>`).join("\n        ")}`;
      return i === half ? `${adSlot(locale, "article")}\n        ${chunk}` : chunk;
    })
    .join("\n        ");

  const body = `
      <article class="prose">
        <header class="page-head">
          <p class="page-meta"><time datetime="${post.date}">${post.date}</time></p>
          <h1>${esc(post.title)}</h1>
        </header>
        ${rendered}
        <p class="section-more"><a href="${link(locale, `blog/${post.slug}`, locale, "blog")}">← ${esc(BLOG[locale].title)}</a></p>
      </article>`;

  return page({
    locale,
    path: `blog/${post.slug}`,
    title: post.title,
    description: post.summary,
    jsonLd,
    body
  });
}

/* ---------- assets ------------------------------------------------------- */

/* Minimal RGB PNG writer. zlib ships with Node, so the share image needs no
   dependency and no design tool. */
function writePng(path, width, height, paint) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  const px = (x, y, r, g, b) => {
    const o = y * (width * 3 + 1) + 1 + x * 3;
    raw[o] = r;
    raw[o + 1] = g;
    raw[o + 2] = b;
  };
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) paint(px, x, y);

  const crcTable = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  const crc = (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const cr = Buffer.alloc(4);
    cr.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, cr]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0))
    ])
  );
}

function buildAssets() {
  /* The share card is the brand mark at scale: one half solid ink, one half
     halftone screen, on the safelight background. */
  writePng(join(ROOT, "og.png"), 1200, 630, (px, x, y) => {
    const cx = 600;
    const glow = Math.max(0, 1 - Math.hypot(x - 250, y + 60) / 780);
    let r = 20 + glow * 34;
    let g = 16 + glow * 12;
    let b = 14 + glow * 6;

    const inPlate = x > 300 && x < 900 && y > 165 && y < 465;
    if (inPlate) {
      if (x < cx) {
        // screened half
        const dot = (x % 10 < 4 && y % 10 < 4) ? 1 : 0;
        r = dot ? 255 : 30;
        g = dot ? 82 : 23;
        b = dot ? 31 : 19;
      } else {
        r = 255;
        g = 82;
        b = 31;
      }
      const edge = x < 306 || x > 894 || y < 171 || y > 459;
      if (edge) { r = 244; g = 234; b = 220; }
    }
    px(x, y, Math.round(r), Math.round(g), Math.round(b));
  });

  writeFileSync(
    join(ROOT, "icon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#14100e"/>
  <rect x="16" y="6" width="10" height="20" fill="#ff521f"/>
  <g fill="#ff521f">${Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) => `<circle cx="${7 + col * 4}" cy="${8 + row * 4}" r="1.4"/>`).join("")
  ).join("")}</g>
</svg>
`,
    "utf8"
  );
}

function buildSitemap(urls) {
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${SITE.domain}${u}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    )
    .join("\n");
  writeFileSync(
    join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemap-image/1.1" xmlns:x="x">
</urlset>`.replace(
      /<urlset[^>]*>[\s\S]*<\/urlset>/,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`
    ),
    "utf8"
  );

  writeFileSync(
    join(ROOT, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${SITE.domain}/sitemap.xml
`,
    "utf8"
  );
}

/* ---------- run ---------------------------------------------------------- */

function editorPage(locale) {
  const t = UI[locale];
  
  // Minimal translations for the editor page
  const title = t.nav.editor;
  const description = locale === "en" 
    ? "Pre-process your image: crop, resize, and adjust brightness before using the TapMe Studio maker."
    : "画像を前処理します：TapMe Studioメーカーを使用する前に、クロップ、サイズ変更、明るさの調整を行います。";
    
  const body = `
      <article class="prose">
        <header class="page-head">
          <h1>${esc(title)}</h1>
          <p class="lede">${esc(description)}</p>
        </header>
        
        <div class="pre-editor-container">
          <label class="drop-zone" for="preEditorInput" id="preEditorDrop">
            <input id="preEditorInput" type="file" accept="image/*">
            <span class="drop-mark" aria-hidden="true"></span>
            <span class="drop-title">${locale === "en" ? "Drop an image to edit" : "編集する画像をドロップ"}</span>
            <span class="drop-meta">${locale === "en" ? "PNG or JPG. Nothing leaves your device." : "PNG または JPG。端末から送信されません。"}</span>
          </label>
          
          <div id="preEditorWorkspace" class="pre-editor-workspace" hidden>
            <div class="pre-editor-toolbar">
              <label class="range-row">
                <span><strong>${locale === "en" ? "Brightness" : "明るさ"}</strong> <em id="peBrightnessValue">1.0</em></span>
                <input id="peBrightness" type="range" min="0.1" max="3.0" step="0.1" value="1.0">
              </label>
              
              <label class="field-row">
                <span>${locale === "en" ? "Target Crop / Aspect Ratio" : "クロップ / アスペクト比"}</span>
                <select id="peAspectRatio">
                  <option value="free">${locale === "en" ? "Free Crop" : "フリームーブ"}</option>
                  <option value="0.75" selected>3:4 (1536 x 2048)</option>
                  <option value="1">1:1 (2432 x 2432)</option>
                  <option value="0.6842">2:3 (1664 x 2432)</option>
                  <option value="0.8">4:5 (1946 x 2432)</option>
                  <option value="0.5625">9:16 (1368 x 2432)</option>
                  <option value="1.7777">16:9 (2432 x 1368)</option>
                  <option value="1.5">3:2 (2432 x 1621)</option>
                </select>
              </label>

              <label class="field-row">
                <span>${locale === "en" ? "Output Width" : "出力幅"}</span>
                <input id="peOutputWidth" type="number" value="1536" min="100" max="4000">
              </label>
              <label class="field-row">
                <span>${locale === "en" ? "Output Height" : "出力高さ"}</span>
                <input id="peOutputHeight" type="number" value="2048" min="100" max="4000">
              </label>
            </div>
            
            <div class="pre-editor-canvas-container" id="peCanvasContainer">
              <canvas id="peCanvas"></canvas>
            </div>
            
            <div class="action-row">
              <button class="secondary-button" id="peResetBtn" type="button">${t.nav.editor} ${locale === "en" ? "Reset" : "リセット"}</button>
              <button class="primary-button" id="peDownloadBtn" type="button">${locale === "en" ? "Download Result" : "結果をダウンロード"}</button>
            </div>
          </div>
        </div>
      </article>`;

  return page({
    locale,
    path: "editor",
    title,
    description,
    body,
    extraCss: "editor.css?v=1",
    extraJs: "editor.js?v=1"
  });
}

const written = [];

for (const locale of LOCALES) {
  if (locale !== "en" && existsSync(join(ROOT, locale))) rmSync(join(ROOT, locale), { recursive: true, force: true });

  written.push(emit(locale, "", homePage(locale)));
  written.push(emit(locale, "editor", editorPage(locale)));
  written.push(
    emit(
      locale,
      "how-to",
      articlePage(locale, "how-to", HOWTO[locale], {
        ads: true,
        /* The guide is the page most likely to earn a search result, so it
           gets the schema that can win a rich snippet. */
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: HOWTO[locale].title,
            description: HOWTO[locale].description,
            step: HOME[locale].steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.h,
              text: s.p
            }))
          }
        ]
      })
    )
  );
  written.push(emit(locale, "faq", faqPage(locale)));
  written.push(emit(locale, "about", articlePage(locale, "about", ABOUT[locale])));
  written.push(emit(locale, "privacy", articlePage(locale, "privacy", PRIVACY[locale])));
  written.push(emit(locale, "terms", articlePage(locale, "terms", TERMS[locale])));
  written.push(emit(locale, "blog", blogIndex(locale)));
  for (const post of BLOG[locale].posts) {
    written.push(emit(locale, `blog/${post.slug}`, blogPost(locale, post)));
  }
}

buildAssets();
buildSitemap(written);

console.log(`Built ${written.length} pages:`);
written.forEach((u) => console.log(`  ${u}`));
console.log("Assets: og.png, icon.svg, sitemap.xml, robots.txt");
