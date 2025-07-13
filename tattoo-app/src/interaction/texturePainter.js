import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { state, setState, subscribe } from "../utils/state.js";

/**
 * Convert pointer coordinates to normalized device coordinates relative to an element.
 * @param {PointerEvent} event pointer event
 * @param {HTMLElement} element element to measure offset from
 * @param {THREE.Vector2} out vector to store normalized coordinates
 * @returns {void}
 */
function getNormalizedPointer(event, element, out) {
  const rect = element.getBoundingClientRect();
  out.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  out.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

/**
 * Initialize texture painting interaction.
 * @param {THREE.Scene} scene Three.js scene
 * @param {THREE.Camera} camera camera for raycasting
 * @param {HTMLElement} dom DOM element for event listening
 * @returns {void}
 */
export function initTexturePainter(scene, camera, dom) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let paintCanvas;
  let paintCtx;
  let canvasTexture;
  let targetMesh;

  const loader = new GLTFLoader();
  loader.load(
    "/assets/model.glb",
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.traverse((child) => {
        if (child.isMesh && !targetMesh) {
          targetMesh = child;
          paintCanvas = document.createElement("canvas");
          paintCanvas.width = 2048;
          paintCanvas.height = 2048;
          paintCtx = paintCanvas.getContext("2d");
          paintCtx.fillStyle = "#ffffff";
          paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
          canvasTexture = new THREE.CanvasTexture(paintCanvas);
          child.material.map = canvasTexture;
          child.material.needsUpdate = true;
        }
      });
    },
    undefined,
    (err) => console.error("Model load error", err),
  );

  dom.addEventListener("pointerdown", (event) => {
    if (!targetMesh) return;
    getNormalizedPointer(event, dom, mouse);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(targetMesh, true);
    if (intersects.length === 0) return;
    const hit = intersects[0];
    if (hit.uv) {
      setState({ anchorUV: hit.uv.clone() });
    }
  });

  subscribe(paintDecal);

  /**
   * Paint the current decal onto the texture.
   * @param {typeof state} s
   * @returns {void}
   */
  function paintDecal(s) {
    if (!paintCtx || !s.anchorUV) return;
    paintCtx.fillStyle = "#ffffff";
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

    const x = s.anchorUV.x * paintCanvas.width;
    const y = (1 - s.anchorUV.y) * paintCanvas.height;
    const w = s.width * paintCanvas.width;
    const h = s.height * paintCanvas.height;

    paintCtx.save();
    paintCtx.translate(x, y);
    paintCtx.rotate(s.rotation);
    if (s.image) {
      paintCtx.globalAlpha = 1;
      paintCtx.drawImage(s.image, -w / 2, -h / 2, w, h);
    } else {
      paintCtx.fillStyle = "#ff0000";
      paintCtx.globalAlpha = 0.8;
      paintCtx.fillRect(-w / 2, -h / 2, w, h);
    }
    paintCtx.restore();

    canvasTexture.needsUpdate = true;
  }
}
