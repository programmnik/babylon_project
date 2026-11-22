import * as BABYLON from "@babylonjs/core";

export function buildGlobe(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const woodMat = new BABYLON.StandardMaterial("globeWood_" + Math.random(), scene);
  woodMat.diffuseColor = new BABYLON.Color3(0.35, 0.22, 0.14);
  woodMat.specularColor = BABYLON.Color3.Black();

  const base = BABYLON.MeshBuilder.CreateCylinder("globeBase", { diameter: 0.12, height: 0.02, tessellation: 32 }, scene);
  base.position.y = 0.01;
  base.material = woodMat;
  base.parent = parent;
  base.isPickable = false;

  const pin = BABYLON.MeshBuilder.CreateCylinder("globePin", { diameter: 0.015, height: 0.06, tessellation: 16 }, scene);
  pin.position.y = 0.04;
  pin.material = woodMat;
  pin.parent = parent;
  pin.isPickable = false;

  // Дуга меридиана
  const arc = BABYLON.MeshBuilder.CreateTorus("globeArc", { diameter: 0.22, thickness: 0.01, tessellation: 36 }, scene);
  arc.rotation.x = Math.PI / 2;
  arc.position.y = 0.16;
  arc.material = woodMat;
  arc.parent = parent;
  arc.isPickable = false;

  // Сфера Земли с процедурными материками
  const sphere = BABYLON.MeshBuilder.CreateSphere("globeSphere", { diameter: 0.19, segments: 24 }, scene);
  sphere.position.y = 0.16;
  sphere.rotation.z = 0.35;

  const tex = new BABYLON.DynamicTexture("earthTex_" + Math.random(), { width: 256, height: 128 }, scene, false);
  const ctx = tex.getContext();
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(70, 50, 24, 0, Math.PI * 2);
  ctx.arc(170, 45, 30, 0, Math.PI * 2);
  ctx.arc(190, 85, 18, 0, Math.PI * 2);
  ctx.fill();
  tex.update();

  const earthMat = new BABYLON.StandardMaterial("earthMat_" + Math.random(), scene);
  earthMat.diffuseTexture = tex;
  earthMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
  sphere.material = earthMat;
  sphere.parent = parent;
  sphere.isPickable = false;
}
