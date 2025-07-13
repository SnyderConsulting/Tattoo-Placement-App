import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { state, setState, subscribe } from "../utils/state.js";
import { filterSharpAngles } from "../utils/decalUtils.js";
import { buildBoxDecal } from "../utils/boxDecalBuilder.js";

let decalMesh; // current decal
let anchorHelper; // visualizes hit normal
let model;
let targetMesh; // mesh that received the click

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
    getNormalizedPointer(event, dom, mouse);
    raycaster.setFromCamera(mouse, camera);

    if (!model) return;
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length === 0) return;

    const hit = intersects[0];
    targetMesh = hit.object;

    if (!anchorHelper) {
      anchorHelper = new THREE.ArrowHelper(
        hit.face.normal.clone(),
        hit.point.clone(),
        0.1,
        0x00ff00,
      );
      scene.add(anchorHelper);
    } else {
      anchorHelper.position.copy(hit.point);
      anchorHelper.setDirection(hit.face.normal.clone());
    }

    setState({
      anchorPosition: hit.point.clone(),
      anchorNormal: hit.face.normal.clone(),
    });
  });

  subscribe(applyState);

  /**
   * Apply state properties to the decal mesh.
   * @param {typeof state} s
   * @returns {void}
   */
  function applyState(s) {
    if (!s.anchorPosition || !s.anchorNormal || !targetMesh) return;

    const up = new THREE.Vector3(0, 0, 1);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      up,
      s.anchorNormal.clone(),
    );
    const orientation = new THREE.Euler().setFromQuaternion(quat);
    orientation.z += s.rotation;

    const decalSize = new THREE.Vector3(s.width, s.height, 0.1);
    let geometry = buildBoxDecal(
      targetMesh,
      s.anchorPosition.clone(),
      orientation,
      decalSize,
    );

    const projectorNormal = s.anchorNormal.clone().normalize();
    const MAX_SURFACE_ANGLE = Math.PI / 4; // 45 degrees
    geometry = filterSharpAngles(geometry, projectorNormal, MAX_SURFACE_ANGLE);

    const materialParams = {
      transparent: true,
      depthTest: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: 1,
      opacity: s.image ? 1 : 0.8,
    };
    if (s.image) {
      const texture = new THREE.Texture(s.image);
      texture.needsUpdate = true;
      materialParams.map = texture;
    } else {
      materialParams.color = 0xff0000;
    }
    const material = new THREE.MeshStandardMaterial(materialParams);

    if (decalMesh) scene.remove(decalMesh);
    decalMesh = new THREE.Mesh(geometry, material);
    scene.add(decalMesh);
  }
}
