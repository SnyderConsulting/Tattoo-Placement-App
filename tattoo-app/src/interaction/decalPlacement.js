import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { state, subscribe } from "../utils/state.js";

let decalMesh; // current decal
let model;

/**
 * Load the humanoid model and set up interaction events.
 * @param {THREE.Scene} scene Three.js scene
 * @param {THREE.Camera} camera camera for raycasting
 * @param {HTMLElement} dom DOM element for event listening
 * @returns {void}
 */
export function initInteraction(scene, camera, dom) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const loader = new GLTFLoader();
  loader.load(
    "/assets/model.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
    },
    undefined,
    (err) => console.error("Model load error", err),
  );

  dom.addEventListener("pointerdown", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (!model) return;
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length === 0) return;

    const hit = intersects[0];
    const up = new THREE.Vector3(0, 0, 1);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      up,
      hit.face.normal,
    );
    const orientation = new THREE.Euler().setFromQuaternion(quaternion);
    const decalSize = new THREE.Vector3(0.1, 0.1, 0.1);
    const decalGeometry = new DecalGeometry(
      hit.object,
      hit.point,
      orientation,
      decalSize,
    );
    const decalMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      depthTest: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      opacity: 0.8,
    });
    if (decalMesh) scene.remove(decalMesh);
    decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
    scene.add(decalMesh);
    applyState(state);
  });

  subscribe(applyState);

  /**
   * Apply state properties to the decal mesh.
   * @param {typeof state} s
   * @returns {void}
   */
  function applyState(s) {
    if (!decalMesh) return;
    decalMesh.scale.x = s.width / 0.1;
    decalMesh.scale.y = s.height / 0.1;
    decalMesh.rotation.z = s.rotation;
  }
}
