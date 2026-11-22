import * as BABYLON from "@babylonjs/core";

export function buildGoldenKey(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const goldMat = new BABYLON.StandardMaterial("goldMat_" + Math.random(), scene);
  goldMat.diffuseColor = new BABYLON.Color3(0.98, 0.78, 0.2);
  goldMat.specularColor = new BABYLON.Color3(0.35, 0.3, 0.1);

  const ring = BABYLON.MeshBuilder.CreateTorus("keyRing", { diameter: 0.035, thickness: 0.007, tessellation: 28 }, scene);
  ring.position = new BABYLON.Vector3(-0.03, 0.005, 0);
  ring.material = goldMat;
  ring.parent = parent;
  ring.isPickable = false;

  const shaft = BABYLON.MeshBuilder.CreateCylinder("keyShaft", { diameter: 0.007, height: 0.06, tessellation: 16 }, scene);
  shaft.rotation.z = Math.PI / 2;
  shaft.position = new BABYLON.Vector3(0.015, 0.005, 0);
  shaft.material = goldMat;
  shaft.parent = parent;
  shaft.isPickable = false;

  const tooth1 = BABYLON.MeshBuilder.CreateBox("keyTooth1", { width: 0.009, height: 0.006, depth: 0.015 }, scene);
  tooth1.position = new BABYLON.Vector3(0.032, 0.005, 0.008);
  tooth1.material = goldMat;
  tooth1.parent = parent;
  tooth1.isPickable = false;

  const tooth2 = BABYLON.MeshBuilder.CreateBox("keyTooth2", { width: 0.009, height: 0.006, depth: 0.02 }, scene);
  tooth2.position = new BABYLON.Vector3(0.043, 0.005, 0.01);
  tooth2.material = goldMat;
  tooth2.parent = parent;
  tooth2.isPickable = false;
}
