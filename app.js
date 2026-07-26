/* Tap Me Studio
 *
 * Two ways to make an image change when someone taps and holds it on X, both
 * built on the same fact: the timeline composites the PNG over a light
 * background and shows a downscaled, recompressed copy, while the opened view
 * composites it over black at full resolution.
 *
 *   Hide & reveal  — one picture, dithered so it averages to the background
 *                    when it is scaled down, and reappears at 1:1.
 *   Two-image swap — per-pixel alpha solved so the file reads as picture A
 *                    over white and picture B over black.
 *
 * Everything runs in the browser. No image is uploaded anywhere.
 */
(function () {
  "use strict";

  const els = {
    statusText: document.getElementById("statusText"),
    outputSize: document.getElementById("outputSize"),
    renderBadge: document.getElementById("renderBadge"),
    resetButton: document.getElementById("resetButton"),
    downloadButton: document.getElementById("downloadButton"),

    modeHide: document.getElementById("modeHide"),
    modeSolid: document.getElementById("modeSolid"),
    modeSwap: document.getElementById("modeSwap"),
    modeHint: document.getElementById("modeHint"),
    modeSolidHint: document.getElementById("modeSolidHint"),

    sourceInput: document.getElementById("sourceInput"),
    sourceDrop: document.getElementById("sourceDrop"),
    sourceTitle: document.getElementById("sourceTitle"),
    sourceMeta: document.getElementById("sourceMeta"),
    secondInput: document.getElementById("secondInput"),
    secondDrop: document.getElementById("secondDrop"),
    secondMeta: document.getElementById("secondMeta"),

    visibilityModule: document.getElementById("visibilityModule"),
    paintTools: document.getElementById("paintTools"),
    brushSize: document.getElementById("brushSize"),
    brushSizeValue: document.getElementById("brushSizeValue"),
    moireContrast: document.getElementById("moireContrast"),
    moireContrastValue: document.getElementById("moireContrastValue"),
    brushKeep: document.getElementById("brushKeep"),
    brushHide: document.getElementById("brushHide"),
    clearPaint: document.getElementById("clearPaint"),

    outputRatio: document.getElementById("outputRatio"),
    upscale: document.getElementById("upscale"),
    lineArt: document.getElementById("lineArt"),
    brightnessBoost: document.getElementById("brightnessBoost"),
    thresholdRow: document.getElementById("thresholdRow"),
    threshold: document.getElementById("threshold"),
    thresholdValue: document.getElementById("thresholdValue"),
    blackPoint: document.getElementById("blackPoint"),
    blackPointValue: document.getElementById("blackPointValue"),
    objectTools: document.getElementById("objectTools"),
    tolerance: document.getElementById("tolerance"),
    toleranceValue: document.getElementById("toleranceValue"),
    markAdd: document.getElementById("markAdd"),
    markRemove: document.getElementById("markRemove"),
    clearMarks: document.getElementById("clearMarks"),
    themeLight: document.getElementById("themeLight"),
    themeDark: document.getElementById("themeDark"),

    timelineToggle: document.getElementById("timelineToggle"),
    canvasZoom: document.getElementById("canvasZoom"),
    canvasZoomValue: document.getElementById("canvasZoomValue"),
    canvasZoomIn: document.getElementById("canvasZoomIn"),
    canvasZoomOut: document.getElementById("canvasZoomOut"),
    canvasZoomReset: document.getElementById("canvasZoomReset"),

    timelineFrame: document.getElementById("timelineFrame"),
    timelineCanvas: document.getElementById("timelineCanvas"),
    openedStage: document.getElementById("openedStage"),
    openedCanvas: document.getElementById("openedCanvas"),
    paintOverlayCanvas: document.getElementById("paintOverlayCanvas")
  };

  /* Auto sizing only lifts small images to 2048 — pushing everything to the
     maximum just inflates the file, and the effect lives in the pixel grid,
     not in resolution. 4096 is the ceiling; past 5 MB X stops serving the
     original at all. */
  const AUTO_TARGET = 2048;
  const HARD_CAP = 4096;
  const X_SIZE_LIMIT = 5 * 1024 * 1024;

  /* X renders the timeline on one of two grounds depending on the reader's
     theme, and the hidden half of the checker averages against whichever one
     they are on. Which tones disappear therefore flips between them. */
  const TIMELINE_GROUND = { light: "#ffffff", dark: "#15202b" };

  /* A pixel counts as background when it is this close to white and connected
     to the border, and as an edge when the Sobel gradient clears this. */
  const BACKGROUND_LEVEL = 235;
  const EDGE_LEVEL = 42;

  const RATIOS = {
    auto: null,
    "1:1": { w: 2432, h: 2432 },
    "2:3": { w: 1664, h: 2432 },
    "4:5": { w: 1946, h: 2432 },
    "9:16": { w: 1368, h: 2432 },
    "16:9": { w: 2432, h: 1368 },
    "3:2": { w: 2432, h: 1621 }
  };

  /* One six-step grid for every channel keeps the export inside a 256-colour
     palette, so it can ship as PNG-8 instead of a much larger RGBA file. */
  const LEVELS = [0, 60, 120, 172, 214, 255];

  const BAYER8 = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ];

  const PAINT_KEEP = 1;
  const PAINT_HIDE = 2;

  const state = {
    mode: "hide",
    visibility: "none",
    ratio: "auto",
    upscale: true,
    lineArt: false,
    brightnessBoost: false,
    threshold: 150,
    blackPoint: 0,
    tolerance: 34,
    markAdds: true,
    timelineTheme: "light",
    brushSize: 64,
    moireContrast: 100,
    brushValue: PAINT_KEEP,

    imageA: null,
    imageB: null,
    nameA: "",
    nameB: "",

    paintMask: null,
    paintW: 0,
    paintH: 0,
    isPainting: false,

    zoom: 1,
    timelineVisible: true,
    analysis: null,
    output: null,
    outputBlob: null,
    renderTimer: 0,
    renderSerial: 0
  };

  /* ---------- small maths ---------------------------------------------- */

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mod = (v, n) => ((v % n) + n) % n;
  const luma = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
    return { h, s, l };
  }

  function hslToRgb(h, s, l) {
    if (s === 0) {
      const v = Math.round(l * 255);
      return { r: v, g: v, b: v };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const channel = (t) => {
      let tt = mod(t, 1);
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    return {
      r: Math.round(channel(h + 1 / 3) * 255),
      g: Math.round(channel(h) * 255),
      b: Math.round(channel(h - 1 / 3) * 255)
    };
  }

  /* ---------- canvas helpers -------------------------------------------- */

  function setCanvasSize(canvas, w, h) {
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }

  /* Fills the target box, cropping the overflow — matches how the fixed
     aspect-ratio presets are meant to behave. */
  function drawCover(ctx, image, w, h, clear = true) {
    const scale = Math.max(w / image.width, h / image.height);
    const dw = image.width * scale;
    const dh = image.height * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (clear) ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  /* Flattened onto a known background, so a source PNG with its own
     transparency cannot leak undefined pixels into the solve. */
  function imageToData(image, w, h, background = "#ffffff") {
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, w, h);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    drawCover(ctx, image, w, h, false);
    return ctx.getImageData(0, 0, w, h);
  }

  function dataToCanvas(imageData, w, h) {
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, w, h);
    canvas.getContext("2d").putImageData(imageData, 0, 0);
    return canvas;
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(blob);
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode failed")); };
      image.src = url;
    });
  }

  function outputDimensions() {
    const image = state.imageA;
    if (!image) return { w: 0, h: 0 };
    const preset = RATIOS[state.ratio];
    if (preset) return { w: preset.w, h: preset.h };

    // Auto keeps the source ratio and only resizes when it has to.
    let w = image.width;
    let h = image.height;
    const long = Math.max(w, h);

    if (state.upscale && long < AUTO_TARGET) {
      const scale = AUTO_TARGET / long;
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    if (Math.max(w, h) > HARD_CAP) {
      const scale = HARD_CAP / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    return { w: Math.max(1, w), h: Math.max(1, h) };
  }

  /* Deepen the shadows before the trick runs.
     A hidden pixel shows up as the average of its own colour and the timeline
     ground. On the dark ground that is (L + 32) / 2, so a tone only vanishes
     once it is genuinely close to black — anything merely dark still reads as
     a haze over the feed.

     This is a gamma curve, not a levels black point. Raising the black point
     rescales everything above it upward, which brightens the midtones and
     makes them *more* visible on a dark ground — the opposite of the goal.
     A gamma above 1 pulls the shadows down hard while leaving the highlights
     almost untouched, so the bright parts still carry the reveal. */
  function applyBlackPoint(data, amount) {
    if (amount <= 0) return;
    const gamma = 1 + amount / 32;
    const lut = new Uint8Array(256);
    for (let v = 0; v < 256; v += 1) {
      lut[v] = Math.round(255 * Math.pow(v / 255, gamma));
    }
    for (let i = 0; i < data.length; i += 4) {
      data[i] = lut[data[i]];
      data[i + 1] = lut[data[i + 1]];
      data[i + 2] = lut[data[i + 2]];
    }
  }

  /* ---------- image analysis -------------------------------------------- */

  /* Their pipeline and this one both key off the plain channel mean rather
     than perceptual luminance — it is what the visibility threshold is
     calibrated against. */
  function meanLuma(data, w, h) {
    const out = new Float32Array(w * h);
    for (let p = 0, i = 0; p < out.length; p += 1, i += 4) {
      out[p] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return out;
  }

  /* Flood fill inward from the border across near-white pixels. Those become
     fully transparent instead of checkered, so a white studio background
     disappears rather than showing as a grey haze. */
  function backgroundMask(lum, w, h) {
    const mask = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    const push = (p) => {
      if (!mask[p] && lum[p] >= BACKGROUND_LEVEL) {
        mask[p] = 1;
        queue[tail++] = p;
      }
    };

    for (let x = 0; x < w; x += 1) { push(x); push((h - 1) * w + x); }
    for (let y = 0; y < h; y += 1) { push(y * w); push(y * w + w - 1); }

    while (head < tail) {
      const p = queue[head++];
      const x = p % w;
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (p >= w) push(p - w);
      if (p < w * (h - 1)) push(p + w);
    }
    return mask;
  }

  function edgeMask(lum, w, h) {
    const mask = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const p = y * w + x;
        const gx =
          -lum[p - w - 1] - 2 * lum[p - 1] - lum[p + w - 1] +
          lum[p - w + 1] + 2 * lum[p + 1] + lum[p + w + 1];
        const gy =
          -lum[p - w - 1] - 2 * lum[p - w] - lum[p - w + 1] +
          lum[p + w - 1] + 2 * lum[p + w] + lum[p + w + 1];
        if (Math.sqrt(gx * gx + gy * gy) > EDGE_LEVEL) mask[p] = 1;
      }
    }
    return mask;
  }

  /* "Keep dark parts" otherwise leaves a dusting of isolated dark pixels that
     reads as noise in the thumbnail. Label the dark regions on a coarse grid
     and drop the ones too small to be part of the subject. */
  function speckleMask(lum, w, h, threshold) {
    const step = Math.max(1, Math.ceil(Math.max(w, h) / 512));
    const gw = Math.ceil(w / step);
    const gh = Math.ceil(h / step);

    const dark = new Uint8Array(gw * gh);
    for (let gy = 0; gy < gh; gy += 1) {
      const sy = Math.min(h - 1, gy * step) * w;
      for (let gx = 0; gx < gw; gx += 1) {
        dark[gy * gw + gx] = lum[sy + Math.min(w - 1, gx * step)] < threshold ? 1 : 0;
      }
    }

    const label = new Int32Array(gw * gh);
    const queue = new Int32Array(gw * gh);
    const sizes = [0];
    let next = 1;

    for (let start = 0; start < gw * gh; start += 1) {
      if (!dark[start] || label[start]) continue;
      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      label[start] = next;
      let size = 0;

      while (head < tail) {
        const p = queue[head++];
        size += 1;
        const x = p % gw;
        const visit = (q) => {
          if (dark[q] && !label[q]) { label[q] = next; queue[tail++] = q; }
        };
        if (x > 0) visit(p - 1);
        if (x < gw - 1) visit(p + 1);
        if (p >= gw) visit(p - gw);
        if (p < gw * (gh - 1)) visit(p + gw);
      }
      sizes.push(size);
      next += 1;
    }

    const minimum = Math.max(4, Math.round(gw * gh * 0.0015));
    const drop = new Uint8Array(gw * gh);
    for (let p = 0; p < gw * gh; p += 1) {
      if (label[p] && sizes[label[p]] < minimum) drop[p] = 1;
    }
    return { drop, gw, gh, step };
  }

  /* ---------- object marker ----------------------------------------------
     A click grows a region outward from the pixel under the cursor: keep
     going while the colour still resembles the one clicked, and stop at
     strong edges. That combination is what makes it follow an object instead
     of bleeding across the whole picture the way a plain colour match does. */

  function markObjectAt(px, py, add) {
    const info = state.analysis;
    if (!info) return false;

    const { src, lum, w, h } = info;
    const seed = Math.round(py) * w + Math.round(px);
    if (seed < 0 || seed >= w * h) return false;

    const mask = ensurePaintMask(w, h);
    const sr = src[seed * 4];
    const sg = src[seed * 4 + 1];
    const sb = src[seed * 4 + 2];

    const tolerance = state.tolerance;
    const limit = tolerance * tolerance * 3;
    // Loosen the edge stop as tolerance rises, or a high tolerance would
    // still be fenced in by the first contour it meets.
    const edgeStop = EDGE_LEVEL + tolerance * 2.2;

    const seen = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;
    queue[tail++] = seed;
    seen[seed] = 1;

    const value = add ? PAINT_KEEP : 0;
    let painted = 0;

    while (head < tail) {
      const p = queue[head++];
      mask[p] = value;
      painted += 1;

      const x = p % w;
      const y = (p / w) | 0;

      const visit = (q) => {
        if (seen[q]) return;
        seen[q] = 1;

        const i = q * 4;
        const dr = src[i] - sr;
        const dg = src[i + 1] - sg;
        const db = src[i + 2] - sb;
        if (dr * dr + dg * dg + db * db > limit) return;

        // Local gradient: a hard boundary ends the region.
        const qx = q % w;
        const qy = (q / w) | 0;
        if (qx > 0 && qx < w - 1 && qy > 0 && qy < h - 1) {
          const gx = lum[q + 1] - lum[q - 1];
          const gy = lum[q + w] - lum[q - w];
          if (Math.sqrt(gx * gx + gy * gy) > edgeStop) return;
        }

        queue[tail++] = q;
      };

      if (x > 0) visit(p - 1);
      if (x < w - 1) visit(p + 1);
      if (y > 0) visit(p - w);
      if (y < h - 1) visit(p + w);
    }

    return painted > 0;
  }

  /* ---------- paint mask ------------------------------------------------ */

  function ensurePaintMask(w, h) {
    if (state.paintMask && state.paintW === w && state.paintH === h) return state.paintMask;
    const next = new Uint8Array(w * h);
    if (state.paintMask && state.paintW > 0 && state.paintH > 0) {
      // Keep existing strokes when the output size changes.
      const sx = state.paintW / w;
      const sy = state.paintH / h;
      for (let y = 0; y < h; y += 1) {
        const oy = Math.min(state.paintH - 1, Math.floor(y * sy));
        for (let x = 0; x < w; x += 1) {
          next[y * w + x] = state.paintMask[oy * state.paintW + Math.min(state.paintW - 1, Math.floor(x * sx))];
        }
      }
    }
    state.paintMask = next;
    state.paintW = w;
    state.paintH = h;
    return next;
  }

  function clearPaintMask() {
    if (state.paintMask) state.paintMask.fill(0);
    scheduleRender();
  }

  /* ---------- build: hide & reveal --------------------------------------
     Every pixel keeps its own colour. What changes is the alpha: visible
     pixels stay solid, hidden ones alternate on a one-pixel checker so the
     feed's downscale averages them into the background, and background
     pixels drop out entirely.

     Washing the hidden colour toward white — which an earlier version did —
     costs contrast in the reveal for nothing: the checker already does the
     hiding. */

  function buildHideReveal(dims) {
    const { w, h } = dims;
    const source = imageToData(state.imageA, w, h, "#ffffff");
    const src = source.data;
    applyBlackPoint(src, state.blackPoint);
    const out = new ImageData(w, h);
    const dst = out.data;

    const lum = meanLuma(src, w, h);
    const background = backgroundMask(lum, w, h);
    const edges = state.lineArt ? edgeMask(lum, w, h) : null;
    // Paint and object marking are both mask-driven: hidden until marked.
    const masked = state.visibility === "paint" || state.visibility === "object";
    const mask = masked ? ensurePaintMask(w, h) : null;
    const threshold = state.threshold;
    const speckles =
      state.visibility === "dark" ? speckleMask(lum, w, h, threshold) : null;
    const boost = state.brightnessBoost ? 1.18 : 1;

    // 0 visible, 1 hidden, 2 edge, 3 background — needed again for the preview.
    const kind = new Uint8Array(w * h);

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const p = y * w + x;
        const i = p * 4;
        const brush = mask ? mask[p] : 0;

        dst[i] = src[i];
        dst[i + 1] = src[i + 1];
        dst[i + 2] = src[i + 2];

        /* Painted "keep" always wins; painted "hide" always hides; otherwise
           the mode decides. */
        let hidden =
          brush !== PAINT_KEEP &&
          (brush === PAINT_HIDE ||
            state.visibility === "none" ||
            masked ||
            lum[p] >= threshold);

        // Sweep up dark specks that would only read as noise once scaled down.
        if (!hidden && brush === 0 && speckles) {
          const g =
            Math.min(speckles.gh - 1, (y / speckles.step) | 0) * speckles.gw +
            Math.min(speckles.gw - 1, (x / speckles.step) | 0);
          if (speckles.drop[g]) hidden = true;
        }

        if (!hidden) {
          dst[i + 3] = 255;
          continue;
        }

        if (background[p]) {
          dst[i + 3] = 0;
          kind[p] = 3;
          continue;
        }

        if (edges && edges[p]) {
          // The teaser is solid, so it survives the downscale intact.
          dst[i] = 20;
          dst[i + 1] = 20;
          dst[i + 2] = 20;
          dst[i + 3] = 255;
          kind[p] = 2;
          continue;
        }

        kind[p] = 1;
        if (boost > 1) {
          dst[i] = Math.min(255, src[i] * boost);
          dst[i + 1] = Math.min(255, src[i + 1] * boost);
          dst[i + 2] = Math.min(255, src[i + 2] * boost);
        }
        dst[i + 3] = ((x + y) & 1) === 0 ? 255 : 0;
      }
    }

    state.analysis = { src, lum, w, h };
    return { imageData: out, width: w, height: h, indexed: true, kind };
  }

  function buildSolid(dims) {
    const { w, h } = dims;
    const source = imageToData(state.imageA, w, h, "#ffffff");
    const src = source.data;
    applyBlackPoint(src, state.blackPoint);
    const out = new ImageData(w, h);
    const dst = out.data;

    const lum = meanLuma(src, w, h);
    const masked = state.visibility === "paint" || state.visibility === "object";
    const mask = masked ? ensurePaintMask(w, h) : null;
    const threshold = state.threshold;
    const speckles = state.visibility === "dark" ? speckleMask(lum, w, h, threshold) : null;
    const boost = state.brightnessBoost ? 1.18 : 1;
    const kind = new Uint8Array(w * h);
    
    // Moiré contrast (0.1 to 1.0)
    const contrast = state.moireContrast / 100.0;

    for (let y = 0; y < h; y += 1) {
      // 2px horizontal scanlines
      const isPatternRow = Math.floor(y / 2) % 2 !== 0;
      for (let x = 0; x < w; x += 1) {
        const p = y * w + x;
        const i = p * 4;
        const brush = mask ? mask[p] : 0;

        let hidden =
          brush !== PAINT_KEEP &&
          (brush === PAINT_HIDE ||
            state.visibility === "none" ||
            masked ||
            lum[p] >= threshold);

        if (!hidden && brush === 0 && speckles) {
          const g =
            Math.min(speckles.gh - 1, (y / speckles.step) | 0) * speckles.gw +
            Math.min(speckles.gw - 1, (x / speckles.step) | 0);
          if (speckles.drop[g]) hidden = true;
        }

        dst[i + 3] = 255;
        kind[p] = hidden ? 1 : 0;

        if (!hidden) {
          dst[i] = src[i];
          dst[i + 1] = src[i + 1];
          dst[i + 2] = src[i + 2];
        } else {
          let r = src[i];
          let g = src[i + 1];
          let b = src[i + 2];
          if (boost > 1) {
            r = Math.min(255, r * boost);
            g = Math.min(255, g * boost);
            b = Math.min(255, b * boost);
          }

          if (!isPatternRow) {
            dst[i] = r;
            dst[i + 1] = g;
            dst[i + 2] = b;
          } else {
            dst[i] = r + (255 - 2 * r) * contrast;
            dst[i + 1] = g + (255 - 2 * g) * contrast;
            dst[i + 2] = b + (255 - 2 * b) * contrast;
          }
        }
      }
    }
    state.analysis = { src, lum, w, h };
    return { imageData: out, width: w, height: h, indexed: true, kind };
  }

  /* ---------- build: two-image swap --------------------------------------
     Solving one pixel:
       over white  ->  c*a + 255*(1-a) = A
       over black  ->  c*a             = B
     Subtracting shows the constraint: the two composites can only differ by
     255*(1-a), one achromatic number per pixel, so two arbitrary colour
     pictures are impossible.

     Rather than fight it, both images are squeezed into complementary
     brightness bands — A into [split, 255], B into [0, split] — which makes
     A >= B true everywhere by construction, and desaturated slightly so the
     colour that does bleed between the states is less obvious. */

  function buildSwap(dims) {
    const { w, h } = dims;
    const top = imageToData(state.imageA, w, h, "#ffffff").data;
    const under = imageToData(state.imageB, w, h, "#000000").data;
    // Only the revealed image benefits; crushing the timeline image would
    // fight the brightness band it gets compressed into.
    applyBlackPoint(under, state.blackPoint);
    const out = new ImageData(w, h);
    const dst = out.data;

    // A higher split brightens the timeline image and darkens the reveal.
    const split = state.brightnessBoost ? 148 : 116;
    const upper = (255 - split) / 255;
    const lower = split / 255;
    const KEEP = 0.75; // how much of each channel's own colour survives

    for (let i = 0; i < dst.length; i += 4) {
      const aMean = (top[i] + top[i + 1] + top[i + 2]) / 3;
      const bMean = (under[i] + under[i + 1] + under[i + 2]) / 3;

      const ar = split + (aMean + KEEP * (top[i] - aMean)) * upper;
      const ag = split + (aMean + KEEP * (top[i + 1] - aMean)) * upper;
      const ab = split + (aMean + KEEP * (top[i + 2] - aMean)) * upper;

      const br = (bMean + KEEP * (under[i] - bMean)) * lower;
      const bg = (bMean + KEEP * (under[i + 1] - bMean)) * lower;
      const bb = (bMean + KEEP * (under[i + 2] - bMean)) * lower;

      let alpha = 1 - ((ar + ag + ab) / 3 - (br + bg + bb) / 3) / 255;
      alpha = clamp(alpha, 1 / 255, 1);

      dst[i] = Math.min(255, br / alpha);
      dst[i + 1] = Math.min(255, bg / alpha);
      dst[i + 2] = Math.min(255, bb / alpha);
      dst[i + 3] = Math.round(alpha * 255);
    }

    return { imageData: out, width: w, height: h, indexed: false };
  }

  /* ---------- PNG-8 encoder --------------------------------------------- */

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(typeBytes, data) {
    let crc = 0xffffffff;
    for (let i = 0; i < typeBytes.length; i += 1) crc = crcTable[(crc ^ typeBytes[i]) & 255] ^ (crc >>> 8);
    for (let i = 0; i < data.length; i += 1) crc = crcTable[(crc ^ data[i]) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function writeUint32(bytes, offset, value) {
    bytes[offset] = (value >>> 24) & 255;
    bytes[offset + 1] = (value >>> 16) & 255;
    bytes[offset + 2] = (value >>> 8) & 255;
    bytes[offset + 3] = value & 255;
  }

  function pngChunk(type, data) {
    const typeBytes = new TextEncoder().encode(type);
    const chunk = new Uint8Array(12 + data.length);
    writeUint32(chunk, 0, data.length);
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    writeUint32(chunk, 8 + data.length, crc32(typeBytes, data));
    return chunk;
  }

  function concatBytes(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => { merged.set(part, offset); offset += part.length; });
    return merged;
  }

  async function deflateBytes(bytes) {
    if (!("CompressionStream" in window)) return null;
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  /* Median-cut quantiser. Now that pixels keep their original colours the
     export no longer fits a fixed palette, but PNG-8 is what keeps the file
     under X's limit — so build a 256-entry palette from the image itself.

     Colours are bucketed at 5 bits per channel first: exact enough for a
     palette this small, and it turns millions of pixels into at most 32768
     buckets to sort. */
  function quantise(data, w, h, maxColours) {
    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const key = ((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3);
      const hit = buckets.get(key);
      if (hit) {
        hit.n += 1;
        hit.r += data[i];
        hit.g += data[i + 1];
        hit.b += data[i + 2];
      } else {
        buckets.set(key, { n: 1, r: data[i], g: data[i + 1], b: data[i + 2] });
      }
    }

    const entries = [...buckets.entries()].map(([key, v]) => ({
      key,
      n: v.n,
      r: v.r / v.n,
      g: v.g / v.n,
      b: v.b / v.n
    }));
    if (!entries.length) return null;

    let boxes = [entries];
    while (boxes.length < maxColours) {
      // Split whichever box still covers the most pixels and can be divided.
      let pick = -1;
      let best = 0;
      boxes.forEach((box, index) => {
        if (box.length < 2) return;
        const weight = box.reduce((sum, e) => sum + e.n, 0);
        if (weight > best) { best = weight; pick = index; }
      });
      if (pick < 0) break;

      const box = boxes[pick];
      let rlo = 255, rhi = 0, glo = 255, ghi = 0, blo = 255, bhi = 0;
      for (const e of box) {
        if (e.r < rlo) rlo = e.r; if (e.r > rhi) rhi = e.r;
        if (e.g < glo) glo = e.g; if (e.g > ghi) ghi = e.g;
        if (e.b < blo) blo = e.b; if (e.b > bhi) bhi = e.b;
      }
      const dr = rhi - rlo, dg = ghi - glo, db = bhi - blo;
      const channel = dr >= dg && dr >= db ? "r" : dg >= db ? "g" : "b";
      box.sort((p, q) => p[channel] - q[channel]);

      // Split at the median pixel weight, not the median entry.
      const total = box.reduce((sum, e) => sum + e.n, 0);
      let running = 0;
      let cut = 1;
      for (let i = 0; i < box.length - 1; i += 1) {
        running += box[i].n;
        if (running >= total / 2) { cut = i + 1; break; }
      }
      boxes.splice(pick, 1, box.slice(0, cut), box.slice(cut));
    }

    const palette = [];
    const lookup = new Map();
    boxes.forEach((box) => {
      let n = 0, r = 0, g = 0, b = 0;
      for (const e of box) { n += e.n; r += e.r * e.n; g += e.g * e.n; b += e.b * e.n; }
      if (!n) return;
      const index = palette.length;
      palette.push([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
      for (const e of box) lookup.set(e.key, index);
    });

    return { palette, lookup };
  }

  async function encodeIndexedPng(imageData, w, h) {
    const data = imageData.data;
    // One entry is spent on the transparent colour, the rest carry the image.
    const quantised = quantise(data, w, h, 255);
    if (!quantised) return null;

    const { palette, lookup } = quantised;
    const transparentIndex = palette.length;
    palette.push([255, 255, 255]);

    const scanlines = new Uint8Array((w + 1) * h);
    let hasTransparent = false;
    for (let y = 0; y < h; y += 1) {
      const row = y * (w + 1);
      scanlines[row] = 0;
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        if (data[i + 3] === 0) {
          scanlines[row + x + 1] = transparentIndex;
          hasTransparent = true;
          continue;
        }
        const key = ((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3);
        const hit = lookup.get(key);
        scanlines[row + x + 1] = hit === undefined ? 0 : hit;
      }
    }

    const compressed = await deflateBytes(scanlines);
    if (!compressed) return null;

    const ihdr = new Uint8Array(13);
    writeUint32(ihdr, 0, w);
    writeUint32(ihdr, 4, h);
    ihdr[8] = 8;
    ihdr[9] = 3;

    const plte = new Uint8Array(palette.length * 3);
    palette.forEach((color, index) => {
      plte[index * 3] = color[0];
      plte[index * 3 + 1] = color[1];
      plte[index * 3 + 2] = color[2];
    });

    /* tRNS runs from index 0 up to the last non-opaque entry. The transparent
       colour is last, so the chunk has to cover the whole palette. */
    const alpha = new Uint8Array(palette.length).fill(255);
    alpha[transparentIndex] = 0;

    const chunks = [
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk("IHDR", ihdr),
      pngChunk("PLTE", plte)
    ];

    if (hasTransparent) {
      chunks.push(pngChunk("tRNS", alpha));
    }

    chunks.push(
      pngChunk("IDAT", compressed),
      pngChunk("IEND", new Uint8Array(0))
    );

    return new Blob(
      [concatBytes(chunks)],
      { type: "image/png" }
    );
  }

  async function encodeOutput(output) {
    if (output.indexed) {
      const indexed = await encodeIndexedPng(output.imageData, output.width, output.height);
      if (indexed) return { blob: indexed, format: "PNG-8" };
    }
    const canvas = dataToCanvas(output.imageData, output.width, output.height);
    const blob = await canvasToBlob(canvas, "image/png");
    return { blob, format: "PNG-32" };
  }

  /* ---------- previews --------------------------------------------------- */

  function compositeCanvas(output, background) {
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, output.width, output.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, output.width, output.height);
    ctx.drawImage(dataToCanvas(output.imageData, output.width, output.height), 0, 0);
    return canvas;
  }

  /* The timeline is the honest test: composite over X's light background,
     scale it down the way the feed does, then run it through JPEG. */
  async function drawTimeline(output) {
    const frameWidth = 680;
    const aspect = output.height / output.width;
    const frameHeight = Math.round(clamp(frameWidth * aspect, 190, 460));
    setCanvasSize(els.timelineCanvas, frameWidth, frameHeight);
    els.timelineFrame.style.setProperty("--frame-aspect", `${frameWidth} / ${frameHeight}`);

    const scaled = document.createElement("canvas");
    setCanvasSize(scaled, frameWidth, frameHeight);
    const scaledCtx = scaled.getContext("2d");
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = "high";
    const ground = TIMELINE_GROUND[state.timelineTheme] || TIMELINE_GROUND.light;
    scaledCtx.fillStyle = ground;
    scaledCtx.fillRect(0, 0, frameWidth, frameHeight);

    const composited = compositeCanvas(output, ground);
    const scale = Math.min(frameWidth / output.width, frameHeight / output.height);
    const dw = output.width * scale;
    const dh = output.height * scale;
    scaledCtx.drawImage(composited, (frameWidth - dw) / 2, (frameHeight - dh) / 2, dw, dh);

    /* Hide & reveal depends on the feed's recompression wiping the dither, so
       it gets the harsh setting. A swap survives on background compositing
       instead, and crushing it that hard would understate the result. */
    const quality = state.mode === "swap" ? 0.85 : 0.42;
    const ctx = els.timelineCanvas.getContext("2d");
    const blob = await canvasToBlob(scaled, "image/jpeg", quality);
    if (!blob) { ctx.drawImage(scaled, 0, 0); return; }
    ctx.drawImage(await blobToImage(blob), 0, 0, frameWidth, frameHeight);
  }

  function fitScale(output) {
    const w = Math.max(1, els.openedStage.clientWidth - 36);
    const h = Math.max(1, els.openedStage.clientHeight - 36);
    return Math.min(w / output.width, h / output.height, 1);
  }

  function drawOpened(output) {
    const scale = fitScale(output) * state.zoom;
    const w = Math.max(1, Math.round(output.width * scale));
    const h = Math.max(1, Math.round(output.height * scale));

    setCanvasSize(els.openedCanvas, w, h);
    setCanvasSize(els.paintOverlayCanvas, w, h);

    const ctx = els.openedCanvas.getContext("2d");
    // Disable smoothing for solid mode so the preview shows the actual pattern instead of blurring it
    ctx.imageSmoothingEnabled = state.mode === "solid" ? false : (scale < 1);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(dataToCanvas(output.imageData, output.width, output.height), 0, 0, w, h);

    drawPaintOverlay(output, w, h);
  }

  function drawPaintOverlay(output, w, h) {
    const ctx = els.paintOverlayCanvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    const marking = state.visibility === "paint" || state.visibility === "object";
    if (state.mode !== "hide" || !marking || !state.paintMask) return;

    const overlay = ctx.createImageData(w, h);
    const data = overlay.data;
    const sx = state.paintW / w;
    const sy = state.paintH / h;

    for (let y = 0; y < h; y += 1) {
      const my = Math.min(state.paintH - 1, Math.floor(y * sy));
      for (let x = 0; x < w; x += 1) {
        const value = state.paintMask[my * state.paintW + Math.min(state.paintW - 1, Math.floor(x * sx))];
        if (!value) continue;
        const i = (y * w + x) * 4;
        if (value === PAINT_KEEP) {
          data[i] = 255; data[i + 1] = 82; data[i + 2] = 31; data[i + 3] = 90;
        } else {
          data[i] = 103; data[i + 1] = 217; data[i + 2] = 232; data[i + 3] = 78;
        }
      }
    }
    ctx.putImageData(overlay, 0, 0);
  }

  /* ---------- render ----------------------------------------------------- */

  function setStatus(text) {
    els.statusText.textContent = text;
    els.renderBadge.textContent = text;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function ready() {
    if (!state.imageA) return false;
    return state.mode !== "swap" || Boolean(state.imageB);
  }

  function scheduleRender() {
    window.clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(render, 180);
  }

  async function render() {
    if (!ready()) { drawIdle(); return; }

    const serial = (state.renderSerial += 1);
    setStatus("Rendering");
    els.downloadButton.disabled = true;

    /* Yield once so the status paints before the pixel loop blocks the thread.
       Not requestAnimationFrame: it stalls in a background or hidden tab, and
       the render would never start. */
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    if (serial !== state.renderSerial) return;

    const dims = outputDimensions();
    let output;
    if (state.mode === "swap") output = buildSwap(dims);
    else if (state.mode === "solid") output = buildSolid(dims);
    else output = buildHideReveal(dims);
    state.output = output;

    drawOpened(output);
    await drawTimeline(output);
    if (serial !== state.renderSerial) return;

    els.outputSize.textContent = `${output.width} x ${output.height} — encoding`;

    const { blob, format } = await encodeOutput(output);
    if (serial !== state.renderSerial) return;

    state.outputBlob = blob;
    const tooBig = blob.size > X_SIZE_LIMIT;
    els.outputSize.textContent = `${output.width} x ${output.height} — ${format} ${formatBytes(blob.size)}`;
    setStatus(tooBig ? "Over 5 MB — pick a smaller size" : `${format} ready`);
    els.downloadButton.disabled = false;
  }

  function drawIdle() {
    state.output = null;
    state.outputBlob = null;
    els.downloadButton.disabled = true;
    setCanvasSize(els.timelineCanvas, 680, 425);
    setCanvasSize(els.openedCanvas, 680, 425);
    setCanvasSize(els.paintOverlayCanvas, 680, 425);
    els.timelineCanvas.getContext("2d").clearRect(0, 0, 680, 425);
    els.openedCanvas.getContext("2d").clearRect(0, 0, 680, 425);
    els.paintOverlayCanvas.getContext("2d").clearRect(0, 0, 680, 425);
    els.outputSize.textContent = "Waiting";
    setStatus(state.mode === "swap" && state.imageA ? "Add the reveal image" : "Drop an image to start");
  }

  /* ---------- painting --------------------------------------------------- */

  function paintAt(event) {
    if (!state.output || state.visibility !== "paint" || state.mode !== "hide") return;
    const rect = els.paintOverlayCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const mask = ensurePaintMask(state.output.width, state.output.height);
    const mx = ((event.clientX - rect.left) / rect.width) * state.paintW;
    const my = ((event.clientY - rect.top) / rect.height) * state.paintH;

    // Brush size is in screen pixels, so convert it into mask pixels.
    const radius = (state.brushSize / 2) * (state.paintW / rect.width);
    const r2 = radius * radius;
    const x0 = Math.max(0, Math.floor(mx - radius));
    const x1 = Math.min(state.paintW - 1, Math.ceil(mx + radius));
    const y0 = Math.max(0, Math.floor(my - radius));
    const y1 = Math.min(state.paintH - 1, Math.ceil(my + radius));

    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        const dx = x - mx;
        const dy = y - my;
        if (dx * dx + dy * dy <= r2) mask[y * state.paintW + x] = state.brushValue;
      }
    }
  }

  function setupPainting() {
    const canvas = els.paintOverlayCanvas;

    const stagePoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height || !state.output) return null;
      return {
        x: ((event.clientX - rect.left) / rect.width) * state.output.width,
        y: ((event.clientY - rect.top) / rect.height) * state.output.height
      };
    };

    canvas.addEventListener("pointerdown", (event) => {
      if (state.mode !== "hide") return;

      if (state.visibility === "object") {
        const point = stagePoint(event);
        if (!point) return;
        event.preventDefault();
        // Alt inverts, so one click can undo an over-eager selection.
        const add = event.altKey ? !state.markAdds : state.markAdds;
        setStatus("Marking");
        if (markObjectAt(point.x, point.y, add)) {
          drawPaintOverlay(state.output, canvas.width, canvas.height);
          scheduleRender();
        } else {
          setStatus("Nothing to mark there");
        }
        return;
      }

      if (state.visibility !== "paint") return;
      state.isPainting = true;
      canvas.setPointerCapture(event.pointerId);
      paintAt(event);
      if (state.output) drawPaintOverlay(state.output, canvas.width, canvas.height);
      event.preventDefault();
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!state.isPainting) return;
      paintAt(event);
      if (state.output) drawPaintOverlay(state.output, canvas.width, canvas.height);
    });

    const finish = () => {
      if (!state.isPainting) return;
      state.isPainting = false;
      scheduleRender();
    };

    canvas.addEventListener("pointerup", finish);
    canvas.addEventListener("pointercancel", finish);
    canvas.addEventListener("lostpointercapture", finish);
  }

  /* ---------- loading ---------------------------------------------------- */

  function loadFile(file, slot) {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("That file is not an image");
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (slot === "b") {
        state.imageB = image;
        state.nameB = file.name;
        els.secondDrop.classList.add("is-loaded");
        els.secondMeta.textContent = `${file.name} — ${image.width} x ${image.height}`;
      } else {
        state.imageA = image;
        state.nameA = file.name;
        state.paintMask = null;
        state.paintW = 0;
        state.paintH = 0;
        els.sourceDrop.classList.add("is-loaded");
        els.sourceMeta.textContent = `${file.name} — ${image.width} x ${image.height}`;
      }
      state.zoom = 1;
      syncZoomLabel();
      scheduleRender();
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus("Could not read that image");
    };
    image.src = url;
  }

  function setupDrop(zone, input, slot) {
    input.addEventListener("change", () => {
      if (input.files && input.files[0]) loadFile(input.files[0], slot);
      input.value = "";
    });

    ["dragenter", "dragover"].forEach((type) => {
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        zone.classList.add("is-dragging");
      });
    });

    ["dragleave", "drop"].forEach((type) => {
      zone.addEventListener(type, (event) => {
        event.preventDefault();
        zone.classList.remove("is-dragging");
      });
    });

    zone.addEventListener("drop", (event) => {
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) loadFile(file, slot);
    });
  }

  /* ---------- controls ---------------------------------------------------- */

  function syncMode() {
    const swap = state.mode === "swap";
    const solid = state.mode === "solid";
    const hide = state.mode === "hide";
    els.modeHide.classList.toggle("is-active", hide);
    els.modeSolid.classList.toggle("is-active", solid);
    els.modeSwap.classList.toggle("is-active", swap);
    els.modeHide.setAttribute("aria-selected", String(hide));
    els.modeSolid.setAttribute("aria-selected", String(solid));
    els.modeSwap.setAttribute("aria-selected", String(swap));
    els.secondDrop.hidden = !swap;
    els.visibilityModule.hidden = swap;
    els.sourceTitle.textContent = swap ? "Drop the timeline image" : "Drop an image";
    els.modeHint.hidden = solid;
    if (els.modeSolidHint) els.modeSolidHint.hidden = !solid;
    const moireRow = document.getElementById("moireContrastRow");
    if (moireRow) moireRow.hidden = !solid;
    if (swap) {
      els.modeHint.textContent = "The first picture shows in the timeline, the second one takes over when the image is opened. Works best when the first is the lighter of the two.";
    } else if (hide) {
      els.modeHint.textContent = "One picture hides in the timeline and comes back when someone taps and holds it.";
    }
    const marking = state.visibility === "paint" || state.visibility === "object";
    document.body.classList.toggle("is-paint-mode", !swap && marking);
    document.body.classList.toggle("is-marking", !swap && state.visibility === "object");
  }

  function syncVisibility() {
    const marking = state.visibility === "paint" || state.visibility === "object";
    const swap = state.mode === "swap";
    els.paintTools.hidden = state.visibility !== "paint";
    els.objectTools.hidden = state.visibility !== "object";
    // The cutoff only applies when brightness decides what stays visible.
    els.thresholdRow.hidden = state.visibility !== "dark";
    document.body.classList.toggle("is-paint-mode", !swap && marking);
    document.body.classList.toggle("is-marking", !swap && state.visibility === "object");
    els.brushKeep.setAttribute("aria-pressed", String(state.brushValue === PAINT_KEEP));
    els.brushHide.setAttribute("aria-pressed", String(state.brushValue === PAINT_HIDE));
  }

  function syncZoomLabel() {
    els.canvasZoom.value = String(Math.round(state.zoom * 100));
    els.canvasZoomValue.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  function setZoom(next) {
    state.zoom = clamp(next, 0.25, 4);
    syncZoomLabel();
    if (state.output) drawOpened(state.output);
  }

  function setupControls() {
    els.modeHide.addEventListener("click", () => {
      state.mode = "hide";
      syncMode();
      ready() ? scheduleRender() : drawIdle();
    });

    els.modeSolid.addEventListener("click", () => {
      state.mode = "solid";
      syncMode();
      ready() ? scheduleRender() : drawIdle();
    });

    els.modeSwap.addEventListener("click", () => {
      state.mode = "swap";
      syncMode();
      ready() ? scheduleRender() : drawIdle();
    });

    document.querySelectorAll('input[name="visibility"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        state.visibility = radio.value;
        syncVisibility();
        scheduleRender();
      });
    });

    els.tolerance.addEventListener("input", () => {
      state.tolerance = Number(els.tolerance.value);
      els.toleranceValue.textContent = String(state.tolerance);
    });

    const setMarkTool = (adds) => {
      state.markAdds = adds;
      els.markAdd.setAttribute("aria-pressed", String(adds));
      els.markRemove.setAttribute("aria-pressed", String(!adds));
    };
    els.markAdd.addEventListener("click", () => setMarkTool(true));
    els.markRemove.addEventListener("click", () => setMarkTool(false));
    els.clearMarks.addEventListener("click", clearPaintMask);

    els.blackPoint.addEventListener("input", () => {
      state.blackPoint = Number(els.blackPoint.value);
      els.blackPointValue.textContent = String(state.blackPoint);
      scheduleRender();
    });

    if (els.moireContrast) {
      els.moireContrast.addEventListener("input", () => {
        state.moireContrast = Number(els.moireContrast.value);
        els.moireContrastValue.textContent = `${state.moireContrast}%`;
        scheduleRender();
      });
    }

    const setTheme = (theme) => {
      state.timelineTheme = theme;
      els.themeLight.classList.toggle("is-active", theme === "light");
      els.themeDark.classList.toggle("is-active", theme === "dark");
      els.themeLight.setAttribute("aria-pressed", String(theme === "light"));
      els.themeDark.setAttribute("aria-pressed", String(theme === "dark"));
      if (state.output) drawTimeline(state.output);
    };
    els.themeLight.addEventListener("click", () => setTheme("light"));
    els.themeDark.addEventListener("click", () => setTheme("dark"));

    els.threshold.addEventListener("input", () => {
      state.threshold = Number(els.threshold.value);
      els.thresholdValue.textContent = String(state.threshold);
      scheduleRender();
    });

    els.brushSize.addEventListener("input", () => {
      state.brushSize = Number(els.brushSize.value);
      els.brushSizeValue.textContent = `${state.brushSize}px`;
    });

    els.brushKeep.addEventListener("click", () => { state.brushValue = PAINT_KEEP; syncVisibility(); });
    els.brushHide.addEventListener("click", () => { state.brushValue = PAINT_HIDE; syncVisibility(); });
    els.clearPaint.addEventListener("click", clearPaintMask);

    els.outputRatio.addEventListener("change", () => {
      state.ratio = els.outputRatio.value;
      scheduleRender();
    });

    [["upscale", "upscale"], ["lineArt", "lineArt"], ["brightnessBoost", "brightnessBoost"]].forEach(([id, key]) => {
      els[id].addEventListener("change", () => {
        state[key] = els[id].checked;
        scheduleRender();
      });
    });

    els.timelineToggle.addEventListener("click", () => {
      state.timelineVisible = !state.timelineVisible;
      document.body.classList.toggle("is-timeline-hidden", !state.timelineVisible);
      els.timelineToggle.textContent = state.timelineVisible ? "Hide timeline" : "Show timeline";
      if (state.output) drawOpened(state.output);
    });

    els.canvasZoom.addEventListener("input", () => setZoom(Number(els.canvasZoom.value) / 100));
    els.canvasZoomIn.addEventListener("click", () => setZoom(state.zoom * 1.25));
    els.canvasZoomOut.addEventListener("click", () => setZoom(state.zoom / 1.25));
    els.canvasZoomReset.addEventListener("click", () => setZoom(1));

    els.resetButton.addEventListener("click", reset);
    els.downloadButton.addEventListener("click", download);

    window.addEventListener("resize", () => {
      if (state.output) drawOpened(state.output);
    });
  }

  function reset() {
    state.imageA = null;
    state.imageB = null;
    state.nameA = "";
    state.nameB = "";
    state.paintMask = null;
    state.paintW = 0;
    state.paintH = 0;
    state.zoom = 1;

    els.sourceDrop.classList.remove("is-loaded");
    els.secondDrop.classList.remove("is-loaded");
    els.sourceMeta.textContent = "PNG or JPG. Nothing leaves your device.";
    els.secondMeta.textContent = "The picture the tap uncovers.";
    syncZoomLabel();
    drawIdle();
  }

  function exportName() {
    const base = (state.nameA || "tap-me").replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 48);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    return `${base}-tapme-${stamp}.png`;
  }

  function download() {
    if (!state.outputBlob) return;
    const url = URL.createObjectURL(state.outputBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  setupDrop(els.sourceDrop, els.sourceInput, "a");
  setupDrop(els.secondDrop, els.secondInput, "b");
  setupPainting();
  setupControls();
  syncMode();
  syncVisibility();
  syncZoomLabel();
  drawIdle();
})();
