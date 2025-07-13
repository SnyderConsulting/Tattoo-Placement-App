import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ProjectedMaterial } from "@lume/three-projected-material/dist/ProjectedMaterial.js";
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
 * Initialize shader-based projective decal interaction.
 * @param {THREE.Scene} scene scene to add the model to
 * @param {THREE.Camera} camera camera used for raycasting
 * @param {HTMLElement} dom DOM element to attach events to
 * @returns {void}
 */
export function initProjector(scene, camera, dom) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let model;
  let targetMesh;
  let projector;

  const loader = new GLTFLoader();
  loader.load(
    "/assets/model.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      model.traverse((child) => {
        if (child.isMesh) {
          const baseMap = child.material.map || null;
          const mat = new ProjectedMaterial({
            camera: new THREE.OrthographicCamera(1, 1, 1, 1, 0.01, 10),
            texture: new THREE.Texture(),
            map: baseMap,
            transparent: true,
          });
          child.material = mat;
        }
      });
    },
    undefined,
    (err) => console.error("Model load error", err),
  );

  dom.addEventListener("pointerdown", (event) => {
    if (!model) return;
    getNormalizedPointer(event, dom, mouse);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length === 0) return;
    const hit = intersects[0];
    targetMesh = hit.object;
    setState({
      anchorPosition: hit.point.clone(),
      anchorNormal: hit.face.normal.clone(),
    });
  });

  subscribe(applyState);

  /**
   * Apply state to update the projected decal.
   * @param {typeof state} s
   * @returns {void}
   */
  function applyState(s) {
    if (!s.anchorPosition || !s.anchorNormal || !targetMesh) return;

    if (!projector) {
      projector = new THREE.OrthographicCamera(
        -s.width / 2,
        s.width / 2,
        s.height / 2,
        -s.height / 2,
        0.01,
        10,
      );
    } else {
      projector.left = -s.width / 2;
      projector.right = s.width / 2;
      projector.top = s.height / 2;
      projector.bottom = -s.height / 2;
    }

    projector.position
      .copy(s.anchorPosition)
      .addScaledVector(s.anchorNormal, 0.01);
    projector.up.set(0, 1, 0);
    projector.lookAt(s.anchorPosition);
    projector.rotateZ(s.rotation);
    projector.updateProjectionMatrix();

    const material = targetMesh.material;
    material.camera = projector;
    if (s.image) {
      const texture = new THREE.Texture(s.image);
      texture.needsUpdate = true;
      material.texture = texture;
    }
    material.updateFromCamera();
    material.project(targetMesh);
  }
}
