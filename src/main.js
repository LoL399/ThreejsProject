import * as THREE from "three";
import { MovObject } from "./components/cube";

let scene = new THREE.Scene();
let camera;

const speed = 0.1; // Cube movement speed
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let cube;
let light;

function createCamera() {
  const _camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  _camera.position.set(0, 5, 10);
  const distance = 5; // how far to move
  const pivot = new THREE.Vector3(0, 0, 0); // point to orbit around
  const radius = _camera.position.distanceTo(pivot);
  const angle = Math.atan2(_camera.position.z, _camera.position.x);

  // Add 45°
  const newAngle = angle + Math.PI / 4;

  _camera.position.x = Math.cos(newAngle) * radius;
  _camera.position.z = Math.sin(newAngle) * radius;
  _camera.lookAt(pivot);
  _camera.lookAt(0, 0, 0);

  camera = _camera;
}

function createGround() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, "#fdfdfdff"); // orange
  gradient.addColorStop(1, "#656565ff"); // darker orange
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const geometry = new THREE.PlaneGeometry(999, 50);
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function createLight() {
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;
  scene.add(light);
}
const closeDistance = 10; // Define the threshold distance (e.g., 10 units)
const offsetDistance = 5; // How much you want to offset the camera when player is close

function createObject() {
  vehicle = new MovObject();
  const object = new MovObject();
  object.color = 0xffffff;
  scene.add(vehicle.createMesh());
  // const plane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(10, 10),
  //   new THREE.MeshStandardMaterial({ color: 0xdddddd })
  // );
  // plane.rotation.x = -Math.PI / 2;
  // plane.receiveShadow = true;
  // scene.add(plane);
  scene.add(object.createMesh(0.5, 0.5, 0, 0, 0.5, 5));
}

function cameraMoveMoment(target, cameraSpeed) {
  const { x, y, z } = target.position;
  camera.position.x = x;
  camera.position.y =   6;
  const currentOffset = camera.position.z - z;
  if (currentOffset <= 5) {
    // debugger
    camera.position.z += cameraSpeed;
  } else if (currentOffset >= 10) {
    camera.position.z -= cameraSpeed;
  }

  camera.lookAt(x, 0 , 0);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("main").appendChild(renderer.domElement);

createCamera();
createGround();
createLight();
let vehicle;
createObject();

function animate() {
  requestAnimationFrame(animate);
  // moveObject();
  // vehicle.moveObject();
  vehicle.moveObject();
  // camera.lookAt(vehicle.object.position.x, 0, 0); // make the camera look at the object
  cameraMoveMoment(vehicle.object, vehicle.speed);
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
