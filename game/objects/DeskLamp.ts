import * as BABYLON from "@babylonjs/core";

export function buildDeskLamp(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const metalMat = new BABYLON.StandardMaterial("lampMetal_" + Math.random(), scene);
  metalMat.diffuseColor = new BABYLON.Color3(0.25, 0.28, 0.34);
  metalMat.specularColor = BABYLON.Color3.Black();

  const base = BABYLON.MeshBuilder.CreateCylinder(
    "lampBase",
    { diameterTop: 0.14, diameterBottom: 0.18, height: 0.025, tessellation: 36 },
    scene
  );
  base.position.y = 0.0125;
  base.material = metalMat;
  base.parent = parent;
  base.isPickable = false;

  const stand = BABYLON.MeshBuilder.CreateCylinder(
    "lampStand",
    { diameter: 0.018, height: 0.32, tessellation: 20 },
    scene
  );
  stand.position.y = 0.17;
  stand.material = metalMat;
  stand.parent = parent;
  stand.isPickable = false;

  const shade = BABYLON.MeshBuilder.CreateCylinder(
    "lampShade",
    { diameterTop: 0.09, diameterBottom: 0.22, height: 0.15, tessellation: 36 },
    scene
  );
  shade.position = new BABYLON.Vector3(0.04, 0.34, 0);
  shade.rotation.z = -0.3;
  const shadeMat = new BABYLON.StandardMaterial("shadeMat_" + Math.random(), scene);
  shadeMat.diffuseColor = BABYLON.Color3.FromHexString("#FF7655");
  shadeMat.emissiveColor = new BABYLON.Color3(0.25, 0.08, 0.03);
  shade.material = shadeMat;
  shade.parent = parent;
  shade.isPickable = false;
}
