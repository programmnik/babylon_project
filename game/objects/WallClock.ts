import * as BABYLON from "@babylonjs/core";
import { createClockDialTexture } from "../textures";

export function buildWallClock(scene: BABYLON.Scene, parent: BABYLON.TransformNode) {
  const frameMat = new BABYLON.StandardMaterial("clockFrame_" + Math.random(), scene);
  frameMat.diffuseColor = BABYLON.Color3.FromHexString("#FF7655");
  frameMat.specularColor = BABYLON.Color3.Black();

  const rim = BABYLON.MeshBuilder.CreateTorus("clockRim", { diameter: 0.34, thickness: 0.03, tessellation: 40 }, scene);
  rim.rotation.z = Math.PI / 2;
  rim.position.y = 0;
  rim.material = frameMat;
  rim.parent = parent;
  rim.isPickable = false;

  const dial = BABYLON.MeshBuilder.CreateCylinder("clockDial", { diameter: 0.31, height: 0.012, tessellation: 40 }, scene);
  dial.rotation.z = Math.PI / 2;
  dial.position.y = 0;
  const dialMat = new BABYLON.StandardMaterial("dialMat_" + Math.random(), scene);
  dialMat.diffuseTexture = createClockDialTexture(scene);
  dialMat.specularColor = BABYLON.Color3.Black();
  dial.material = dialMat;
  dial.parent = parent;
  dial.isPickable = false;
}
