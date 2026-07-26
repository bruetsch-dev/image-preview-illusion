document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("preEditorInput");
  const dropZone = document.getElementById("preEditorDrop");
  const workspace = document.getElementById("preEditorWorkspace");
  
  const canvas = document.getElementById("peCanvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  
  const brightnessSlider = document.getElementById("peBrightness");
  const brightnessValue = document.getElementById("peBrightnessValue");
  
  const aspectSelect = document.getElementById("peAspectRatio");
  const outWidthInput = document.getElementById("peOutputWidth");
  const outHeightInput = document.getElementById("peOutputHeight");
  
  const resetBtn = document.getElementById("peResetBtn");
  const downloadBtn = document.getElementById("peDownloadBtn");
  
  let sourceImage = null;
  let panX = 0;
  let panY = 0;
  let imgScale = 1;
  let isDragging = false;
  let startX = 0, startY = 0;

  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      dropZone.hidden = true;
      workspace.hidden = false;
      resetView();
      render();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function resetView() {
    if (!sourceImage) return;
    
    // Update canvas size based on inputs
    canvas.width = parseInt(outWidthInput.value) || 1536;
    canvas.height = parseInt(outHeightInput.value) || 2048;
    
    // Calculate scale to cover
    const scaleX = canvas.width / sourceImage.width;
    const scaleY = canvas.height / sourceImage.height;
    imgScale = Math.max(scaleX, scaleY);
    
    // Center it
    panX = (canvas.width - sourceImage.width * imgScale) / 2;
    panY = (canvas.height - sourceImage.height * imgScale) / 2;
    
    brightnessSlider.value = 1.0;
    brightnessValue.textContent = "1.0";
  }

  function render() {
    if (!sourceImage) return;
    
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(
      sourceImage, 
      0, 0, sourceImage.width, sourceImage.height,
      panX, panY, sourceImage.width * imgScale, sourceImage.height * imgScale
    );
    
    // Apply brightness
    const brightness = parseFloat(brightnessSlider.value);
    if (brightness !== 1.0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * brightness);
        data[i+1] = Math.min(255, data[i+1] * brightness);
        data[i+2] = Math.min(255, data[i+2] * brightness);
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }

  // File loading
  input.addEventListener("change", (e) => loadFile(e.target.files[0]));
  dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.style.opacity = "0.7"; });
  dropZone.addEventListener("dragleave", () => { dropZone.style.opacity = "1"; });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.opacity = "1";
    if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
  });

  // UI Controls
  brightnessSlider.addEventListener("input", (e) => {
    brightnessValue.textContent = e.target.value;
    render();
  });
  
  aspectSelect.addEventListener("change", (e) => {
    const ratio = parseFloat(e.target.value);
    if (!isNaN(ratio)) {
      const presets = {
        "0.75": {w: 1536, h: 2048},
        "1": {w: 2432, h: 2432},
        "0.6842": {w: 1664, h: 2432},
        "0.8": {w: 1946, h: 2432},
        "0.5625": {w: 1368, h: 2432},
        "1.7777": {w: 2432, h: 1368},
        "1.5": {w: 2432, h: 1621}
      };
      const preset = presets[e.target.value];
      if (preset) {
        outWidthInput.value = preset.w;
        outHeightInput.value = preset.h;
      } else {
        const w = parseInt(outWidthInput.value) || 1536;
        outHeightInput.value = Math.round(w / ratio);
      }
      resetView();
      render();
    }
  });

  outWidthInput.addEventListener("change", () => {
    if (aspectSelect.value !== "free") {
      const ratio = parseFloat(aspectSelect.value);
      outHeightInput.value = Math.round((parseInt(outWidthInput.value) || 1536) / ratio);
    }
    resetView();
    render();
  });
  
  outHeightInput.addEventListener("change", () => {
    if (aspectSelect.value !== "free") {
      const ratio = parseFloat(aspectSelect.value);
      outWidthInput.value = Math.round((parseInt(outHeightInput.value) || 2048) * ratio);
    }
    resetView();
    render();
  });

  resetBtn.addEventListener("click", () => {
    resetView();
    render();
  });

  downloadBtn.addEventListener("click", () => {
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pre-edited.png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  });

  // Panning
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  });
  window.addEventListener("mouseup", () => { isDragging = false; });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    render();
  });

  // Zooming
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomSpeed = 0.05;
    const delta = e.deltaY > 0 ? -1 : 1;
    
    // Zoom around center
    const oldScale = imgScale;
    imgScale *= (1 + delta * zoomSpeed);
    imgScale = Math.max(0.1, Math.min(10, imgScale));
    
    // Adjust pan to zoom into center
    panX = (canvas.width / 2) - ((canvas.width / 2) - panX) * (imgScale / oldScale);
    panY = (canvas.height / 2) - ((canvas.height / 2) - panY) * (imgScale / oldScale);
    
    render();
  }, { passive: false });
});
