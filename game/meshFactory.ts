import * as BABYLON from "@babylonjs/core";
import { QuestItemConfig } from "@/types/quest";
import { buildCoffeeMug } from "./objects/CoffeeMug";
import { buildDeskLamp } from "./objects/DeskLamp";
import { buildGoldenKey } from "./objects/GoldenKey";
import { buildMagicBook } from "./objects/MagicBook";
import { buildWallClock } from "./objects/WallClock";
import { buildEnergyCrystal } from "./objects/EnergyCrystal";
import { buildGlobe } from "./objects/Globe";
import { buildPlantPot } from "./objects/PlantPot";

export function createDetailedItem(
  scene: BABYLON.Scene,
  config: QuestItemConfig
): BABYLON.Mesh {
  const [px, py, pz] = config.position;

  const hitbox = BABYLON.MeshBuilder.CreateBox(
    `hitbox_${config.id}`,
    { width: 0.36, height: 0.45, depth: 0.36 },
    scene
  );
  hitbox.position = new BABYLON.Vector3(px, py + 0.225, pz);
  hitbox.visibility = 0;
  hitbox.metadata = config;

  const root = new BABYLON.TransformNode(`root_${config.id}`, scene);
  root.parent = hitbox;
  root.position.y = -0.225;

  switch (config.kind) {
    case "coffee_mug":
      buildCoffeeMug(scene, root);
      break;
    case "desk_lamp":
      buildDeskLamp(scene, root);
      break;
    case "golden_key":
      buildGoldenKey(scene, root);
      break;
    case "magic_book":
      buildMagicBook(scene, root);
      break;
    case "wall_clock":
      buildWallClock(scene, root);
      break;
    case "energy_crystal":
      buildEnergyCrystal(scene, root);
      break;
    case "globe":
      buildGlobe(scene, root);
      break;
    case "plant_pot":
      buildPlantPot(scene, root);
      break;
  }

  return hitbox;
}
