import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

// Basic Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0); // Light grey background
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#c'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(0, 1.6, 4);
controls.update();

// Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let model;
let decalMesh;

// Control panel elements
const panel = document.getElementById('control-panel');
const widthSlider = document.getElementById('width');
const heightSlider = document.getElementById('height');
const rotationSlider = document.getElementById('rotation');

function updateFromSliders() {
  if (decalMesh) {
    decalMesh.scale.x = parseFloat(widthSlider.value);
    decalMesh.scale.y = parseFloat(heightSlider.value);
    decalMesh.rotation.z = parseFloat(rotationSlider.value);
  }
}

widthSlider.addEventListener('input', updateFromSliders);
heightSlider.addEventListener('input', updateFromSliders);
rotationSlider.addEventListener('input', updateFromSliders);

// Load Model
const loader = new GLTFLoader();
loader.load(
    '/assets/model.glb', // Path relative to the 'public' folder
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        console.log("Model loaded successfully.");
    },
    undefined,
    (error) => {
        console.error('An error happened loading the model', error);
    }
);

// Event Listeners
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('pointerdown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (!model) return;

    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0) {
        if (decalMesh) {
            scene.remove(decalMesh);
        }
        const hit = intersects[0];
        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, hit.face.normal);
        const orientation = new THREE.Euler().setFromQuaternion(quaternion);
        const decalSize = new THREE.Vector3(0.1, 0.1, 0.1);
        const decalGeometry = new DecalGeometry(hit.object, hit.point, orientation, decalSize);
        const decalMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            transparent: true,
            depthTest: false,
            polygonOffset: true,
            polygonOffsetFactor: -4,
            opacity: 0.8
        });
        decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
        scene.add(decalMesh);
        updateFromSliders();

        if (panel.style.display === 'none') {
            panel.style.display = 'block';
        }
    }
});


// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
