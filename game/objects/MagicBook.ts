import * as BABYLON from "@babylonjs/core";
import { createBookCoverTexture } from "../textures";

export function buildMagicBook(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const coverMat = new BABYLON.StandardMaterial("coverMat_" + Math.random(), scene);
  coverMat.diffuseTexture = createBookCoverTexture(scene);
  coverMat.specularColor = BABYLON.Color3.Black();

  const spineMat = new BABYLON.StandardMaterial("spineMat_" + Math.random(), scene);
  spineMat.diffuseColor = BABYLON.Color3.FromHexString("#2b4c8c");
  spineMat.specularColor = BABYLON.Color3.Black();

  const bottomCover = BABYLON.MeshBuilder.CreateBox("bookBottom", { width: 0.16, height: 0.005, depth: 0.22 }, scene);
  bottomCover.position.y = 0.0025;
  bottomCover.material = spineMat;
  bottomCover.parent = parent;
  bottomCover.isPickable = false;

  const topCover = BABYLON.MeshBuilder.CreateBox("bookTop", { width: 0.16, height: 0.005, depth: 0.22 }, scene);
  topCover.position.y = 0.028;
  topCover.material = coverMat;
  topCover.parent = parent;
  topCover.isPickable = false;

  const spine = BABYLON.MeshBuilder.CreateBox("bookSpine", { width: 0.008, height: 0.031, depth: 0.22 }, scene);
  spine.position = new BABYLON.Vector3(-0.076, 0.0155, 0);
  spine.material = spineMat;
  spine.parent = parent;
  spine.isPickable = false;

  const pages = BABYLON.MeshBuilder.CreateBox("bookPages", { width: 0.148, height: 0.021, depth: 0.206 }, scene);
  pages.position = new BABYLON.Vector3(0.002, 0.0155, 0);
  const pageMat = new BABYLON.StandardMaterial("pageMat_" + Math.random(), scene);
  pageMat.diffuseColor = new BABYLON.Color3(0.96, 0.93, 0.86);
  pageMat.specularColor = BABYLON.Color3.Black();
  pages.material = pageMat;
  pages.parent = parent;
  pages.isPickable = false;
}
