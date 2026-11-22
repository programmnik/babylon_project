import * as BABYLON from "@babylonjs/core";

export function buildPlantPot(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const potMat = new BABYLON.StandardMaterial("potMat_" + Math.random(), scene);
  potMat.diffuseColor = new BABYLON.Color3(0.82, 0.45, 0.32);
  potMat.specularColor = BABYLON.Color3.Black();

  const pot = BABYLON.MeshBuilder.CreateCylinder(
    "flowerPot",
    { diameterTop: 0.13, diameterBottom: 0.09, height: 0.11, tessellation: 32 },
    scene
  );
  pot.position.y = 0.055;
  pot.material = potMat;
  pot.parent = parent;
  pot.isPickable = false;

  const leafMat = new BABYLON.StandardMaterial("leafMat_" + Math.random(), scene);
  leafMat.diffuseColor = new BABYLON.Color3(0.18, 0.62, 0.32);
  leafMat.specularColor = BABYLON.Color3.Black();

  // 5 листьев веером
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const leaf = BABYLON.MeshBuilder.CreateSphere(`leaf_${i}`, { diameterX: 0.045, diameterY: 0.11, diameterZ: 0.015 }, scene);
    leaf.position = new BABYLON.Vector3(Math.cos(angle) * 0.025, 0.14, Math.sin(angle) * 0.025);
    leaf.rotation.z = -Math.cos(angle) * 0.45;
    leaf.rotation.x = Math.sin(angle) * 0.45;
    leaf.material = leafMat;
    leaf.parent = parent;
    leaf.isPickable = false;
  }
}
