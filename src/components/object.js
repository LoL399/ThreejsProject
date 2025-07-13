import * as THREE from "three";

export class SceneObject {
  isMoveAble = false;
  id = 0;
  name = "";
  object;
  color = 0x00ff00;

  createMesh(width = 1, height = 1, depth = 1, x = 0, y = 0.5, z = 0) {
    const cubeGeometry = new THREE.BoxGeometry(
      width || 1,
      height || 1,
      depth || 1
    );
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: this.color });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.set(x, y, z);
    this.object = cube;
    return cube;
  }
}
