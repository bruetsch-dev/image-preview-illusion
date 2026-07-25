(function () {
  "use strict";

  const els = {
    sourceInput: document.getElementById("sourceInput"),
    sourceDrop: document.getElementById("sourceDrop"),
    sourceMeta: document.getElementById("sourceMeta"),
    resetButton: document.getElementById("resetButton"),
    downloadButton: document.getElementById("downloadButton"),
    advancedToggle: document.getElementById("advancedToggle"),
    advancedOpenButton: document.getElementById("advancedOpenButton"),
    advancedMinimize: document.getElementById("advancedMinimize"),
    advancedPanel: document.getElementById("advancedPanel"),
    backgroundToggle: document.getElementById("backgroundToggle"),
    backgroundOpacity: document.getElementById("backgroundOpacity"),
    backgroundOpacityValue: document.getElementById("backgroundOpacityValue"),
    whiteMatte: document.getElementById("whiteMatte"),
    whiteMatteValue: document.getElementById("whiteMatteValue"),
    matteColorStrength: document.getElementById("matteColorStrength"),
    matteColorStrengthValue: document.getElementById("matteColorStrengthValue"),
    hiddenColorOpacity: document.getElementById("hiddenColorOpacity"),
    hiddenColorOpacityValue: document.getElementById("hiddenColorOpacityValue"),
    promptText: document.getElementById("promptText"),
    promptSymbols: document.getElementById("promptSymbols"),
    promptFont: document.getElementById("promptFont"),
    promptStyle: document.getElementById("promptStyle"),
    promptArrow: document.getElementById("promptArrow"),
    promptArrowStyle: document.getElementById("promptArrowStyle"),
    promptX: document.getElementById("promptX"),
    promptXValue: document.getElementById("promptXValue"),
    promptY: document.getElementById("promptY"),
    promptYValue: document.getElementById("promptYValue"),
    promptScale: document.getElementById("promptScale"),
    promptScaleValue: document.getElementById("promptScaleValue"),
    promptRotation: document.getElementById("promptRotation"),
    promptRotationValue: document.getElementById("promptRotationValue"),
    revealMethod: document.getElementById("revealMethod"),
    outputSide: document.getElementById("outputSide"),
    inputBrightness: document.getElementById("inputBrightness"),
    inputBrightnessValue: document.getElementById("inputBrightnessValue"),
    inputContrast: document.getElementById("inputContrast"),
    inputContrastValue: document.getElementById("inputContrastValue"),
    inputSaturation: document.getElementById("inputSaturation"),
    inputSaturationValue: document.getElementById("inputSaturationValue"),
    inputExposure: document.getElementById("inputExposure"),
    inputExposureValue: document.getElementById("inputExposureValue"),
    inputGamma: document.getElementById("inputGamma"),
    inputGammaValue: document.getElementById("inputGammaValue"),
    inputHue: document.getElementById("inputHue"),
    inputHueValue: document.getElementById("inputHueValue"),
    inputWarmth: document.getElementById("inputWarmth"),
    inputWarmthValue: document.getElementById("inputWarmthValue"),
    inputVibrance: document.getElementById("inputVibrance"),
    inputVibranceValue: document.getElementById("inputVibranceValue"),
    colorLevels: document.getElementById("colorLevels"),
    paintMode: document.getElementById("paintMode"),
    brushPattern: document.getElementById("brushPattern"),
    brushSize: document.getElementById("brushSize"),
    brushSizeValue: document.getElementById("brushSizeValue"),
    clearPaint: document.getElementById("clearPaint"),
    inkThreshold: document.getElementById("inkThreshold"),
    inkThresholdValue: document.getElementById("inkThresholdValue"),
    patternScale: document.getElementById("patternScale"),
    patternScaleValue: document.getElementById("patternScaleValue"),
    randomizePatterns: document.getElementById("randomizePatterns"),
    resetPatterns: document.getElementById("resetPatterns"),
    previewCrush: document.getElementById("previewCrush"),
    previewCrushValue: document.getElementById("previewCrushValue"),
    patternControls: document.getElementById("patternControls"),
    openedStage: document.getElementById("openedStage"),
    statusText: document.getElementById("statusText"),
    outputSize: document.getElementById("outputSize"),
    renderBadge: document.getElementById("renderBadge"),
    timelineToggle: document.getElementById("timelineToggle"),
    canvasLock: document.getElementById("canvasLock"),
    canvasZoom: document.getElementById("canvasZoom"),
    canvasZoomValue: document.getElementById("canvasZoomValue"),
    canvasZoomOut: document.getElementById("canvasZoomOut"),
    canvasZoomIn: document.getElementById("canvasZoomIn"),
    canvasZoomReset: document.getElementById("canvasZoomReset"),
    timelineFrame: document.getElementById("timelineFrame"),
    timelineCanvas: document.getElementById("timelineCanvas"),
    openedCanvas: document.getElementById("openedCanvas"),
    paintOverlayCanvas: document.getElementById("paintOverlayCanvas"),
    outputCanvas: document.getElementById("outputCanvas"),
    fullscreenViewer: document.getElementById("fullscreenViewer"),
    fullscreenStage: document.getElementById("fullscreenStage"),
    fullscreenCanvas: document.getElementById("fullscreenCanvas"),
    fullscreenTitle: document.getElementById("fullscreenTitle"),
    fullscreenZoomValue: document.getElementById("fullscreenZoomValue"),
    fullscreenClose: document.getElementById("fullscreenClose")
  };

  const config = {
    maxSide: 6144,
    targetSide: 2048,
    previewMaxHeight: 420,
    previewMinHeight: 190,
    previewCrush: 0.68,
    transparentRgb: { r: 255, g: 255, b: 255 },
    timelinePaper: { r: 226, g: 226, b: 222 },
    iphoneTimelineBase: { r: 52, g: 53, b: 58 },
    bucketPatterns: {
      ink: "templateSlash8",
      shadow: "templateSlash8",
      light: "templateSlash8",
      red: "templateCross4",
      yellow: "templateDots20",
      green: "lattice",
      cyan: "slash",
      blue: "backslash",
      magenta: "diamonds"
    },
    patternCoverage: {
      bayer: 0.5,
      checker: 0.5,
      microdots: 0.16,
      slash: 0.3,
      backslash: 0.3,
      plus: 0.24,
      diamonds: 0.26,
      lattice: 0.36,
      crosshatch: 0.42,
      solid: 1,
      templateSlash8: 0.125,
      templateCross4: 0.375,
      templateDots20: 0.34
    }
  };

  const patternChoices = [
    ["templateSlash8", "PSD disappearing slash"],
    ["templateCross4", "PSD disappearing cross"],
    ["templateDots20", "PSD preview dots"],
    ["bayer", "Bayer 4x4"],
    ["checker", "Checker"],
    ["microdots", "Micro dots"],
    ["slash", "Diagonal /"],
    ["backslash", "Diagonal \\"],
    ["plus", "Plus grid"],
    ["diamonds", "Diamond dots"],
    ["lattice", "Lattice"],
    ["crosshatch", "Crosshatch"],
    ["solid", "Solid"]
  ];

  const randomPatternChoices = patternChoices
    .map(([value]) => value)
    .filter((value) => value !== "solid");

  const paintPatternChoices = patternChoices.map(([value]) => value);
  const paintPatternIndex = new Map(paintPatternChoices.map((value, index) => [value, index + 1]));
  const paintPatternColors = {
    solid: [255, 73, 73],
    templateSlash8: [215, 255, 0],
    templateCross4: [90, 199, 255],
    templateDots20: [255, 176, 60],
    bayer: [255, 104, 220],
    checker: [255, 255, 255],
    microdots: [139, 255, 161],
    slash: [97, 138, 255],
    backslash: [184, 124, 255],
    plus: [255, 236, 89],
    diamonds: [255, 125, 135],
    lattice: [105, 235, 225],
    crosshatch: [180, 180, 180]
  };

  const patternBuckets = [
    ["ink", "Black / ink"],
    ["shadow", "Shadow / grey"],
    ["light", "Light tones"],
    ["red", "Red / skin"],
    ["yellow", "Yellow"],
    ["green", "Green"],
    ["cyan", "Cyan"],
    ["blue", "Blue"],
    ["magenta", "Magenta"]
  ];

  const promptFonts = {
    arial: "Arial, Helvetica, sans-serif",
    impact: "Impact, Haettenschweiler, sans-serif",
    comic: "\"Comic Sans MS\", \"Comic Sans\", cursive",
    trebuchet: "\"Trebuchet MS\", Arial, sans-serif",
    verdana: "Verdana, Geneva, sans-serif",
    tahoma: "Tahoma, Geneva, sans-serif",
    segoe: "\"Segoe UI\", Arial, sans-serif",
    franklin: "\"Franklin Gothic Heavy\", \"Franklin Gothic Medium\", Arial, sans-serif",
    rockwell: "Rockwell, \"Arial Black\", serif",
    palatino: "\"Palatino Linotype\", Palatino, serif",
    brush: "\"Brush Script MT\", \"Segoe Script\", cursive",
    lucida: "\"Lucida Handwriting\", \"Segoe Print\", cursive",
    georgia: "Georgia, serif",
    courier: "\"Courier New\", monospace",
    consolas: "Consolas, \"Courier New\", monospace",
    narrow: "\"Arial Narrow\", \"Roboto Condensed\", Arial, sans-serif",
    system: "ui-sans-serif, system-ui, sans-serif"
  };

  const promptStyles = new Set(["sticker", "bubble", "hollow", "invert", "heavy", "shadow", "clean", "white"]);
  const promptArrowStyles = new Set(["left", "right", "up", "down", "double", "chevron"]);

  const defaultBucketCoverage = Object.fromEntries(
    patternBuckets.map(([bucket]) => {
      const pattern = config.bucketPatterns[bucket] || "checker";
      return [bucket, config.patternCoverage[pattern] || 0.5];
    })
  );

  const defaultSettings = {
    advanced: false,
    revealMethod: "iosAlpha",
    backgroundEnabled: false,
    backgroundOpacity: 0,
    whiteMatte: 0.875,
    matteColorStrength: 1.15,
    hiddenColorOpacity: 1,
    promptText: "TAP ME",
    promptSymbols: "",
    promptFont: "arial",
    promptStyle: "sticker",
    promptArrow: true,
    promptArrowStyle: "left",
    promptX: 0.76,
    promptY: 0.18,
    promptScale: 1,
    promptRotation: 0,
    outputSide: 2048,
    inputBrightness: 0,
    inputContrast: 0,
    inputSaturation: 1,
    inputExposure: 0,
    inputGamma: 1,
    inputHue: 0,
    inputWarmth: 0,
    inputVibrance: 0,
    colorLevels: 0,
    paintMode: false,
    brushPattern: "solid",
    brushSize: 48,
    inkThreshold: 0.17,
    patternScale: 1,
    previewCrush: 0.68,
    bucketPatterns: { ...config.bucketPatterns },
    bucketCoverage: { ...defaultBucketCoverage }
  };

  const xUploadSoftLimit = 5 * 1024 * 1024;

  const indexedPalette = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    yellow: { r: 255, g: 255, b: 0 },
    green: { r: 0, g: 255, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    blue: { r: 0, g: 0, b: 255 },
    magenta: { r: 255, g: 0, b: 255 }
  };

  const bucketPalette = {
    ink: "black",
    shadow: "black",
    light: "white",
    red: "red",
    yellow: "yellow",
    green: "green",
    cyan: "cyan",
    blue: "blue",
    magenta: "magenta"
  };

  const compressionInkPairs = {
    ink: { r: 105, g: 105, b: 105 },
    shadow: { r: 118, g: 118, b: 128 },
    light: { r: 220, g: 220, b: 220 },
    red: { r: 255, g: 125, b: 135 },
    yellow: { r: 255, g: 215, b: 105 },
    green: { r: 118, g: 245, b: 128 },
    cyan: { r: 115, g: 238, b: 245 },
    blue: { r: 122, g: 135, b: 255 },
    magenta: { r: 240, g: 118, b: 240 }
  };

  const samplePaletteLevels = [0, 85, 170, 255];

  const samplePngPalette = (() => {
    const colors = [
      { r: 255, g: 255, b: 255, a: 0 },
      { r: 255, g: 255, b: 255, a: 255 },
      { r: 127, g: 127, b: 127, a: 255 }
    ];
    samplePaletteLevels.forEach((r) => {
      samplePaletteLevels.forEach((g) => {
        samplePaletteLevels.forEach((b) => {
          colors.push({ r, g, b, a: 255 });
        });
      });
    });
    return colors;
  })();

  const iphonePng8Levels = [128, 152, 176, 204, 232, 255];

  const iphonePng8Palette = (() => {
    const colors = [
      { r: 255, g: 255, b: 255, a: 0 },
      { r: 255, g: 255, b: 255, a: 255 },
      { r: 0, g: 0, b: 0, a: 255 }
    ];
    iphonePng8Levels.forEach((r) => {
      iphonePng8Levels.forEach((g) => {
        iphonePng8Levels.forEach((b) => {
          colors.push({ r, g, b, a: 255 });
        });
      });
    });
    return colors;
  })();

  const canonicalPngPalette = [
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 180, g: 180, b: 180, a: 255 },
    { r: 105, g: 105, b: 105, a: 255 },
    { r: 118, g: 118, b: 128, a: 255 },
    { r: 220, g: 220, b: 220, a: 255 },
    { r: 255, g: 125, b: 135, a: 255 },
    { r: 255, g: 215, b: 105, a: 255 },
    { r: 118, g: 245, b: 128, a: 255 },
    { r: 115, g: 238, b: 245, a: 255 },
    { r: 122, g: 135, b: 255, a: 255 },
    { r: 240, g: 118, b: 240, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 242, g: 242, b: 232, a: 255 },
    { r: 140, g: 140, b: 140, a: 255 },
    { r: 105, g: 235, b: 225, a: 255 },
    { r: 105, g: 145, b: 255, a: 255 },
    { r: 242, g: 115, b: 232, a: 255 },
    { r: 245, g: 122, b: 115, a: 255 },
    { r: 238, g: 225, b: 105, a: 255 },
    { r: 120, g: 242, b: 120, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 255, b: 255, a: 255 },
    { r: 0, g: 255, b: 0, a: 255 },
    { r: 255, g: 255, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 255, a: 255 },
    { r: 0, g: 0, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 0 },
    { r: 0, g: 0, b: 0, a: 0 },
    { r: 0, g: 255, b: 255, a: 0 },
    { r: 0, g: 255, b: 0, a: 0 },
    { r: 255, g: 255, b: 0, a: 0 },
    { r: 255, g: 0, b: 0, a: 0 },
    { r: 255, g: 0, b: 255, a: 0 },
    { r: 0, g: 0, b: 255, a: 0 },
    { r: 255, g: 255, b: 255, a: 1 },
    { r: 0, g: 0, b: 0, a: 1 },
    { r: 0, g: 255, b: 255, a: 1 },
    { r: 0, g: 255, b: 0, a: 1 },
    { r: 255, g: 255, b: 0, a: 1 },
    { r: 255, g: 0, b: 0, a: 1 },
    { r: 255, g: 0, b: 255, a: 1 },
    { r: 0, g: 0, b: 255, a: 1 }
  ];

  const bayer4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const bayer8 = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ];

  const state = {
    image: null,
    fileName: "",
    settings: {
      ...defaultSettings,
      bucketPatterns: { ...defaultSettings.bucketPatterns },
      bucketCoverage: { ...defaultSettings.bucketCoverage }
    },
    fullscreenMode: "",
    fullscreenZoom: 1,
    workspaceZoom: 1,
    canvasLocked: true,
    timelineVisible: true,
    advancedOpen: false,
    renderTimer: 0,
    renderSerial: 0,
    lastOutput: null,
    lastOutputBlob: null,
    lastBlobUrl: "",
    lastBlackMetric: null,
    paintMask: null,
    paintMaskWidth: 0,
    paintMaskHeight: 0,
    isPainting: false
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function mod(value, size) {
    return ((value % size) + size) % size;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function luminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      if (max === g) h = (b - r) / d + 2;
      if (max === b) h = (r - g) / d + 4;
      h /= 6;
    }

    return { h, s, l };
  }

  function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;

    if (s === 0) {
      r = l;
      g = l;
      b = l;
    } else {
      const hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function setStatus(text) {
    els.statusText.textContent = text;
    els.renderBadge.textContent = text;
  }

  function methodLabel() {
    const settings = effectiveSettings();
    const bg = settings.backgroundEnabled ? ` + white BG ${Math.round(settings.backgroundOpacity * 100)}%` : "";
    const method = settings.revealMethod === "darkAlpha"
      ? "alpha-0 color carrier"
    : settings.revealMethod === "iosAlpha"
      ? "iPhone PNG-8 checker"
      : settings.revealMethod === "templateMatte"
      ? "iPhone-safe white matte"
      : settings.revealMethod === "template"
      ? "web alpha cheat-sheet"
      : settings.revealMethod === "carrierSoft"
        ? "soft alpha carrier"
        : settings.revealMethod === "carrier"
          ? "Photoshop carrier alpha 0"
          : settings.revealMethod === "alpha"
            ? "alpha matte"
          : "experimental RGB pixel pattern";
    return `${state.settings.advanced ? "advanced " : ""}${method}${bg}`;
  }

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function safeName(name) {
    const base = name.replace(/\.[^.]+$/, "") || "image";
    return base
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "image";
  }

  function timestampName() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join("-") + "_" + [
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds())
    ].join("-");
  }

  function updateSourceMeta() {
    if (!state.image) return;
    els.sourceMeta.textContent = `${state.fileName} - ${state.image.width} x ${state.image.height} - ${methodLabel()}`;
  }

  function setCanvasSize(canvas, width, height) {
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  }

  function effectiveSettings() {
    return {
      backgroundEnabled: state.settings.backgroundEnabled,
      backgroundOpacity: state.settings.backgroundOpacity,
      whiteMatte: state.settings.whiteMatte,
      matteColorStrength: state.settings.matteColorStrength,
      hiddenColorOpacity: state.settings.hiddenColorOpacity,
      promptText: state.settings.promptText,
      promptSymbols: state.settings.promptSymbols,
      promptFont: state.settings.promptFont,
      promptStyle: state.settings.promptStyle,
      promptArrow: state.settings.promptArrow,
      promptArrowStyle: state.settings.promptArrowStyle,
      promptX: state.settings.promptX,
      promptY: state.settings.promptY,
      promptScale: state.settings.promptScale,
      promptRotation: state.settings.promptRotation,
      revealMethod: state.settings.advanced ? state.settings.revealMethod : defaultSettings.revealMethod,
      outputSide: state.settings.advanced ? state.settings.outputSide : config.targetSide,
      inputBrightness: state.settings.inputBrightness,
      inputContrast: state.settings.inputContrast,
      inputSaturation: state.settings.inputSaturation,
      inputExposure: state.settings.inputExposure,
      inputGamma: state.settings.inputGamma,
      inputHue: state.settings.inputHue,
      inputWarmth: state.settings.inputWarmth,
      inputVibrance: state.settings.inputVibrance,
      colorLevels: state.settings.colorLevels,
      inkThreshold: state.settings.advanced ? state.settings.inkThreshold : defaultSettings.inkThreshold,
      patternScale: state.settings.advanced ? state.settings.patternScale : defaultSettings.patternScale,
      previewCrush: state.settings.advanced ? state.settings.previewCrush : config.previewCrush,
      bucketPatterns: state.settings.advanced ? state.settings.bucketPatterns : config.bucketPatterns,
      bucketCoverage: state.settings.advanced ? state.settings.bucketCoverage : defaultBucketCoverage
    };
  }

  function updateRangeLabels() {
    const signedPercent = (value) => `${value > 0 ? "+" : ""}${Math.round(value * 100)}%`;
    els.backgroundOpacityValue.textContent = `${Math.round(state.settings.backgroundOpacity * 100)}%`;
    els.whiteMatteValue.textContent = `${Math.round(state.settings.whiteMatte * 100)}%`;
    els.matteColorStrengthValue.textContent = `${Math.round(state.settings.matteColorStrength * 100)}%`;
    els.hiddenColorOpacityValue.textContent = `${Math.round(state.settings.hiddenColorOpacity * 100)}%`;
    els.promptXValue.textContent = `${Math.round(state.settings.promptX * 100)}%`;
    els.promptYValue.textContent = `${Math.round(state.settings.promptY * 100)}%`;
    els.promptScaleValue.textContent = `${Math.round(state.settings.promptScale * 100)}%`;
    els.promptRotationValue.textContent = `${Math.round(state.settings.promptRotation)} deg`;
    els.inputBrightnessValue.textContent = signedPercent(state.settings.inputBrightness);
    els.inputContrastValue.textContent = signedPercent(state.settings.inputContrast);
    els.inputSaturationValue.textContent = `${Math.round(state.settings.inputSaturation * 100)}%`;
    els.inputExposureValue.textContent = `${state.settings.inputExposure > 0 ? "+" : ""}${state.settings.inputExposure.toFixed(1)}`;
    els.inputGammaValue.textContent = `${Math.round(state.settings.inputGamma * 100)}%`;
    els.inputHueValue.textContent = `${Math.round(state.settings.inputHue)} deg`;
    els.inputWarmthValue.textContent = signedPercent(state.settings.inputWarmth);
    els.inputVibranceValue.textContent = signedPercent(state.settings.inputVibrance);
    els.brushSizeValue.textContent = `${Math.round(state.settings.brushSize)}px`;
    els.inkThresholdValue.textContent = `${Math.round(state.settings.inkThreshold * 100)}%`;
    els.patternScaleValue.textContent = `${state.settings.patternScale}x`;
    els.previewCrushValue.textContent = `${Math.round(state.settings.previewCrush * 100)}%`;
    els.canvasZoomValue.textContent = `${Math.round(state.workspaceZoom * 100)}%`;
    els.fullscreenZoomValue.textContent = `${Math.round(state.fullscreenZoom * 100)}%`;
    els.patternControls.querySelectorAll("[data-coverage-value]").forEach((value) => {
      const bucket = value.dataset.coverageValue;
      value.textContent = `${Math.round((state.settings.bucketCoverage[bucket] || defaultBucketCoverage[bucket] || 0.5) * 100)}%`;
    });
  }

  function syncControlState() {
    els.advancedToggle.checked = state.settings.advanced;
    els.advancedPanel.hidden = !(state.settings.advanced && state.advancedOpen);
    document.body.classList.toggle("is-advanced-open", state.settings.advanced && state.advancedOpen);
    document.body.classList.toggle("is-paint-mode", state.settings.paintMode);
    document.body.classList.toggle("is-canvas-locked", state.canvasLocked);
    document.body.classList.toggle("is-timeline-hidden", !state.timelineVisible);
    els.advancedOpenButton.textContent = state.settings.advanced && !state.advancedOpen ? "Reopen" : "Open";
    els.advancedOpenButton.disabled = false;
    els.backgroundToggle.checked = state.settings.backgroundEnabled;
    els.backgroundOpacity.disabled = !state.settings.backgroundEnabled;
    els.backgroundOpacity.value = Math.round(state.settings.backgroundOpacity * 100);
    els.whiteMatte.value = Math.round(state.settings.whiteMatte * 100);
    els.matteColorStrength.value = Math.round(state.settings.matteColorStrength * 100);
    els.hiddenColorOpacity.value = Math.round(state.settings.hiddenColorOpacity * 100);
    els.promptText.value = state.settings.promptText;
    els.promptSymbols.value = state.settings.promptSymbols;
    els.promptFont.value = state.settings.promptFont;
    els.promptStyle.value = state.settings.promptStyle;
    els.promptArrow.checked = state.settings.promptArrow;
    els.promptArrowStyle.value = state.settings.promptArrowStyle;
    els.promptX.value = Math.round(state.settings.promptX * 100);
    els.promptY.value = Math.round(state.settings.promptY * 100);
    els.promptScale.value = Math.round(state.settings.promptScale * 100);
    els.promptRotation.value = Math.round(state.settings.promptRotation);
    els.revealMethod.value = state.settings.revealMethod;
    els.outputSide.value = String(state.settings.outputSide);
    els.inputBrightness.value = Math.round(state.settings.inputBrightness * 100);
    els.inputContrast.value = Math.round(state.settings.inputContrast * 100);
    els.inputSaturation.value = Math.round(state.settings.inputSaturation * 100);
    els.inputExposure.value = Math.round(state.settings.inputExposure * 100);
    els.inputGamma.value = Math.round(state.settings.inputGamma * 100);
    els.inputHue.value = Math.round(state.settings.inputHue);
    els.inputWarmth.value = Math.round(state.settings.inputWarmth * 100);
    els.inputVibrance.value = Math.round(state.settings.inputVibrance * 100);
    els.colorLevels.value = String(state.settings.colorLevels);
    els.paintMode.checked = state.settings.paintMode;
    els.brushPattern.value = state.settings.brushPattern;
    els.brushSize.value = Math.round(state.settings.brushSize);
    els.canvasLock.checked = state.canvasLocked;
    els.canvasZoom.value = Math.round(state.workspaceZoom * 100);
    els.timelineToggle.textContent = state.timelineVisible ? "Hide timeline" : "Show timeline";
    els.inkThreshold.value = Math.round(state.settings.inkThreshold * 100);
    els.patternScale.value = state.settings.patternScale;
    els.previewCrush.value = Math.round(state.settings.previewCrush * 100);
    updateRangeLabels();
  }

  function paintPatternPreview(canvas, pattern, coverage) {
    const width = 92;
    const height = 42;
    setCanvasSize(canvas, width, height);
    const ctx = canvas.getContext("2d");
    const preview = ctx.createImageData(width, height);
    const data = preview.data;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4;
        const hit = patternHit(pattern, x, y, 2, coverage);
        const ink = hit ? 0 : 255;
        data[i] = ink;
        data[i + 1] = ink;
        data[i + 2] = ink;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(preview, 0, 0);
  }

  function renderPatternControls() {
    els.patternControls.textContent = "";
    patternBuckets.forEach(([bucket, label]) => {
      const row = document.createElement("div");
      const head = document.createElement("div");
      const text = document.createElement("strong");
      const value = document.createElement("em");
      const preview = document.createElement("canvas");
      const select = document.createElement("select");
      const slider = document.createElement("input");

      row.className = "pattern-row";
      head.className = "pattern-row-head";
      preview.className = "pattern-preview";
      text.textContent = label;
      value.dataset.coverageValue = bucket;
      select.dataset.bucket = bucket;
      patternChoices.forEach(([value, name]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = name;
        select.appendChild(option);
      });
      select.value = state.settings.bucketPatterns[bucket] || config.bucketPatterns[bucket] || "checker";
      const refreshPreview = () => paintPatternPreview(
        preview,
        select.value,
        state.settings.bucketCoverage[bucket] || defaultBucketCoverage[bucket] || 0.5
      );
      select.addEventListener("change", () => {
        state.settings.bucketPatterns[bucket] = select.value;
        state.settings.bucketCoverage[bucket] = config.patternCoverage[select.value] || 0.5;
        slider.value = Math.round(state.settings.bucketCoverage[bucket] * 100);
        updateRangeLabels();
        refreshPreview();
        scheduleRender();
      });

      slider.type = "range";
      slider.min = "10";
      slider.max = "100";
      slider.value = Math.round((state.settings.bucketCoverage[bucket] || defaultBucketCoverage[bucket] || 0.5) * 100);
      slider.addEventListener("input", () => {
        state.settings.bucketCoverage[bucket] = clamp(Number(slider.value) / 100, 0.1, 1);
        updateRangeLabels();
        refreshPreview();
        scheduleRender();
      });

      head.appendChild(text);
      head.appendChild(value);
      row.appendChild(head);
      row.appendChild(preview);
      row.appendChild(select);
      row.appendChild(slider);
      els.patternControls.appendChild(row);
      refreshPreview();
    });
    updateRangeLabels();
  }

  function syncPatternControls() {
    els.patternControls.querySelectorAll("[data-bucket]").forEach((select) => {
      const bucket = select.dataset.bucket;
      select.value = state.settings.bucketPatterns[bucket] || config.bucketPatterns[bucket] || "checker";
      const row = select.closest(".pattern-row");
      const slider = row ? row.querySelector("input[type='range']") : null;
      const preview = row ? row.querySelector("canvas") : null;
      const coverage = state.settings.bucketCoverage[bucket] || defaultBucketCoverage[bucket] || 0.5;
      if (slider) slider.value = Math.round(coverage * 100);
      if (preview) paintPatternPreview(preview, select.value, coverage);
    });
    updateRangeLabels();
  }

  function randomizePatterns() {
    patternBuckets.forEach(([bucket]) => {
      const pattern = randomPatternChoices[Math.floor(Math.random() * randomPatternChoices.length)] || "checker";
      const baseCoverage = config.patternCoverage[pattern] || 0.5;
      const coverage = clamp(baseCoverage * (0.72 + Math.random() * 0.82), 0.1, 1);
      state.settings.bucketPatterns[bucket] = pattern;
      state.settings.bucketCoverage[bucket] = coverage;
    });
    state.settings.patternScale = Math.floor(Math.random() * 3) + 1;
    syncControlState();
    syncPatternControls();
    if (state.image) scheduleRender();
  }

  function resetPatterns() {
    state.settings.bucketPatterns = { ...defaultSettings.bucketPatterns };
    state.settings.bucketCoverage = { ...defaultSettings.bucketCoverage };
    state.settings.patternScale = defaultSettings.patternScale;
    state.settings.inkThreshold = defaultSettings.inkThreshold;
    syncControlState();
    syncPatternControls();
    if (state.image) scheduleRender();
  }

  function clearPaintMask(renderAfter = true) {
    state.paintMask = null;
    state.paintMaskWidth = 0;
    state.paintMaskHeight = 0;
    drawPaintOverlay();
    if (renderAfter && state.image) scheduleRender(true);
  }

  function ensurePaintMask(width, height) {
    if (state.paintMask && state.paintMaskWidth === width && state.paintMaskHeight === height) {
      return state.paintMask;
    }

    state.paintMask = new Uint8Array(width * height);
    state.paintMaskWidth = width;
    state.paintMaskHeight = height;
    return state.paintMask;
  }

  function matchingPaintMask(width, height) {
    if (!state.paintMask || state.paintMaskWidth !== width || state.paintMaskHeight !== height) return null;
    return state.paintMask;
  }

  function paintPatternFromMaskValue(value) {
    if (!value) return "";
    return paintPatternChoices[value - 1] || "";
  }

  function paintPatternAt(mask, x, y, width) {
    return paintPatternFromMaskValue(mask[y * width + x]);
  }

  function brushMaskValue() {
    if (state.settings.brushPattern === "erase") return 0;
    return paintPatternIndex.get(state.settings.brushPattern) || paintPatternIndex.get("solid") || 1;
  }

  function outputDimensions(image, settings) {
    const longest = Math.max(image.width, image.height);
    const targetSide = clamp(settings.outputSide, 512, config.maxSide);
    const target = targetSide;
    const scale = target / longest;
    return {
      width: Math.max(1, Math.round(image.width * scale)),
      height: Math.max(1, Math.round(image.height * scale))
    };
  }

  function drawContained(ctx, image, width, height, fill = true) {
    ctx.clearRect(0, 0, width, height);
    if (fill) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    const ratio = Math.min(width / image.width, height / image.height);
    const drawW = image.width * ratio;
    const drawH = image.height * ratio;
    ctx.drawImage(image, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
  }

  function drawCoverFromCanvas(ctx, canvas, sourceWidth, sourceHeight, targetWidth, targetHeight) {
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = targetWidth / targetHeight;
    let sx = 0;
    let sy = 0;
    let sw = sourceWidth;
    let sh = sourceHeight;

    if (sourceRatio > targetRatio) {
      sw = Math.round(sourceHeight * targetRatio);
      sx = Math.round((sourceWidth - sw) / 2);
    } else {
      sh = Math.round(sourceWidth / targetRatio);
      sy = Math.round((sourceHeight - sh) / 2);
    }

    ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(blob);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Preview codec decode failed."));
      };
      image.src = url;
    });
  }

  function sourceData(image, width, height, smooth = true) {
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, width, height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = smooth;
    if (smooth) ctx.imageSmoothingQuality = "high";
    drawContained(ctx, image, width, height, false);
    return ctx.getImageData(0, 0, width, height);
  }

  function applyInputAdjustments(imageData, settings) {
    const brightness = settings.inputBrightness || 0;
    const contrast = settings.inputContrast || 0;
    const saturation = settings.inputSaturation ?? 1;
    const exposure = settings.inputExposure || 0;
    const gamma = clamp(settings.inputGamma ?? 1, 0.5, 2);
    const hue = settings.inputHue || 0;
    const warmth = settings.inputWarmth || 0;
    const vibrance = settings.inputVibrance || 0;
    const levels = Math.round(settings.colorLevels || 0);
    if (
      brightness === 0
      && contrast === 0
      && saturation === 1
      && exposure === 0
      && gamma === 1
      && hue === 0
      && warmth === 0
      && vibrance === 0
      && levels <= 0
    ) return imageData;

    const data = imageData.data;
    const contrastFactor = contrast >= 0 ? 1 + contrast * 2.15 : 1 + contrast * 0.92;
    const brightnessOffset = brightness * 255;
    const exposureFactor = Math.pow(2, exposure);
    const warmthRed = warmth * 36;
    const warmthGreen = warmth * 8;
    const warmthBlue = warmth * -36;
    const quantize = (value) => {
      if (levels <= 1) return value;
      return Math.round((value / 255) * (levels - 1)) * (255 / (levels - 1));
    };

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 16) continue;
      let r = clamp((data[i] - 128) * contrastFactor + 128 + brightnessOffset, 0, 255);
      let g = clamp((data[i + 1] - 128) * contrastFactor + 128 + brightnessOffset, 0, 255);
      let b = clamp((data[i + 2] - 128) * contrastFactor + 128 + brightnessOffset, 0, 255);

      if (exposureFactor !== 1) {
        r = clamp(r * exposureFactor, 0, 255);
        g = clamp(g * exposureFactor, 0, 255);
        b = clamp(b * exposureFactor, 0, 255);
      }

      if (warmth !== 0) {
        r = clamp(r + warmthRed, 0, 255);
        g = clamp(g + warmthGreen, 0, 255);
        b = clamp(b + warmthBlue, 0, 255);
      }

      if (gamma !== 1) {
        const invGamma = 1 / gamma;
        r = Math.pow(clamp(r, 0, 255) / 255, invGamma) * 255;
        g = Math.pow(clamp(g, 0, 255) / 255, invGamma) * 255;
        b = Math.pow(clamp(b, 0, 255) / 255, invGamma) * 255;
      }

      if (saturation !== 1 || hue !== 0 || vibrance !== 0) {
        const hsl = rgbToHsl(r, g, b);
        const vibranceGain = vibrance >= 0
          ? 1 + vibrance * (1 - hsl.s) * 1.45
          : 1 + vibrance * 0.85;
        const saturated = hslToRgb(
          mod(hsl.h + hue / 360, 1),
          clamp(hsl.s * saturation * vibranceGain, 0, 1),
          hsl.l
        );
        r = saturated.r;
        g = saturated.g;
        b = saturated.b;
      }

      data[i] = Math.round(clamp(quantize(r), 0, 255));
      data[i + 1] = Math.round(clamp(quantize(g), 0, 255));
      data[i + 2] = Math.round(clamp(quantize(b), 0, 255));
    }

    return imageData;
  }

  function classifyBucket(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    if (hsl.l < 0.13) return "ink";
    if (hsl.s < 0.14) {
      if (hsl.l > 0.82) return "light";
      return "shadow";
    }
    if (hsl.l < 0.2 && hsl.s < 0.38) return "ink";
    const hue = hsl.h * 360;
    if (hue < 22 || hue >= 342) return "red";
    if (hue < 72) return "yellow";
    if (hue < 155) return "green";
    if (hue < 200) return "cyan";
    if (hue < 265) return "blue";
    if (hue < 342) return "magenta";
    return "shadow";
  }

  function toneAmount(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const fromWhite = 1 - Math.min(r, g, b) / 255;
    const chroma = hsl.s * (1 - Math.abs(hsl.l - 0.5) * 0.65);
    return clamp(fromWhite * 0.74 + chroma * 0.52, 0, 1);
  }

  function paletteToneColor(bucket, r, g, b, settings) {
    if (settings.revealMethod === "alpha") {
      const hsl = rgbToHsl(r, g, b);
      return hslToRgb(
        hsl.h,
        clamp(hsl.s * 1.18 + 0.08, 0, 1),
        clamp(hsl.l * 0.72 + 0.1, 0.06, 0.92)
      );
    }

    const paletteName = bucketPalette[bucket] || "black";
    return indexedPalette[paletteName] || indexedPalette.black;
  }

  function densityGate(px, py, coverage) {
    return bayer4[mod(py, 4)][mod(px, 4)] < clamp(coverage, 0, 1) * 16;
  }

  function templateCoverageHit(baseHit, px, py, coverage, baseCoverage) {
    const c = clamp(coverage, 0.02, 0.92);
    const base = clamp(baseCoverage, 0.02, 0.92);
    if (c < base) return baseHit && densityGate(px, py, c / base);
    if (baseHit) return true;
    return densityGate(px + 3, py + 1, (c - base) / (1 - base));
  }

  function templateDot20Hit(px, py) {
    const tx = mod(px, 10);
    const ty = mod(py, 10);
    const dotA = (tx - 5) * (tx - 5) + (ty - 1) * (ty - 1) <= 5;
    const edgeX = Math.min(tx, 10 - tx);
    const dotB = edgeX * edgeX + (ty - 5) * (ty - 5) <= 5;
    return dotA || dotB;
  }

  function patternHit(pattern, x, y, scale, coverage) {
    const s = Math.max(1, Math.round(scale));
    const px = Math.floor(x / s);
    const py = Math.floor(y / s);
    const c = clamp(coverage, 0.02, 1);
    const period = 8;
    const line = Math.max(1, Math.min(period - 1, Math.round(c * period)));

    if (pattern === "solid") return true;
    if (pattern === "templateSlash8") return templateCoverageHit(mod(px + py, 8) === 4, px, py, c, 0.125);
    if (pattern === "templateCross4") return templateCoverageHit(mod(px - py, 4) === 0 || mod(px + py, 4) === 0, px, py, c, 0.375);
    if (pattern === "templateDots20") return templateCoverageHit(templateDot20Hit(px, py), px, py, c, 0.34);
    if (pattern === "bayer") return densityGate(px, py, c);
    if (pattern === "checker") return ((px + py) & 1) === 0 ? c >= 0.5 || densityGate(px, py, c * 2) : c > 0.5 && densityGate(px, py, (c - 0.5) * 2);
    if (pattern === "microdots") return bayer8[mod(py, 8)][mod(px, 8)] < c * 64;
    if (pattern === "slash") return mod(px + py, period) < line;
    if (pattern === "backslash") return mod(px - py, period) < line;
    if (pattern === "plus") {
      const tx = mod(px, 4);
      const ty = mod(py, 4);
      const cross = tx === 1 || ty === 1;
      return cross ? c >= 0.44 || densityGate(px, py, c * 2.25) : c > 0.44 && densityGate(px, py, (c - 0.44) * 1.8);
    }
    if (pattern === "diamonds") {
      const tx = mod(px + 2, 8);
      const ty = mod(py + 4, 8);
      return Math.abs(tx - 4) + Math.abs(ty - 4) <= line;
    }
    if (pattern === "lattice") return mod(px + py, period) < Math.max(1, Math.round(line * 0.62)) || mod(px - py, period) < Math.max(1, Math.round(line * 0.5));
    if (pattern === "crosshatch") return mod(px + py, period) < Math.max(1, Math.round(line * 0.58)) || mod(px - py, period) < Math.max(1, Math.round(line * 0.58));
    return densityGate(px, py, c);
  }

  function shouldStaySolid(r, g, b, settings) {
    const hsl = rgbToHsl(r, g, b);
    const l = luminance(r, g, b);
    return l < settings.inkThreshold || (l < settings.inkThreshold + 0.09 && hsl.s < 0.44);
  }

  function selectedBucketPattern(r, g, b, settings) {
    const bucket = templateBucket(classifyBucket(r, g, b));
    return settings.bucketPatterns[bucket] || config.bucketPatterns[bucket] || "templateSlash8";
  }

  function selectedBucketCoverage(bucket, pattern, settings) {
    return settings.bucketCoverage[bucket] || config.patternCoverage[pattern] || 0.5;
  }

  function isTimelineSolidPixel(r, g, b, a, settings) {
    if (a < 16) return false;
    return selectedBucketPattern(r, g, b, settings) === "solid" || shouldStaySolid(r, g, b, settings);
  }

  function solidInkColor(r, g, b, settings) {
    if (settings.revealMethod === "alpha") {
      const l = luminance(r, g, b);
      if (l < 0.09) return indexedPalette.black;
      return {
        r: Math.round(clamp(r * 0.72, 0, 255)),
        g: Math.round(clamp(g * 0.72, 0, 255)),
        b: Math.round(clamp(b * 0.72, 0, 255))
      };
    }

    return indexedPalette.black;
  }

  function compressionBaseColor(settings) {
    const paper = config.timelinePaper;
    const whiteMix = settings.backgroundEnabled ? settings.backgroundOpacity : 0;
    return {
      r: Math.round(lerp(paper.r, 255, whiteMix)),
      g: Math.round(lerp(paper.g, 255, whiteMix)),
      b: Math.round(lerp(paper.b, 255, whiteMix))
    };
  }

  function clampForBalancedPair(value, coverage, base) {
    const p = clamp(coverage, 0.08, 0.92);
    const min = Math.max(0, (base - 255 * (1 - p)) / p);
    const max = Math.min(255, base / p);
    return Math.round(clamp(value, min, max));
  }

  function partnerChannel(value, coverage, base) {
    const p = clamp(coverage, 0.08, 0.92);
    return Math.round(clamp((base - p * value) / (1 - p), 0, 255));
  }

  function hiddenBucketColor(bucket, r, g, b, coverage, base) {
    const seed = compressionInkPairs[bucket] || compressionInkPairs.shadow;

    return {
      r: clampForBalancedPair(seed.r, coverage, base.r),
      g: clampForBalancedPair(seed.g, coverage, base.g),
      b: clampForBalancedPair(seed.b, coverage, base.b)
    };
  }

  function compressionCoverage(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const l = luminance(r, g, b);
    const detail = clamp((1 - l) * 0.82 + hsl.s * 0.32, 0, 1);
    return clamp(0.145 + detail * 0.045 + hsl.s * 0.018, 0.145, 0.2);
  }

  function microdotCoverage(coverage) {
    const dotCount = Math.round(clamp(coverage, 1 / 64, 63 / 64) * 64);
    return clamp(dotCount, 1, 63) / 64;
  }

  function balancedRevealColor(r, g, b, coverage, base, settings) {
    const target = revealScreenTarget(r, g, b, settings);
    return {
      r: clampForBalancedPair(target.r, coverage, base.r),
      g: clampForBalancedPair(target.g, coverage, base.g),
      b: clampForBalancedPair(target.b, coverage, base.b)
    };
  }

  function iphoneDarkBaseColor() {
    return config.iphoneTimelineBase;
  }

  function iphoneDarkCoverage(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const tone = toneAmount(r, g, b);
    const raw = 0.16 + hsl.s * 0.035 + tone * 0.025;
    return Math.round(clamp(raw, 0.125, 0.25) * 64) / 64;
  }

  function iphoneDarkTargetColor(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const saturation = clamp(hsl.s * 1.22 + 0.06, 0, 1);
    const lightness = clamp(hsl.l * 0.84 + 0.03, 0.035, 0.88);
    return hslToRgb(hsl.h, saturation, lightness);
  }

  function iphoneDarkCarrierColor(r, g, b, x, y, settings) {
    const base = iphoneDarkBaseColor();
    const coverage = iphoneDarkCoverage(r, g, b);
    const hit = patternHit("microdots", x, y, settings.patternScale, coverage);
    const target = iphoneDarkTargetColor(r, g, b);
    const visible = {
      r: clampForBalancedPair(target.r, coverage, base.r),
      g: clampForBalancedPair(target.g, coverage, base.g),
      b: clampForBalancedPair(target.b, coverage, base.b)
    };
    const partner = balancedPartnerColor(visible, coverage, base);
    return hit ? visible : partner;
  }

  function templateBucket(bucket) {
    return bucket;
  }

  function templatePaletteColor(bucket) {
    const normalized = templateBucket(bucket);
    if (normalized === "shadow" || normalized === "light") return indexedPalette.black;
    return indexedPalette[normalized] || indexedPalette.black;
  }

  function templateToneCoverage(bucket, r, g, b, settings) {
    const normalized = templateBucket(bucket);
    const pattern = settings.bucketPatterns[normalized] || config.bucketPatterns[normalized] || "templateSlash8";
    const base = settings.bucketCoverage[normalized] || config.patternCoverage[pattern] || 0.125;
    const hsl = rgbToHsl(r, g, b);
    const shade = toneAmount(r, g, b);
    const contrastFloor = hsl.l < 0.32 || hsl.s > 0.45 ? 0.92 : 0.34;
    const strength = clamp(shade * 0.74 + hsl.s * 0.38 + (1 - hsl.l) * 0.18, contrastFloor, 1);
    return clamp(base * strength, 0.02, 0.58);
  }

  function balancedPartnerColor(color, coverage, base) {
    return {
      r: partnerChannel(color.r, coverage, base.r),
      g: partnerChannel(color.g, coverage, base.g),
      b: partnerChannel(color.b, coverage, base.b)
    };
  }

  function isFlatPaperPixel(r, g, b, a) {
    if (a < 16) return true;
    const hsl = rgbToHsl(r, g, b);
    return hsl.l > 0.94 && hsl.s < 0.08;
  }

  function compressedTargetColor(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    if (hsl.l > 0.965 && hsl.s < 0.1) return indexedPalette.white;

    const lifted = hslToRgb(
      hsl.h,
      clamp(hsl.s * 0.24, 0, 0.36),
      clamp(0.86 + hsl.l * 0.11, 0.86, 0.985)
    );

    return {
      r: Math.round(lerp(255, lifted.r, 0.62)),
      g: Math.round(lerp(255, lifted.g, 0.62)),
      b: Math.round(lerp(255, lifted.b, 0.62))
    };
  }

  function orderedThreshold8(x, y, channel, scale) {
    const s = Math.max(1, Math.round(scale));
    const px = Math.floor(x / s);
    const py = Math.floor(y / s);
    const offsets = [
      [0, 0],
      [3, 5],
      [6, 2]
    ];
    const offset = offsets[channel] || offsets[0];
    return (bayer8[mod(py + offset[1], 8)][mod(px + offset[0], 8)] + 0.5) / 64;
  }

  function orderedPaletteColor(r, g, b, x, y, scale) {
    if (r > 250 && g > 250 && b > 250) return indexedPalette.white;
    if (r < 5 && g < 5 && b < 5) return indexedPalette.black;

    return {
      r: r / 255 > orderedThreshold8(x, y, 0, scale) ? 255 : 0,
      g: g / 255 > orderedThreshold8(x, y, 1, scale) ? 255 : 0,
      b: b / 255 > orderedThreshold8(x, y, 2, scale) ? 255 : 0
    };
  }

  function orderedScreenColor(r, g, b, x, y, settings) {
    const hsl = rgbToHsl(r, g, b);
    if (hsl.s < 0.1) {
      const value = luminance(r, g, b) > orderedThreshold8(x, y, 0, settings.patternScale) ? 255 : 0;
      return { r: value, g: value, b: value };
    }

    return orderedPaletteColor(r, g, b, x, y, settings.patternScale);
  }

  function cheatSheetMaskHit(x, y, scale) {
    const s = Math.max(1, Math.round(scale || 1));
    return ((Math.floor(x / s) + Math.floor(y / s)) & 1) === 0;
  }

  function matteMaskHit(x, y, scale, whiteMatte) {
    const s = Math.max(1, Math.round(scale || 1));
    const px = Math.floor(x / s);
    const py = Math.floor(y / s);
    const carrierPixels = Math.round(clamp(1 - whiteMatte, 0, 1) * 64);
    return bayer8[mod(py, 8)][mod(px, 8)] < carrierPixels;
  }

  function matteColorAdjust(r, g, b, strength) {
    const amount = clamp(strength ?? 1, 0, 2);
    if (amount <= 1) {
      return {
        r: Math.round(lerp(255, r, amount)),
        g: Math.round(lerp(255, g, amount)),
        b: Math.round(lerp(255, b, amount))
      };
    }

    const hsl = rgbToHsl(r, g, b);
    return hslToRgb(
      hsl.h,
      clamp(hsl.s * (1 + (amount - 1) * 0.85), 0, 1),
      clamp(hsl.l - (amount - 1) * 0.08 * (1 - hsl.l), 0, 1)
    );
  }

  function matteIndexedColor(r, g, b, x, y, settings) {
    const adjusted = matteColorAdjust(r, g, b, settings.matteColorStrength);
    const opacity = clamp(settings.hiddenColorOpacity ?? 1, 0, 1);
    const color = {
      r: Math.round(lerp(255, adjusted.r, opacity)),
      g: Math.round(lerp(255, adjusted.g, opacity)),
      b: Math.round(lerp(255, adjusted.b, opacity))
    };
    const step = 51;
    return {
      r: posterizeChannel(color.r, x, y, 0, settings.patternScale, step),
      g: posterizeChannel(color.g, x, y, 1, settings.patternScale, step),
      b: posterizeChannel(color.b, x, y, 2, settings.patternScale, step)
    };
  }

  function posterizeChannel(value, x, y, channel, scale, step = 85) {
    const scaled = clamp(value, 0, 255) / step;
    const low = Math.floor(scaled);
    const high = Math.min(Math.round(255 / step), low + 1);
    if (high === low) return low * step;
    const threshold = orderedThreshold8(x, y, channel, scale);
    return (scaled - low) > threshold ? high * step : low * step;
  }

  function sampleIndexedColor(r, g, b, x, y, settings) {
    return {
      r: posterizeChannel(r, x, y, 0, settings.patternScale),
      g: posterizeChannel(g, x, y, 1, settings.patternScale),
      b: posterizeChannel(b, x, y, 2, settings.patternScale)
    };
  }

  function iphonePng8Channel(value, x, y, channel, settings) {
    const levels = iphonePng8Levels;
    const v = clamp(value, levels[0], 255);
    let highIndex = levels.findIndex((level) => v <= level);
    if (highIndex <= 0) return levels[0];
    if (highIndex === -1) return 255;

    const low = levels[highIndex - 1];
    const high = levels[highIndex];
    if (high === low) return high;
    const threshold = orderedThreshold8(x, y, channel, settings.patternScale);
    return ((v - low) / (high - low)) > threshold ? high : low;
  }

  function iphonePng8VisibleColor(r, g, b, x, y, settings) {
    const hsl = rgbToHsl(r, g, b);
    const l = luminance(r, g, b);
    const strength = clamp(settings.matteColorStrength ?? 1, 0, 2);
    const opacity = clamp(settings.hiddenColorOpacity ?? 1, 0, 1);
    const baseSaturation = clamp(hsl.s * 0.68 + (1 - l) * 0.05, 0, 0.68);
    const baseLightness = clamp(0.62 + hsl.l * 0.31, 0.62, 0.965);
    const saturation = clamp(baseSaturation * strength, 0, 0.72);
    const lightness = clamp(
      lerp(0.985, baseLightness, Math.min(strength, 1)) - Math.max(0, strength - 1) * 0.07 * (1 - hsl.l),
      0.58,
      0.985
    );
    const adjusted = hslToRgb(hsl.h, saturation, lightness);
    const color = {
      r: Math.round(lerp(255, adjusted.r, opacity)),
      g: Math.round(lerp(255, adjusted.g, opacity)),
      b: Math.round(lerp(255, adjusted.b, opacity))
    };

    return {
      r: iphonePng8Channel(color.r, x, y, 0, settings),
      g: iphonePng8Channel(color.g, x, y, 1, settings),
      b: iphonePng8Channel(color.b, x, y, 2, settings)
    };
  }

  function quantizeAlphaChannel(value) {
    return Math.round(clamp(value, 0, 255) / 51) * 51;
  }

  function quantizeCarrierChannel(value) {
    return Math.min(255, Math.round(clamp(value, 0, 255) / 64) * 64);
  }

  function isSkinBasePixel(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const hue = hsl.h * 360;
    const l = luminance(r, g, b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = (max - min) / 255;
    const warmHue = hue <= 58 || hue >= 342;
    const redLead = r - Math.max(g, b);
    const redBlueGap = r - b;
    const greenBlueGap = g - b;

    return warmHue
      && r > 92
      && g > 45
      && b > 35
      && redBlueGap > 18
      && redLead > -10
      && greenBlueGap > -22
      && l > 0.52
      && l < 0.95
      && hsl.s > 0.06
      && chroma > 0.045
      && chroma < 0.55;
  }

  function darkAlphaTransparentPixel(r, g, b, a) {
    if (a < 16) return true;
    const hsl = rgbToHsl(r, g, b);
    const l = luminance(r, g, b);
    const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const nearPaperWhite = l > 0.972 && chroma < 0.04;
    const flatLightPaper = l > 0.94 && chroma < 0.075 && hsl.s < 0.12;
    return nearPaperWhite || flatLightPaper || isSkinBasePixel(r, g, b);
  }

  function darkAlphaColor(r, g, b) {
    const hsl = rgbToHsl(r, g, b);
    const color = hslToRgb(
      hsl.h,
      clamp(hsl.s * 1.08 + 0.02, 0, 1),
      clamp(hsl.l * 0.94, 0, 0.96)
    );
    return {
      r: quantizeAlphaChannel(color.r),
      g: quantizeAlphaChannel(color.g),
      b: quantizeAlphaChannel(color.b)
    };
  }

  function darkAlphaToneCoverage(r, g, b, settings) {
    const bucket = templateBucket(classifyBucket(r, g, b));
    const pattern = selectedBucketPattern(r, g, b, settings);
    const base = settings.bucketCoverage[bucket] || config.patternCoverage[pattern] || 0.24;
    const hsl = rgbToHsl(r, g, b);
    const shade = toneAmount(r, g, b);
    const toneBoost = clamp(shade * 0.52 + hsl.s * 0.24 + (1 - hsl.l) * 0.18, 0.42, 1.08);
    return clamp(base * toneBoost, 0.035, 0.4);
  }

  function revealScreenTarget(r, g, b, settings) {
    const hsl = rgbToHsl(r, g, b);
    if (hsl.l > 0.965 && hsl.s < 0.1) return compressionBaseColor(settings);

    const paper = compressionBaseColor(settings);
    const tone = toneAmount(r, g, b);
    const darkPush = clamp((0.55 - hsl.l) * 0.34, -0.1, 0.22);
    const saturation = clamp(hsl.s * 1.28 + 0.1, 0, 1);
    const lightness = clamp(hsl.l * 0.64 + 0.08 + darkPush, 0.03, 0.88);
    const visible = hslToRgb(hsl.h, saturation, lightness);
    const signal = clamp(0.86 + tone * 0.1 + hsl.s * 0.08, 0.82, 1);

    return {
      r: Math.round(lerp(paper.r, visible.r, signal)),
      g: Math.round(lerp(paper.g, visible.g, signal)),
      b: Math.round(lerp(paper.b, visible.b, signal))
    };
  }

  function promptInkPair(style) {
    if (style === "invert" || style === "hollow" || style === "white") {
      return { outer: "#000000", inner: "#ffffff", fill: "#ffffff", shadow: "#000000" };
    }
    return { outer: "#ffffff", inner: "#000000", fill: "#000000", shadow: "#000000" };
  }

  function drawStyledPromptText(ctx, text, x, y, style, fontSize) {
    const colors = promptInkPair(style);
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (style === "clean") {
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y);
      ctx.restore();
      return;
    }

    if (style === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, x, y);
      ctx.restore();
      return;
    }

    if (style === "shadow") {
      ctx.fillStyle = colors.shadow;
      ctx.fillText(text, x + fontSize * 0.08, y + fontSize * 0.1);
    }

    if (style === "bubble") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(16, Math.round(fontSize * 0.32));
      ctx.strokeText(text, x, y);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = Math.max(9, Math.round(fontSize * 0.18));
      ctx.strokeText(text, x, y);
      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y);
      ctx.restore();
      return;
    }

    const outerWidth = style === "heavy"
      ? Math.max(16, Math.round(fontSize * 0.32))
      : style === "hollow" || style === "invert"
        ? Math.max(10, Math.round(fontSize * 0.2))
        : Math.max(10, Math.round(fontSize * 0.22));
    ctx.strokeStyle = colors.outer;
    ctx.lineWidth = outerWidth;
    ctx.strokeText(text, x, y);

    if (style === "heavy") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(6, Math.round(fontSize * 0.09));
      ctx.strokeText(text, x, y);
    }

    ctx.fillStyle = colors.fill;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function buildArrowPath(ctx, style, y, w) {
    if (style === "right") {
      ctx.moveTo(-w * 0.65, y);
      ctx.lineTo(w * 0.65, y);
      ctx.moveTo(w * 0.3, y - w * 0.25);
      ctx.lineTo(w * 0.65, y);
      ctx.lineTo(w * 0.3, y + w * 0.25);
      return;
    }

    if (style === "up") {
      ctx.moveTo(0, y + w * 0.48);
      ctx.lineTo(0, y - w * 0.48);
      ctx.moveTo(-w * 0.24, y - w * 0.14);
      ctx.lineTo(0, y - w * 0.48);
      ctx.lineTo(w * 0.24, y - w * 0.14);
      return;
    }

    if (style === "down") {
      ctx.moveTo(0, y - w * 0.48);
      ctx.lineTo(0, y + w * 0.48);
      ctx.moveTo(-w * 0.24, y + w * 0.14);
      ctx.lineTo(0, y + w * 0.48);
      ctx.lineTo(w * 0.24, y + w * 0.14);
      return;
    }

    if (style === "double") {
      ctx.moveTo(w * 0.65, y);
      ctx.lineTo(-w * 0.65, y);
      ctx.moveTo(-w * 0.3, y - w * 0.25);
      ctx.lineTo(-w * 0.65, y);
      ctx.lineTo(-w * 0.3, y + w * 0.25);
      ctx.moveTo(w * 0.3, y - w * 0.25);
      ctx.lineTo(w * 0.65, y);
      ctx.lineTo(w * 0.3, y + w * 0.25);
      return;
    }

    if (style === "chevron") {
      ctx.moveTo(w * 0.22, y - w * 0.34);
      ctx.lineTo(-w * 0.22, y);
      ctx.lineTo(w * 0.22, y + w * 0.34);
      ctx.moveTo(w * 0.56, y - w * 0.34);
      ctx.lineTo(w * 0.12, y);
      ctx.lineTo(w * 0.56, y + w * 0.34);
      return;
    }

    ctx.moveTo(w * 0.65, y);
    ctx.lineTo(-w * 0.65, y);
    ctx.moveTo(-w * 0.3, y - w * 0.25);
    ctx.lineTo(-w * 0.65, y);
    ctx.lineTo(-w * 0.3, y + w * 0.25);
  }

  function drawStyledArrow(ctx, style, arrowY, arrowW, fontSize, promptStyle) {
    const colors = promptInkPair(promptStyle);
    const outer = promptStyle === "invert" || promptStyle === "hollow" ? "#000000" : colors.outer;
    const inner = promptStyle === "invert" || promptStyle === "hollow" ? "#ffffff" : colors.inner;
    const outerWidth = promptStyle === "heavy"
      ? Math.max(20, Math.round(fontSize * 0.42))
      : Math.max(18, Math.round(fontSize * 0.34));
    const innerWidth = promptStyle === "heavy"
      ? Math.max(10, Math.round(fontSize * 0.18))
      : Math.max(8, Math.round(fontSize * 0.15));

    ctx.strokeStyle = outer;
    ctx.lineWidth = outerWidth;
    ctx.beginPath();
    buildArrowPath(ctx, style, arrowY, arrowW);
    ctx.stroke();

    ctx.strokeStyle = inner;
    ctx.lineWidth = innerWidth;
    ctx.beginPath();
    buildArrowPath(ctx, style, arrowY, arrowW);
    ctx.stroke();
  }

  function applyVisiblePrompt(imageData, width, height) {
    const settings = effectiveSettings();
    const text = String(settings.promptText || "").trim();
    const symbols = String(settings.promptSymbols || "").trim();
    if (!text && !symbols && !settings.promptArrow) return;

    const overlay = document.createElement("canvas");
    setCanvasSize(overlay, width, height);
    const ctx = overlay.getContext("2d", { willReadFrequently: true });
    const minSide = Math.min(width, height);
    const scale = clamp(settings.promptScale || 1, 0.35, 2.2);
    const fontSize = Math.max(24, Math.round(minSide * 0.072 * scale));
    const symbolSize = Math.max(18, Math.round(fontSize * 0.72));
    const fontStack = promptFonts[settings.promptFont] || promptFonts.arial;
    const promptStyle = promptStyles.has(settings.promptStyle) ? settings.promptStyle : defaultSettings.promptStyle;
    const arrowStyle = promptArrowStyles.has(settings.promptArrowStyle) ? settings.promptArrowStyle : defaultSettings.promptArrowStyle;
    const x = width * clamp(settings.promptX ?? 0.76, 0.02, 0.98);
    const y = height * clamp(settings.promptY ?? 0.18, 0.02, 0.98);
    const rotation = (settings.promptRotation || 0) * Math.PI / 180;
    const lines = (text || " ").split(/\r?\n/).slice(0, 3);
    const lineHeight = Math.round(fontSize * 0.88);
    const blockHeight = text ? lineHeight * lines.length : 0;

    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (symbols) {
      ctx.font = `900 ${symbolSize}px ${fontStack}`;
      drawStyledPromptText(ctx, symbols, 0, -blockHeight / 2 - symbolSize * 0.55, promptStyle, symbolSize);
    }

    if (text) {
      ctx.font = `900 ${fontSize}px ${fontStack}`;
      lines.forEach((line, index) => {
        const lineY = (index - (lines.length - 1) / 2) * lineHeight;
        drawStyledPromptText(ctx, line, 0, lineY, promptStyle, fontSize);
      });
    }

    if (settings.promptArrow) {
      const arrowY = Math.round(blockHeight / 2 + fontSize * 0.72);
      const arrowW = Math.round(minSide * 0.16 * scale);
      drawStyledArrow(ctx, arrowStyle, arrowY, arrowW, fontSize, promptStyle);
    }
    ctx.restore();

    const prompt = ctx.getImageData(0, 0, width, height).data;
    const out = imageData.data;
    for (let i = 0; i < prompt.length; i += 4) {
      if (prompt[i + 3] < 48) continue;
      const dark = luminance(prompt[i], prompt[i + 1], prompt[i + 2]) < 0.5;
      const value = dark ? 0 : 255;
      out[i] = value;
      out[i + 1] = value;
      out[i + 2] = value;
      out[i + 3] = 255;
    }
  }

  function imageDataToCanvas(imageData, width, height) {
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, width, height);
    canvas.getContext("2d").putImageData(imageData, 0, 0);
    return canvas;
  }

  function rgbaKey(r, g, b, a) {
    return (((a << 24) | (b << 16) | (g << 8) | r) >>> 0);
  }

  function writeUint32(bytes, offset, value) {
    bytes[offset] = (value >>> 24) & 255;
    bytes[offset + 1] = (value >>> 16) & 255;
    bytes[offset + 2] = (value >>> 8) & 255;
    bytes[offset + 3] = value & 255;
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(typeBytes, data) {
    let crc = 0xffffffff;
    for (let i = 0; i < typeBytes.length; i += 1) {
      crc = crcTable[(crc ^ typeBytes[i]) & 255] ^ (crc >>> 8);
    }
    for (let i = 0; i < data.length; i += 1) {
      crc = crcTable[(crc ^ data[i]) & 255] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
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
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const output = new Uint8Array(length);
    let offset = 0;
    parts.forEach((part) => {
      output.set(part, offset);
      offset += part.length;
    });
    return output;
  }

  async function deflateBytes(bytes) {
    if (!("CompressionStream" in window)) return null;
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  function buildIndexedScanlines(imageData, width, height) {
    const palette = [];
    const alpha = [];
    const map = new Map();
    const used = new Set();
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      used.add(rgbaKey(data[i], data[i + 1], data[i + 2], data[i + 3]));
    }

    [...iphonePng8Palette, ...samplePngPalette, ...canonicalPngPalette].forEach((color) => {
      const key = rgbaKey(color.r, color.g, color.b, color.a);
      if (used.has(key) && !map.has(key)) {
        map.set(key, palette.length);
        palette.push(color);
        alpha.push(color.a);
      }
    });

    const scanlines = new Uint8Array((width + 1) * height);

    for (let y = 0; y < height; y += 1) {
      const row = y * (width + 1);
      scanlines[row] = 0;
      for (let x = 0; x < width; x += 1) {
        const source = (y * width + x) * 4;
        const a = data[source + 3];
        const r = data[source];
        const g = data[source + 1];
        const b = data[source + 2];
        const key = rgbaKey(r, g, b, a);
        let index = map.get(key);

        if (index === undefined) {
          if (palette.length >= 256) return null;
          index = palette.length;
          map.set(key, index);
          palette.push({ r, g, b, a });
          alpha.push(a);
        }

        scanlines[row + x + 1] = index;
      }
    }

    return { palette, alpha, scanlines };
  }

  async function encodeIndexedPng(imageData, width, height) {
    const indexed = buildIndexedScanlines(imageData, width, height);
    if (!indexed) return null;

    const compressed = await deflateBytes(indexed.scanlines);
    if (!compressed) return null;

    const ihdr = new Uint8Array(13);
    writeUint32(ihdr, 0, width);
    writeUint32(ihdr, 4, height);
    ihdr[8] = 8;
    ihdr[9] = 3;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const plte = new Uint8Array(indexed.palette.length * 3);
    indexed.palette.forEach((color, index) => {
      const offset = index * 3;
      plte[offset] = color.r;
      plte[offset + 1] = color.g;
      plte[offset + 2] = color.b;
    });

    let trns = null;
    let lastTransparentIndex = indexed.alpha.length - 1;
    while (lastTransparentIndex >= 0 && indexed.alpha[lastTransparentIndex] === 255) {
      lastTransparentIndex -= 1;
    }
    if (lastTransparentIndex >= 0) {
      trns = new Uint8Array(indexed.alpha.slice(0, lastTransparentIndex + 1));
    }
    const parts = [
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk("IHDR", ihdr),
      pngChunk("PLTE", plte)
    ];

    if (trns) parts.push(pngChunk("tRNS", trns));
    parts.push(pngChunk("IDAT", compressed));
    parts.push(pngChunk("IEND", new Uint8Array(0)));

    return new Blob([concatBytes(parts)], { type: "image/png" });
  }

  async function encodeRgbPng(imageData, width, height) {
    const source = imageData.data;
    const scanlines = new Uint8Array((width * 3 + 1) * height);

    for (let y = 0; y < height; y += 1) {
      const row = y * (width * 3 + 1);
      scanlines[row] = 0;
      for (let x = 0; x < width; x += 1) {
        const sourceOffset = (y * width + x) * 4;
        const outOffset = row + 1 + x * 3;
        const alpha = source[sourceOffset + 3] / 255;
        scanlines[outOffset] = Math.round(source[sourceOffset] * alpha + 255 * (1 - alpha));
        scanlines[outOffset + 1] = Math.round(source[sourceOffset + 1] * alpha + 255 * (1 - alpha));
        scanlines[outOffset + 2] = Math.round(source[sourceOffset + 2] * alpha + 255 * (1 - alpha));
      }
    }

    const compressed = await deflateBytes(scanlines);
    if (!compressed) return null;

    const ihdr = new Uint8Array(13);
    writeUint32(ihdr, 0, width);
    writeUint32(ihdr, 4, height);
    ihdr[8] = 8;
    ihdr[9] = 2;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const gamma = new Uint8Array(4);
    writeUint32(gamma, 0, 45455);

    const parts = [
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk("IHDR", ihdr),
      pngChunk("sRGB", new Uint8Array([0])),
      pngChunk("gAMA", gamma),
      pngChunk("IDAT", compressed),
      pngChunk("IEND", new Uint8Array(0))
    ];

    return new Blob([concatBytes(parts)], { type: "image/png" });
  }

  async function encodeRgbaPng(imageData, width, height) {
    const source = imageData.data;
    const scanlines = new Uint8Array((width * 4 + 1) * height);

    for (let y = 0; y < height; y += 1) {
      const row = y * (width * 4 + 1);
      scanlines[row] = 0;
      for (let x = 0; x < width; x += 1) {
        const sourceOffset = (y * width + x) * 4;
        const outOffset = row + 1 + x * 4;
        scanlines[outOffset] = source[sourceOffset];
        scanlines[outOffset + 1] = source[sourceOffset + 1];
        scanlines[outOffset + 2] = source[sourceOffset + 2];
        scanlines[outOffset + 3] = source[sourceOffset + 3];
      }
    }

    const compressed = await deflateBytes(scanlines);
    if (!compressed) return null;

    const ihdr = new Uint8Array(13);
    writeUint32(ihdr, 0, width);
    writeUint32(ihdr, 4, height);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const gamma = new Uint8Array(4);
    writeUint32(gamma, 0, 45455);

    const parts = [
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
      pngChunk("IHDR", ihdr),
      pngChunk("sRGB", new Uint8Array([0])),
      pngChunk("gAMA", gamma),
      pngChunk("IDAT", compressed),
      pngChunk("IEND", new Uint8Array(0))
    ];

    return new Blob([concatBytes(parts)], { type: "image/png" });
  }

  function normalizedDarkAlphaImageData(imageData, width, height) {
    const normalized = new ImageData(new Uint8ClampedArray(imageData.data), width, height);
    const data = normalized.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 0;
      } else {
        data[i] = quantizeAlphaChannel(data[i]);
        data[i + 1] = quantizeAlphaChannel(data[i + 1]);
        data[i + 2] = quantizeAlphaChannel(data[i + 2]);
        data[i + 3] = 255;
      }
    }
    return normalized;
  }

  async function outputPngBlob(output) {
    const settings = effectiveSettings();
    const png = settings.revealMethod === "compression"
      ? await encodeRgbPng(output.imageData, output.width, output.height)
      : await encodeIndexedPng(output.imageData, output.width, output.height);
    if (!png) {
      throw new Error("PNG encoder is unavailable in this browser.");
    }
    return png;
  }

  function buildTapImage(image) {
    const settings = effectiveSettings();
    const carrierMode = settings.revealMethod === "carrier" || settings.revealMethod === "carrierSoft";
    const compressionMode = settings.revealMethod === "compression";
    const templateMode = settings.revealMethod === "template" || settings.revealMethod === "templateMatte";
    const templateMatteMode = settings.revealMethod === "templateMatte";
    const iosAlphaMode = settings.revealMethod === "iosAlpha";
    const darkAlphaMode = settings.revealMethod === "darkAlpha";
    const carrierAlpha = settings.revealMethod === "carrierSoft" ? 1 : 0;
    const dims = outputDimensions(image, settings);
    const source = applyInputAdjustments(sourceData(image, dims.width, dims.height, true), settings);
    const src = source.data;
    const output = new ImageData(dims.width, dims.height);
    const out = output.data;
    const paintMask = matchingPaintMask(dims.width, dims.height);
    const previewOutput = (iosAlphaMode || darkAlphaMode || compressionMode || (templateMode && !templateMatteMode))
      ? new ImageData(dims.width, dims.height)
      : null;
    const backgroundAlpha = carrierMode ? carrierAlpha : settings.backgroundEnabled ? Math.round(settings.backgroundOpacity * 255) : 0;
    const matteAlpha = backgroundAlpha;
    const compressionBase = compressionBaseColor(settings);
    const matte = settings.revealMethod === "alpha" && !settings.backgroundEnabled
      ? { r: 255, g: 255, b: 255 }
      : config.transparentRgb;

    for (let y = 0; y < dims.height; y += 1) {
      for (let x = 0; x < dims.width; x += 1) {
        const i = (y * dims.width + x) * 4;
        const sr = src[i];
        const sg = src[i + 1];
        const sb = src[i + 2];
        const sa = src[i + 3];
        if (compressionMode && (isFlatPaperPixel(sr, sg, sb, sa) || sa < 16)) {
          out[i] = compressionBase.r;
          out[i + 1] = compressionBase.g;
          out[i + 2] = compressionBase.b;
          out[i + 3] = 255;
          continue;
        }

        if (templateMode) {
          const maskHit = templateMatteMode
            ? matteMaskHit(x, y, settings.patternScale, settings.whiteMatte)
            : cheatSheetMaskHit(x, y, settings.patternScale);
          if (maskHit) {
            const color = sa < 16
              ? { r: 255, g: 255, b: 255 }
              : templateMatteMode
                ? matteIndexedColor(sr, sg, sb, x, y, settings)
              : sampleIndexedColor(sr, sg, sb, x, y, settings);
            out[i] = color.r;
            out[i + 1] = color.g;
            out[i + 2] = color.b;
            out[i + 3] = 255;
          } else {
            out[i] = 255;
            out[i + 1] = 255;
            out[i + 2] = 255;
            out[i + 3] = templateMatteMode ? 255 : 0;
          }
          continue;
        }

        if (iosAlphaMode) {
          const flatPixel = sa < 16 || isFlatPaperPixel(sr, sg, sb, sa);
          const bucket = flatPixel ? "light" : templateBucket(classifyBucket(sr, sg, sb));
          const paintedPattern = paintMask ? paintPatternAt(paintMask, x, y, dims.width) : "";
          const pattern = flatPixel
            ? paintedPattern || "checker"
            : paintedPattern || settings.bucketPatterns[bucket] || config.bucketPatterns[bucket] || "checker";
          const coverage = flatPixel
            ? paintedPattern
              ? config.patternCoverage[pattern] || 1
              : 0.5
            : paintedPattern
              ? config.patternCoverage[pattern] || 1
              : selectedBucketCoverage(bucket, pattern, settings);
          const maskHit = pattern === "checker" && coverage === 0.5
            ? cheatSheetMaskHit(x, y, settings.patternScale)
            : patternHit(pattern, x, y, settings.patternScale, coverage);
          if (maskHit) {
            const color = flatPixel
              ? { r: 255, g: 255, b: 255 }
              : bucket === "ink" && pattern === "solid"
                ? { r: 0, g: 0, b: 0 }
              : iphonePng8VisibleColor(sr, sg, sb, x, y, settings);
            out[i] = color.r;
            out[i + 1] = color.g;
            out[i + 2] = color.b;
            out[i + 3] = 255;
          } else {
            out[i] = 255;
            out[i + 1] = 255;
            out[i + 2] = 255;
            out[i + 3] = 0;
          }
          continue;
        }

        if (sa < 16) {
          out[i] = 255;
          out[i + 1] = 255;
          out[i + 2] = 255;
          out[i + 3] = matteAlpha;
          continue;
        }

        if (darkAlphaMode) {
          const color = darkAlphaColor(sr, sg, sb);
          const solid = isTimelineSolidPixel(sr, sg, sb, sa, settings);
          if (!solid) {
            out[i] = color.r;
            out[i + 1] = color.g;
            out[i + 2] = color.b;
            out[i + 3] = 0;
            continue;
          }
          out[i] = 0;
          out[i + 1] = 0;
          out[i + 2] = 0;
          out[i + 3] = 255;
          continue;
        }

        if (carrierMode) {
          const target = compressedTargetColor(sr, sg, sb);
          const color = orderedPaletteColor(target.r, target.g, target.b, x, y, settings.patternScale);
          out[i] = color.r;
          out[i + 1] = color.g;
          out[i + 2] = color.b;
          out[i + 3] = matteAlpha;
          continue;
        }

        if (compressionMode) {
          const coverage = microdotCoverage(compressionCoverage(sr, sg, sb));
          const hit = patternHit("microdots", x, y, settings.patternScale, coverage);
          const target = balancedRevealColor(sr, sg, sb, coverage, compressionBase, settings);
          const partner = balancedPartnerColor(target, coverage, compressionBase);
          const color = hit ? target : partner;
          out[i] = color.r;
          out[i + 1] = color.g;
          out[i + 2] = color.b;
          out[i + 3] = 255;
          continue;
        }

        const bucket = classifyBucket(sr, sg, sb);
        const paintedPattern = paintMask ? paintPatternAt(paintMask, x, y, dims.width) : "";
        const pattern = paintedPattern || settings.bucketPatterns[bucket] || "checker";
        const coverage = paintedPattern
          ? config.patternCoverage[pattern] || 1
          : settings.bucketCoverage[bucket] || config.patternCoverage[pattern] || 0.5;
        const solid = shouldStaySolid(sr, sg, sb, settings);
        const shade = toneAmount(sr, sg, sb);
        const scaledCoverage = bucket === "light" ? coverage * 0.28 : coverage * clamp(shade * 1.18, 0.18, 1);
        const hit = patternHit(pattern, x, y, settings.patternScale, scaledCoverage);
        const color = solid
          ? solidInkColor(sr, sg, sb, settings)
          : paletteToneColor(bucket, sr, sg, sb, settings);

        if (solid || hit) {
          out[i] = color.r;
          out[i + 1] = color.g;
          out[i + 2] = color.b;
          out[i + 3] = 255;
        } else {
          out[i] = matte.r;
          out[i + 1] = matte.g;
          out[i + 2] = matte.b;
          out[i + 3] = matteAlpha;
        }
      }
    }

    if (carrierMode || compressionMode || templateMode || iosAlphaMode || darkAlphaMode) {
      applyVisiblePrompt(output, dims.width, dims.height);
    }

    if (previewOutput) {
      const preview = previewOutput.data;
      if (iosAlphaMode) {
        const base = config.iphoneTimelineBase;
        for (let i = 0; i < out.length; i += 4) {
          preview[i] = base.r;
          preview[i + 1] = base.g;
          preview[i + 2] = base.b;
          preview[i + 3] = 255;
        }
      } else if (templateMode) {
        for (let i = 0; i < out.length; i += 4) {
          preview[i] = 255;
          preview[i + 1] = 255;
          preview[i + 2] = 255;
          preview[i + 3] = 0;
        }
      } else {
        for (let i = 0; i < out.length; i += 4) {
          const sr = src[i];
          const sg = src[i + 1];
          const sb = src[i + 2];
          const sa = src[i + 3];
          if (isTimelineSolidPixel(sr, sg, sb, sa, settings)) {
            preview[i] = out[i];
            preview[i + 1] = out[i + 1];
            preview[i + 2] = out[i + 2];
            preview[i + 3] = out[i + 3];
          } else {
            preview[i] = 255;
            preview[i + 1] = 255;
            preview[i + 2] = 255;
            preview[i + 3] = 0;
          }
        }
      }
      applyVisiblePrompt(previewOutput, dims.width, dims.height);
    }

    let openedImageData = null;
    if (iosAlphaMode) {
      openedImageData = new ImageData(dims.width, dims.height);
      const opened = openedImageData.data;
      for (let y = 0; y < dims.height; y += 1) {
        for (let x = 0; x < dims.width; x += 1) {
          const i = (y * dims.width + x) * 4;
          const sr = src[i];
          const sg = src[i + 1];
          const sb = src[i + 2];
          const sa = src[i + 3];
          const flatPixel = sa < 16 || isFlatPaperPixel(sr, sg, sb, sa);
          if (flatPixel) {
            opened[i] = 255;
            opened[i + 1] = 255;
            opened[i + 2] = 255;
            opened[i + 3] = 255;
            continue;
          }
          const bucket = templateBucket(classifyBucket(sr, sg, sb));
          const paintedPattern = paintMask ? paintPatternAt(paintMask, x, y, dims.width) : "";
          const pattern = paintedPattern || settings.bucketPatterns[bucket] || config.bucketPatterns[bucket] || "checker";
          const color = bucket === "ink" && pattern === "solid"
            ? { r: 0, g: 0, b: 0 }
            : iphonePng8VisibleColor(sr, sg, sb, x, y, settings);
          opened[i] = color.r;
          opened[i + 1] = color.g;
          opened[i + 2] = color.b;
          opened[i + 3] = 255;
        }
      }
      applyVisiblePrompt(openedImageData, dims.width, dims.height);
    }

    return {
      imageData: output,
      previewImageData: previewOutput || output,
      openedImageData,
      width: dims.width,
      height: dims.height
    };
  }

  async function simulateIosTimeline(output) {
    const settings = effectiveSettings();
    const darkTimeline = settings.revealMethod === "iosAlpha" || settings.revealMethod === "carrier" || settings.revealMethod === "carrierSoft";
    const bg = darkTimeline ? { r: 0, g: 0, b: 0 } : config.timelinePaper;
    const frameWidth = 680;
    const aspect = output.height / output.width;
    const frameHeight = Math.round(clamp(frameWidth * aspect, config.previewMinHeight, config.previewMaxHeight));
    setCanvasSize(els.timelineCanvas, frameWidth, frameHeight);
    els.timelineFrame.style.aspectRatio = `${frameWidth} / ${frameHeight}`;

    const thumbnail = document.createElement("canvas");
    setCanvasSize(thumbnail, frameWidth, frameHeight);
    const thumbCtx = thumbnail.getContext("2d");
    thumbCtx.imageSmoothingEnabled = true;
    thumbCtx.imageSmoothingQuality = "high";
    thumbCtx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
    thumbCtx.fillRect(0, 0, frameWidth, frameHeight);
    const previewSource = imageDataToCanvas(output.previewImageData || output.imageData, output.width, output.height);
    drawCoverFromCanvas(thumbCtx, previewSource, output.width, output.height, frameWidth, frameHeight);

    const ctx = els.timelineCanvas.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, frameWidth, frameHeight);

    const quality = clamp(0.94 - settings.previewCrush * 0.68, 0.24, 0.94);
    const blob = await canvasToBlob(thumbnail, "image/jpeg", quality);
    if (!blob) {
      ctx.drawImage(thumbnail, 0, 0);
      return;
    }

    const previewImage = await blobToImage(blob);
    ctx.drawImage(previewImage, 0, 0, frameWidth, frameHeight);
  }

  function drawOpenedImageToCanvas(canvas, output, scale) {
    const settings = effectiveSettings();
    const width = Math.max(1, Math.round(output.width * scale));
    const height = Math.max(1, Math.round(output.height * scale));
    setCanvasSize(canvas, width, height);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, width, height);

    if (settings.revealMethod === "darkAlpha") {
      const revealed = new ImageData(new Uint8ClampedArray(output.imageData.data), output.width, output.height);
      for (let i = 3; i < revealed.data.length; i += 4) {
        revealed.data[i] = 255;
      }
      const source = imageDataToCanvas(revealed, output.width, output.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(source, 0, 0, output.width, output.height, 0, 0, width, height);
      return;
    }

    if (settings.revealMethod === "carrier" || settings.revealMethod === "carrierSoft") {
      const revealed = new ImageData(new Uint8ClampedArray(output.imageData.data), output.width, output.height);
      for (let i = 3; i < revealed.data.length; i += 4) {
        revealed.data[i] = 255;
      }
      const source = document.createElement("canvas");
      setCanvasSize(source, output.width, output.height);
      source.getContext("2d").putImageData(revealed, 0, 0);
      ctx.drawImage(source, 0, 0, output.width, output.height, 0, 0, width, height);
      return;
    }

    const openedImageData = settings.revealMethod === "iosAlpha" && output.openedImageData
      ? output.openedImageData
      : output.imageData;
    const source = imageDataToCanvas(openedImageData, output.width, output.height);
    if (!output.openedImageData && (settings.revealMethod === "iosAlpha" || settings.revealMethod === "template" || settings.revealMethod === "templateMatte")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(source, 0, 0, output.width, output.height, 0, 0, width, height);
  }

  function drawPaintOverlay(output = state.lastOutput) {
    if (!els.paintOverlayCanvas) return;
    const width = Math.max(1, els.openedCanvas.width || 1);
    const height = Math.max(1, els.openedCanvas.height || 1);
    setCanvasSize(els.paintOverlayCanvas, width, height);
    const ctx = els.paintOverlayCanvas.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, width, height);

    const mask = output ? matchingPaintMask(output.width, output.height) : null;
    if (!mask) return;

    const overlay = ctx.createImageData(width, height);
    const data = overlay.data;
    const scaleX = output.width / width;
    const scaleY = output.height / height;

    for (let y = 0; y < height; y += 1) {
      const sy = Math.min(output.height - 1, Math.floor(y * scaleY));
      for (let x = 0; x < width; x += 1) {
        const sx = Math.min(output.width - 1, Math.floor(x * scaleX));
        const pattern = paintPatternAt(mask, sx, sy, output.width);
        if (!pattern) continue;
        const color = paintPatternColors[pattern] || paintPatternColors.solid;
        const i = (y * width + x) * 4;
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = pattern === "solid" ? 120 : 88;
      }
    }

    ctx.putImageData(overlay, 0, 0);
  }

  function workspaceFitScale(output) {
    const stagePadding = 36;
    const fitWidth = Math.max(1, els.openedStage.clientWidth - stagePadding);
    const fitHeight = Math.max(1, els.openedStage.clientHeight - stagePadding);
    return Math.min(fitWidth / output.width, fitHeight / output.height, 1);
  }

  function drawExpanded(output) {
    const fitScale = workspaceFitScale(output);
    const scale = fitScale * state.workspaceZoom;
    drawOpenedImageToCanvas(els.openedCanvas, output, scale);
    drawPaintOverlay(output);
  }

  function redrawFullscreenOnly() {
    if (!state.lastOutput) return;
    drawFullscreenImage();
    updateRangeLabels();
  }

  function fullscreenSourceSize() {
    if (state.fullscreenMode === "timeline") {
      return {
        width: Math.max(1, els.timelineCanvas.width),
        height: Math.max(1, els.timelineCanvas.height)
      };
    }

    if (state.lastOutput) {
      return {
        width: state.lastOutput.width,
        height: state.lastOutput.height
      };
    }

    return { width: 1, height: 1 };
  }

  function fullscreenFitScale() {
    const source = fullscreenSourceSize();
    const fitWidth = Math.max(1, els.fullscreenStage.clientWidth - 36);
    const fitHeight = Math.max(1, els.fullscreenStage.clientHeight - 36);
    return Math.min(fitWidth / source.width, fitHeight / source.height);
  }

  function drawFullscreenImage() {
    if (!state.fullscreenMode) return;

    const source = fullscreenSourceSize();
    const scale = clamp(fullscreenFitScale() * state.fullscreenZoom, 0.02, 12);
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));

    if (state.fullscreenMode === "timeline") {
      setCanvasSize(els.fullscreenCanvas, width, height);
      const ctx = els.fullscreenCanvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(els.timelineCanvas, 0, 0, els.timelineCanvas.width, els.timelineCanvas.height, 0, 0, width, height);
    } else if (state.lastOutput) {
      drawOpenedImageToCanvas(els.fullscreenCanvas, state.lastOutput, scale);
    }

    els.fullscreenZoomValue.textContent = `${Math.round(state.fullscreenZoom * 100)}%`;
  }

  function setFullscreenZoom(nextZoom, anchorEvent = null) {
    const stage = els.fullscreenStage;
    const oldScrollWidth = Math.max(stage.scrollWidth, 1);
    const oldScrollHeight = Math.max(stage.scrollHeight, 1);
    const rect = stage.getBoundingClientRect();
    const anchorOffsetX = anchorEvent ? anchorEvent.clientX - rect.left : stage.clientWidth / 2;
    const anchorOffsetY = anchorEvent ? anchorEvent.clientY - rect.top : stage.clientHeight / 2;
    const anchorX = stage.scrollLeft + anchorOffsetX;
    const anchorY = stage.scrollTop + anchorOffsetY;
    const ratioX = anchorX / oldScrollWidth;
    const ratioY = anchorY / oldScrollHeight;

    state.fullscreenZoom = clamp(nextZoom, 0.25, 12);
    redrawFullscreenOnly();

    window.requestAnimationFrame(() => {
      stage.scrollLeft = Math.max(0, stage.scrollWidth * ratioX - anchorOffsetX);
      stage.scrollTop = Math.max(0, stage.scrollHeight * ratioY - anchorOffsetY);
    });
  }

  function openFullscreen(mode) {
    if (!state.lastOutput) return;

    state.fullscreenMode = mode;
    state.fullscreenZoom = 1;
    els.fullscreenTitle.textContent = mode === "timeline" ? "Compressed preview" : "Fullview reveal";
    els.fullscreenViewer.hidden = false;
    els.fullscreenViewer.dataset.mode = mode;
    document.body.classList.add("is-fullscreen-viewing");
    drawFullscreenImage();
  }

  function closeFullscreen() {
    state.fullscreenMode = "";
    state.fullscreenZoom = 1;
    els.fullscreenViewer.hidden = true;
    document.body.classList.remove("is-fullscreen-viewing");
    els.fullscreenViewer.dataset.mode = "";
  }

  function syntheticTestMode() {
    return new URL(window.location.href).searchParams.get("test") || "";
  }

  function isSyntheticBlackTest() {
    return syntheticTestMode() === "black";
  }

  function isSyntheticSkinTest() {
    return syntheticTestMode() === "skin";
  }

  function luminanceStats(data, width, x0, y0, x1, y1, step = 1) {
    let total = 0;
    let total2 = 0;
    let count = 0;
    for (let y = y0; y < y1; y += step) {
      for (let x = x0; x < x1; x += step) {
        const i = (y * width + x) * 4;
        const l = luminance(data[i], data[i + 1], data[i + 2]) * 255;
        total += l;
        total2 += l * l;
        count += 1;
      }
    }
    const mean = count ? total / count : 0;
    return {
      mean,
      std: count ? Math.sqrt(Math.max(0, total2 / count - mean * mean)) : 0
    };
  }

  function reportBlackTestMetrics(output) {
    if (!isSyntheticBlackTest()) return null;
    const full = output.imageData.data;
    const x0 = Math.round(output.width * 0.24);
    const x1 = Math.round(output.width * 0.76);
    const y0 = Math.round(output.height * 0.3);
    const y1 = Math.round(output.height * 0.72);
    const fullInside = luminanceStats(full, output.width, x0, y0, x1, y1, 3);

    const preview = els.timelineCanvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, els.timelineCanvas.width, els.timelineCanvas.height);
    const px0 = Math.round(preview.width * 0.28);
    const px1 = Math.round(preview.width * 0.72);
    const py0 = Math.round(preview.height * 0.28);
    const py1 = Math.round(preview.height * 0.74);
    const previewInside = luminanceStats(preview.data, preview.width, px0, py0, px1, py1, 1);
    const previewOutside = luminanceStats(preview.data, preview.width, 18, preview.height - 88, 148, preview.height - 18, 1);
    const delta = Math.abs(previewInside.mean - previewOutside.mean);
    const metric = {
      fullInsideStd: Number(fullInside.std.toFixed(2)),
      previewMeanDelta: Number(delta.toFixed(2)),
      previewInsideMean: Number(previewInside.mean.toFixed(2)),
      previewOutsideMean: Number(previewOutside.mean.toFixed(2))
    };
    state.lastBlackMetric = metric;
    console.info("TapMe black test", metric);
    return metric;
  }

  function drawIdle() {
    setCanvasSize(els.timelineCanvas, 680, 380);
    setCanvasSize(els.openedCanvas, 680, 380);
    setCanvasSize(els.outputCanvas, 680, 380);
    [els.timelineCanvas, els.openedCanvas, els.outputCanvas].forEach((canvas) => {
      canvas.style.width = "";
      canvas.style.height = "";
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = canvas === els.openedCanvas ? "#000000" : "#9a9c9a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = canvas === els.openedCanvas ? "#ffffff" : "#050505";
      ctx.font = "900 52px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Drop image", canvas.width / 2, canvas.height / 2);
    });
    drawPaintOverlay();
    els.timelineFrame.style.aspectRatio = "680 / 380";
  }

  function render() {
    if (!state.image) {
      drawIdle();
      els.outputSize.textContent = "Waiting";
      setStatus("Ready");
      return;
    }

    const serial = state.renderSerial + 1;
    state.renderSerial = serial;
    setStatus("Rendering");
    window.setTimeout(async () => {
      if (serial !== state.renderSerial) return;
      const output = buildTapImage(state.image);
      const activeMethod = effectiveSettings().revealMethod;
      const compressionMode = activeMethod === "compression";
      state.lastOutput = output;
      setCanvasSize(els.outputCanvas, output.width, output.height);
      els.outputCanvas.getContext("2d").putImageData(output.imageData, 0, 0);
      await simulateIosTimeline(output);
      if (serial !== state.renderSerial) return;
      drawExpanded(output);
      if (state.fullscreenMode) {
        drawFullscreenImage();
      }
      const blackMetric = reportBlackTestMetrics(output);
      els.outputSize.textContent = `${output.width} x ${output.height} - measuring`;
      els.renderBadge.textContent = `${methodLabel()} codec preview ${els.timelineCanvas.width} x ${els.timelineCanvas.height}`;
      if (blackMetric) {
        els.renderBadge.textContent += ` | black test full std ${blackMetric.fullInsideStd} preview delta ${blackMetric.previewMeanDelta}`;
      }
      els.downloadButton.disabled = true;
      els.statusText.textContent = activeMethod === "darkAlpha"
        ? "Encoding alpha-0 carrier"
        : activeMethod === "iosAlpha"
          ? "Encoding iPhone PNG-8 checker"
        : activeMethod === "carrierSoft"
          ? "Encoding soft alpha carrier"
        : compressionMode
          ? "Encoding experimental RGB PNG"
          : activeMethod === "template"
            ? "Encoding web alpha PNG-8"
          : activeMethod === "templateMatte"
            ? "Encoding iPhone-safe PNG-8"
          : "Encoding indexed PNG";
      outputPngBlob(output).then((blob) => {
        if (serial !== state.renderSerial) return;
        if (!blob) return;
        state.lastOutputBlob = blob;
        const tooLarge = blob.size > xUploadSoftLimit;
        const tooWide = Math.max(output.width, output.height) > 4096;
        const format = compressionMode
          ? "experimental RGB PNG"
          : activeMethod === "iosAlpha"
            ? "iPhone PNG-8 checker"
          : activeMethod === "carrierSoft"
            ? "soft alpha carrier PNG"
          : activeMethod === "darkAlpha"
            ? "alpha-0 carrier PNG"
          : activeMethod === "template"
            ? "web alpha PNG-8"
          : activeMethod === "templateMatte"
            ? "iPhone-safe PNG-8"
            : "indexed PNG";
        els.outputSize.textContent = `${output.width} x ${output.height} - ${format} ${formatBytes(blob.size)}${tooLarge ? " over 5 MB" : ""}${tooWide ? " - over 4096px" : ""}`;
        els.downloadButton.disabled = false;
        els.statusText.textContent = tooLarge || tooWide ? "Try smaller output for X" : `${format} ready`;
        if (state.lastBlackMetric) {
          els.statusText.textContent += ` - test preview delta ${state.lastBlackMetric.previewMeanDelta}`;
        }
      }).catch(() => {
        if (serial !== state.renderSerial) return;
        els.outputSize.textContent = `${output.width} x ${output.height} - encoder unavailable`;
        els.statusText.textContent = "Cannot encode PNG";
      });
    }, 30);
  }

  function scheduleRender(keepOutput = false) {
    window.clearTimeout(state.renderTimer);
    state.renderSerial += 1;
    if (!keepOutput) state.lastOutput = null;
    state.lastOutputBlob = null;
    els.downloadButton.disabled = true;
    state.renderTimer = window.setTimeout(render, 80);
  }

  function settingChanged() {
    syncControlState();
    updateSourceMeta();
    if (state.image) {
      scheduleRender();
    }
  }

  function setWorkspaceZoom(nextZoom, anchorEvent = null) {
    const stage = els.openedStage;
    const oldScrollWidth = Math.max(stage.scrollWidth, 1);
    const oldScrollHeight = Math.max(stage.scrollHeight, 1);
    const rect = stage.getBoundingClientRect();
    const anchorOffsetX = anchorEvent ? anchorEvent.clientX - rect.left : stage.clientWidth / 2;
    const anchorOffsetY = anchorEvent ? anchorEvent.clientY - rect.top : stage.clientHeight / 2;
    const ratioX = (stage.scrollLeft + anchorOffsetX) / oldScrollWidth;
    const ratioY = (stage.scrollTop + anchorOffsetY) / oldScrollHeight;

    state.workspaceZoom = clamp(nextZoom, 0.25, 4);
    if (state.lastOutput) {
      drawExpanded(state.lastOutput);
      window.requestAnimationFrame(() => {
        stage.scrollLeft = Math.max(0, stage.scrollWidth * ratioX - anchorOffsetX);
        stage.scrollTop = Math.max(0, stage.scrollHeight * ratioY - anchorOffsetY);
      });
    }
    syncControlState();
  }

  function paintPointFromEvent(event) {
    if (!state.lastOutput || !els.paintOverlayCanvas) return null;
    const rect = els.paintOverlayCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 0.999999);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 0.999999);
    return {
      x: Math.floor(x * state.lastOutput.width),
      y: Math.floor(y * state.lastOutput.height)
    };
  }

  function paintAtEvent(event) {
    if (!state.settings.paintMode || !state.lastOutput) return;
    const point = paintPointFromEvent(event);
    if (!point) return;

    const output = state.lastOutput;
    const mask = ensurePaintMask(output.width, output.height);
    const value = brushMaskValue();
    const radius = Math.max(1, Math.round(state.settings.brushSize));
    const radius2 = radius * radius;
    const minX = Math.max(0, point.x - radius);
    const maxX = Math.min(output.width - 1, point.x + radius);
    const minY = Math.max(0, point.y - radius);
    const maxY = Math.min(output.height - 1, point.y + radius);

    for (let y = minY; y <= maxY; y += 1) {
      const dy = y - point.y;
      for (let x = minX; x <= maxX; x += 1) {
        const dx = x - point.x;
        if (dx * dx + dy * dy <= radius2) {
          mask[y * output.width + x] = value;
        }
      }
    }

    drawPaintOverlay(output);
  }

  function finishPainting() {
    if (!state.isPainting) return;
    state.isPainting = false;
    if (state.image) scheduleRender(true);
  }

  function setupPaintTools() {
    els.paintOverlayCanvas.addEventListener("pointerdown", (event) => {
      if (!state.settings.paintMode || !state.lastOutput) return;
      event.preventDefault();
      event.stopPropagation();
      state.isPainting = true;
      els.paintOverlayCanvas.setPointerCapture(event.pointerId);
      paintAtEvent(event);
    });

    els.paintOverlayCanvas.addEventListener("pointermove", (event) => {
      if (!state.isPainting) return;
      event.preventDefault();
      event.stopPropagation();
      paintAtEvent(event);
    });

    els.paintOverlayCanvas.addEventListener("pointerup", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (els.paintOverlayCanvas.hasPointerCapture(event.pointerId)) {
        els.paintOverlayCanvas.releasePointerCapture(event.pointerId);
      }
      finishPainting();
    });

    els.paintOverlayCanvas.addEventListener("pointercancel", finishPainting);
    els.paintOverlayCanvas.addEventListener("lostpointercapture", finishPainting);
  }

  function setupControls() {
    const appShell = document.querySelector(".app-shell");
    if (appShell && els.advancedPanel.parentElement !== appShell) {
      appShell.appendChild(els.advancedPanel);
    }

    renderPatternControls();
    setupPaintTools();
    syncControlState();

    els.advancedToggle.addEventListener("change", () => {
      state.settings.advanced = els.advancedToggle.checked;
      state.advancedOpen = els.advancedToggle.checked;
      settingChanged();
    });

    els.advancedOpenButton.addEventListener("click", () => {
      state.settings.advanced = true;
      state.advancedOpen = true;
      settingChanged();
    });

    els.advancedMinimize.addEventListener("click", () => {
      state.advancedOpen = false;
      syncControlState();
    });

    els.backgroundToggle.addEventListener("change", () => {
      state.settings.backgroundEnabled = els.backgroundToggle.checked;
      settingChanged();
    });

    els.revealMethod.addEventListener("change", () => {
      state.settings.revealMethod = els.revealMethod.value;
      settingChanged();
    });

    els.backgroundOpacity.addEventListener("input", () => {
      state.settings.backgroundOpacity = clamp(Number(els.backgroundOpacity.value) / 100, 0, 1);
      settingChanged();
    });

    els.whiteMatte.addEventListener("input", () => {
      state.settings.whiteMatte = clamp(Number(els.whiteMatte.value) / 100, 0, 1);
      settingChanged();
    });

    els.matteColorStrength.addEventListener("input", () => {
      state.settings.matteColorStrength = clamp(Number(els.matteColorStrength.value) / 100, 0, 2);
      settingChanged();
    });

    els.hiddenColorOpacity.addEventListener("input", () => {
      state.settings.hiddenColorOpacity = clamp(Number(els.hiddenColorOpacity.value) / 100, 0, 1);
      settingChanged();
    });

    els.promptText.addEventListener("input", () => {
      state.settings.promptText = els.promptText.value.slice(0, 42);
      settingChanged();
    });

    els.promptSymbols.addEventListener("input", () => {
      state.settings.promptSymbols = els.promptSymbols.value.slice(0, 24);
      settingChanged();
    });

    els.promptFont.addEventListener("change", () => {
      state.settings.promptFont = promptFonts[els.promptFont.value] ? els.promptFont.value : defaultSettings.promptFont;
      settingChanged();
    });

    els.promptStyle.addEventListener("change", () => {
      state.settings.promptStyle = promptStyles.has(els.promptStyle.value) ? els.promptStyle.value : defaultSettings.promptStyle;
      settingChanged();
    });

    els.promptArrow.addEventListener("change", () => {
      state.settings.promptArrow = els.promptArrow.checked;
      settingChanged();
    });

    els.promptArrowStyle.addEventListener("change", () => {
      state.settings.promptArrowStyle = promptArrowStyles.has(els.promptArrowStyle.value) ? els.promptArrowStyle.value : defaultSettings.promptArrowStyle;
      settingChanged();
    });

    els.promptX.addEventListener("input", () => {
      state.settings.promptX = clamp(Number(els.promptX.value) / 100, 0.02, 0.98);
      settingChanged();
    });

    els.promptY.addEventListener("input", () => {
      state.settings.promptY = clamp(Number(els.promptY.value) / 100, 0.02, 0.98);
      settingChanged();
    });

    els.promptScale.addEventListener("input", () => {
      state.settings.promptScale = clamp(Number(els.promptScale.value) / 100, 0.35, 2.2);
      settingChanged();
    });

    els.promptRotation.addEventListener("input", () => {
      state.settings.promptRotation = clamp(Number(els.promptRotation.value), -45, 45);
      settingChanged();
    });

    els.outputSide.addEventListener("change", () => {
      state.settings.outputSide = Number(els.outputSide.value);
      settingChanged();
    });

    els.inputBrightness.addEventListener("input", () => {
      state.settings.inputBrightness = clamp(Number(els.inputBrightness.value) / 100, -0.6, 0.6);
      settingChanged();
    });

    els.inputContrast.addEventListener("input", () => {
      state.settings.inputContrast = clamp(Number(els.inputContrast.value) / 100, -0.6, 0.8);
      settingChanged();
    });

    els.inputSaturation.addEventListener("input", () => {
      state.settings.inputSaturation = clamp(Number(els.inputSaturation.value) / 100, 0, 1.8);
      settingChanged();
    });

    els.inputExposure.addEventListener("input", () => {
      state.settings.inputExposure = clamp(Number(els.inputExposure.value) / 100, -1, 1);
      settingChanged();
    });

    els.inputGamma.addEventListener("input", () => {
      state.settings.inputGamma = clamp(Number(els.inputGamma.value) / 100, 0.5, 2);
      settingChanged();
    });

    els.inputHue.addEventListener("input", () => {
      state.settings.inputHue = clamp(Number(els.inputHue.value), -180, 180);
      settingChanged();
    });

    els.inputWarmth.addEventListener("input", () => {
      state.settings.inputWarmth = clamp(Number(els.inputWarmth.value) / 100, -1, 1);
      settingChanged();
    });

    els.inputVibrance.addEventListener("input", () => {
      state.settings.inputVibrance = clamp(Number(els.inputVibrance.value) / 100, -1, 1);
      settingChanged();
    });

    els.colorLevels.addEventListener("change", () => {
      state.settings.colorLevels = Number(els.colorLevels.value);
      settingChanged();
    });

    els.paintMode.addEventListener("change", () => {
      state.settings.paintMode = els.paintMode.checked;
      syncControlState();
    });

    els.brushPattern.addEventListener("change", () => {
      state.settings.brushPattern = els.brushPattern.value;
      syncControlState();
    });

    els.brushSize.addEventListener("input", () => {
      state.settings.brushSize = clamp(Number(els.brushSize.value), 8, 220);
      syncControlState();
    });

    els.clearPaint.addEventListener("click", () => clearPaintMask(true));

    els.inkThreshold.addEventListener("input", () => {
      state.settings.inkThreshold = clamp(Number(els.inkThreshold.value) / 100, 0.05, 0.45);
      settingChanged();
    });

    els.patternScale.addEventListener("input", () => {
      state.settings.patternScale = clamp(Number(els.patternScale.value), 1, 3);
      settingChanged();
    });

    els.randomizePatterns.addEventListener("click", () => {
      state.settings.advanced = true;
      state.advancedOpen = true;
      randomizePatterns();
    });

    els.resetPatterns.addEventListener("click", () => {
      state.settings.advanced = true;
      resetPatterns();
    });

    els.previewCrush.addEventListener("input", () => {
      state.settings.previewCrush = clamp(Number(els.previewCrush.value) / 100, 0, 1);
      settingChanged();
    });

    els.timelineToggle.addEventListener("click", () => {
      state.timelineVisible = !state.timelineVisible;
      syncControlState();
      if (state.lastOutput) drawExpanded(state.lastOutput);
    });

    els.canvasLock.addEventListener("change", () => {
      state.canvasLocked = els.canvasLock.checked;
      syncControlState();
    });

    els.canvasZoom.addEventListener("input", () => {
      setWorkspaceZoom(Number(els.canvasZoom.value) / 100);
    });

    els.canvasZoomOut.addEventListener("click", () => {
      setWorkspaceZoom(state.workspaceZoom / 1.25);
    });

    els.canvasZoomIn.addEventListener("click", () => {
      setWorkspaceZoom(state.workspaceZoom * 1.25);
    });

    els.canvasZoomReset.addEventListener("click", () => {
      setWorkspaceZoom(1);
    });

    els.timelineFrame.addEventListener("click", () => {
      openFullscreen("timeline");
    });

    els.openedStage.addEventListener("click", () => {
      if (state.settings.paintMode || state.canvasLocked) return;
      openFullscreen("opened");
    });

    els.openedStage.addEventListener("wheel", (event) => {
      if (!state.lastOutput || !(event.ctrlKey || event.metaKey || event.altKey)) return;
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      setWorkspaceZoom(state.workspaceZoom * factor, event);
    }, { passive: false });

    els.fullscreenClose.addEventListener("click", closeFullscreen);

    els.fullscreenStage.addEventListener("wheel", (event) => {
      if (!state.lastOutput) return;
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.13 : 1 / 1.13;
      setFullscreenZoom(state.fullscreenZoom * factor, event);
    }, { passive: false });

    window.addEventListener("resize", () => {
      if (state.lastOutput) {
        drawExpanded(state.lastOutput);
      }
      if (state.fullscreenMode) {
        drawFullscreenImage();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.fullscreenMode) {
        closeFullscreen();
      }
    });
  }

  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = function () {
      URL.revokeObjectURL(url);
      clearPaintMask(false);
      state.image = image;
      state.fileName = file.name;
      els.sourceDrop.classList.add("is-loaded");
      updateSourceMeta();
      els.downloadButton.disabled = true;
      setStatus(`${methodLabel()} ready`);
      scheduleRender();
    };
    image.src = url;
  }

  function loadSyntheticBlackTest() {
    const size = 1600;
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";
    ctx.fillRect(size * 0.24, size * 0.3, size * 0.52, size * 0.42);

    const image = new Image();
    image.onload = () => {
      clearPaintMask(false);
      state.image = image;
      state.fileName = "black-test";
      els.sourceDrop.classList.add("is-loaded");
      updateSourceMeta();
      els.downloadButton.disabled = true;
      setStatus(`${methodLabel()} black test`);
      scheduleRender();
    };
    image.src = canvas.toDataURL("image/png");
  }

  function loadSyntheticSkinTest() {
    const size = 1600;
    const canvas = document.createElement("canvas");
    setCanvasSize(canvas, size, size);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#f2c3b6";
    ctx.fillRect(size * 0.25, size * 0.22, size * 0.5, size * 0.46);
    ctx.fillStyle = "#294cbb";
    ctx.fillRect(size * 0.22, size * 0.62, size * 0.56, size * 0.2);
    ctx.fillStyle = "#141414";
    ctx.fillRect(size * 0.3, size * 0.16, size * 0.4, size * 0.12);
    ctx.font = "900 140px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TAP ME", size * 0.5, size * 0.1);

    const image = new Image();
    image.onload = () => {
      clearPaintMask(false);
      state.image = image;
      state.fileName = "skin-alpha-test";
      els.sourceDrop.classList.add("is-loaded");
      updateSourceMeta();
      els.downloadButton.disabled = true;
      setStatus(`${methodLabel()} skin test`);
      scheduleRender();
    };
    image.src = canvas.toDataURL("image/png");
  }

  function reset() {
    clearPaintMask(false);
    state.image = null;
    state.fileName = "";
    state.lastOutput = null;
    state.lastOutputBlob = null;
    state.workspaceZoom = 1;
    state.canvasLocked = true;
    state.timelineVisible = true;
    els.sourceInput.value = "";
    els.sourceDrop.classList.remove("is-loaded");
    els.sourceMeta.textContent = "2048px iPhone PNG-8 checker default. No settings needed.";
    els.downloadButton.disabled = true;
    drawIdle();
    els.outputSize.textContent = "Waiting";
    setStatus("Ready");
    syncControlState();
  }

  async function downloadOutput() {
    if (!state.image) return;
    const saveBlob = function (blob) {
      if (!blob) return;
      if (state.lastBlobUrl) URL.revokeObjectURL(state.lastBlobUrl);
      state.lastBlobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = state.lastBlobUrl;
      link.download = `tap-me-${safeName(state.fileName)}-${timestampName()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus("Downloaded");
    };

    if (state.lastOutputBlob) {
      saveBlob(state.lastOutputBlob);
      return;
    }

    if (!state.lastOutput) return;
    setStatus(effectiveSettings().revealMethod === "darkAlpha"
      ? "Encoding alpha-0 carrier"
      : effectiveSettings().revealMethod === "iosAlpha"
        ? "Encoding iPhone PNG-8 checker"
      : effectiveSettings().revealMethod === "carrierSoft"
        ? "Encoding soft alpha carrier"
      : effectiveSettings().revealMethod === "template"
        ? "Encoding web alpha PNG-8"
      : effectiveSettings().revealMethod === "templateMatte"
        ? "Encoding iPhone-safe PNG-8"
        : "Encoding experimental RGB PNG");
    try {
      state.lastOutputBlob = await outputPngBlob(state.lastOutput);
      saveBlob(state.lastOutputBlob);
    } catch (error) {
      setStatus("Cannot encode PNG");
    }
  }

  function setupDrop() {
    els.sourceDrop.addEventListener("dragover", function (event) {
      event.preventDefault();
      els.sourceDrop.classList.add("is-loaded");
    });
    els.sourceDrop.addEventListener("dragleave", function () {
      if (!state.image) els.sourceDrop.classList.remove("is-loaded");
    });
    els.sourceDrop.addEventListener("drop", function (event) {
      event.preventDefault();
      loadFile(event.dataTransfer.files[0]);
    });
  }

  els.sourceInput.addEventListener("change", (event) => loadFile(event.target.files[0]));
  els.resetButton.addEventListener("click", reset);
  els.downloadButton.addEventListener("click", downloadOutput);
  setupControls();
  setupDrop();
  drawIdle();
  if (isSyntheticSkinTest()) {
    loadSyntheticSkinTest();
  } else if (isSyntheticBlackTest()) {
    loadSyntheticBlackTest();
  }
})();
