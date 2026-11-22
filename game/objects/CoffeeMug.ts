import * as BABYLON from "@babylonjs/core";
import { createLatteTexture } from "../textures";

export function buildCoffeeMug(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const mat = new BABYLON.StandardMaterial("mugMat_" + Math.random(), scene);
  mat.diffuseColor = BABYLON.Color3.FromHexString("#FF7655");
  mat.specularColor = new BABYLON.Color3(0.25, 0.25, 0.25);

  const innerMat = new BABYLON.StandardMaterial("mugInner_" + Math.random(), scene);
  innerMat.diffuseColor = new BABYLON.Color3(0.95, 0.92, 0.88);
  innerMat.specularColor = BABYLON.Color3.Black();

  // Внешняя стенка кружки высотой 0.11 м
  const body = BABYLON.MeshBuilder.CreateCylinder(
    "mugBody",
    { diameter: 0.088, height: 0.11, tessellation: 44 },
    scene
  );
  body.position.y = 0.055;
  body.material = mat;
  body.parent = parent;
  body.isPickable = false;

  // Верхний ободок и белая внутренняя чаша на 1 мм выше крышки
  const rim = BABYLON.MeshBuilder.CreateTorus(
    "mugRim",
    { diameter: 0.082, thickness: 0.008, tessellation: 44 },
    scene
  );
  rim.position.y = 0.109;
  rim.material = innerMat;
  rim.parent = parent;
  rim.isPickable = false;

  // Ручка сбоку
  const handle = BABYLON.MeshBuilder.CreateTorus(
    "mugHandle",
    { diameter: 0.062, thickness: 0.012, tessellation: 32 },
    scene
  );
  handle.rotation.x = Math.PI / 2;
  handle.position = new BABYLON.Vector3(0.044, 0.055, 0);
  handle.material = mat;
  handle.parent = parent;
  handle.isPickable = false;

  // Кофе с латте-артом (строго ниже бортика!)
  const coffee = BABYLON.MeshBuilder.CreateDisc("coffeeTop", { radius: 0.038, tessellation: 36 }, scene);
  coffee.rotation.x = Math.PI / 2;
  coffee.position.y = 0.111;
  const coffeeMat = new BABYLON.StandardMaterial("coffeeMat_" + Math.random(), scene);
  coffeeMat.diffuseTexture = createLatteTexture(scene);
  coffeeMat.specularColor = BABYLON.Color3.Black();
  coffee.material = coffeeMat;
  coffee.parent = parent;
  coffee.isPickable = false;
}
