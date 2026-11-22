import * as BABYLON from "@babylonjs/core";

export function buildEnergyCrystal(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const crystalMat = new BABYLON.StandardMaterial("crystalMat_" + Math.random(), scene);
  crystalMat.diffuseColor = BABYLON.Color3.FromHexString("#FF7655");
  crystalMat.emissiveColor = BABYLON.Color3.FromHexString("#FF7655").scale(0.5);

  const crystal = BABYLON.MeshBuilder.CreatePolyhedron("crystal", { type: 1, size: 0.075 }, scene);
  crystal.position.y = 0.14;
  crystal.material = crystalMat;
  crystal.parent = parent;
  crystal.isPickable = false;
}
