import { initScene } from "./src/core/scene.js";
import { initControlPanel } from "./src/ui/controlPanel.js";
import { initProjector } from "./src/interaction/projector.js";

const canvas = document.querySelector("#c");
const container = document.getElementById("canvas-container");
const { scene, camera, renderer, controls } = initScene(canvas, container);

initControlPanel();
initProjector(scene, camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
