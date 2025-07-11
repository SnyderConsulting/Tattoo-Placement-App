import { state, setState, subscribe } from "../utils/state.js";

const INCH_TO_M = 0.0254;
const CM_TO_M = 0.01;
const PREVIEW_SCALE = 500; // pixels per meter for preview

/**
 * Initialize control panel elements and subscriptions.
 * @returns {void}
 */
export function initControlPanel() {
  const widthSlider = document.getElementById("width");
  const heightSlider = document.getElementById("height");
  const rotationSlider = document.getElementById("rotation");
  const widthIn = document.getElementById("width-inch");
  const widthCm = document.getElementById("width-cm");
  const heightIn = document.getElementById("height-inch");
  const heightCm = document.getElementById("height-cm");
  const preview = document.getElementById("preview");
  const imageInput = document.getElementById("image-upload");

  const ctx = preview.getContext("2d");

  function updatePreview(s) {
    ctx.clearRect(0, 0, preview.width, preview.height);

    // draw subtle grid background
    ctx.save();
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    const spacing = 0.01 * PREVIEW_SCALE; // 1 cm grid
    for (let x = spacing; x < preview.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, preview.height);
      ctx.stroke();
    }
    for (let y = spacing; y < preview.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(preview.width, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(preview.width / 2, preview.height / 2);
    ctx.rotate(s.rotation);
    const w = s.width * PREVIEW_SCALE;
    const h = s.height * PREVIEW_SCALE;
    if (s.image) {
      ctx.globalAlpha = 1;
      ctx.drawImage(s.image, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = "#ff0000";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  function onInput() {
    setState({
      width: parseFloat(widthSlider.value),
      height: parseFloat(heightSlider.value),
      rotation: parseFloat(rotationSlider.value),
    });
  }

  function onUnitInput() {
    const widthM =
      (parseFloat(widthIn.value) || 0) * INCH_TO_M ||
      (parseFloat(widthCm.value) || 0) * CM_TO_M ||
      state.width;
    const heightM =
      (parseFloat(heightIn.value) || 0) * INCH_TO_M ||
      (parseFloat(heightCm.value) || 0) * CM_TO_M ||
      state.height;
    setState({ width: widthM, height: heightM });
  }

  function onImageUpload() {
    const file = imageInput.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setState({ image: img });
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  widthSlider.addEventListener("input", onInput);
  heightSlider.addEventListener("input", onInput);
  rotationSlider.addEventListener("input", onInput);
  widthIn.addEventListener("change", onUnitInput);
  widthCm.addEventListener("change", onUnitInput);
  heightIn.addEventListener("change", onUnitInput);
  heightCm.addEventListener("change", onUnitInput);
  imageInput.addEventListener("change", onImageUpload);

  subscribe((s) => {
    widthSlider.value = s.width.toFixed(2);
    heightSlider.value = s.height.toFixed(2);
    rotationSlider.value = s.rotation.toFixed(2);
    widthIn.value = (s.width / INCH_TO_M).toFixed(2);
    heightIn.value = (s.height / INCH_TO_M).toFixed(2);
    widthCm.value = (s.width / CM_TO_M).toFixed(1);
    heightCm.value = (s.height / CM_TO_M).toFixed(1);
    updatePreview(s);
  });

  // initialize preview
  updatePreview(state);
}
