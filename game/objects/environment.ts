import * as BABYLON from "@babylonjs/core";

export function buildTableEnvironment(
  scene: BABYLON.Scene,
  parent: BABYLON.TransformNode,
  colorHex: string
) {
  const mat = new BABYLON.StandardMaterial("tableMat", scene);
  mat.diffuseColor = BABYLON.Color3.FromHexString(colorHex);
  mat.specularColor = BABYLON.Color3.Black();

  const topDisc = BABYLON.MeshBuilder.CreateDisc("tableTop", { radius: 0.75, tessellation: 64 }, scene);
  topDisc.rotation.x = Math.PI / 2;
  topDisc.position.y = 0;
  topDisc.material = mat;
  topDisc.parent = parent;

  const sideRim = BABYLON.MeshBuilder.CreateCylinder(
    "tableRim",
    { diameter: 1.5, height: 0.06, tessellation: 64, cap: BABYLON.Mesh.NO_CAP, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  sideRim.position.y = -0.03;
  sideRim.material = mat;
  sideRim.parent = parent;

  const bottomDisc = BABYLON.MeshBuilder.CreateDisc("tableBottom", { radius: 0.75, tessellation: 64 }, scene);
  bottomDisc.rotation.x = -Math.PI / 2;
  bottomDisc.position.y = -0.06;
  bottomDisc.material = mat;
  bottomDisc.parent = parent;
}

export function buildRoomEnvironment(
  scene: BABYLON.Scene,
  parent: BABYLON.TransformNode,
  floorColorHex: string,
  levelId: number
) {
  // Просторная комната 9x9 метров (стены на координатах ±4.5)
  const floor = BABYLON.MeshBuilder.CreateGround("roomFloor", { width: 9, height: 9 }, scene);
  floor.parent = parent;
  const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
  floorMat.diffuseColor = BABYLON.Color3.FromHexString(floorColorHex);
  floorMat.specularColor = BABYLON.Color3.Black();
  floor.material = floorMat;
  floor.checkCollisions = true;

  // Декоративный ковер в центре комнаты
  const rug = BABYLON.MeshBuilder.CreateGround("roomRug", { width: 3.6, height: 2.8 }, scene);
  rug.position.y = 0.005;
  rug.parent = parent;
  rug.isPickable = false;
  const rugMat = new BABYLON.StandardMaterial("rugMat", scene);
  rugMat.diffuseColor = new BABYLON.Color3(0.32, 0.24, 0.28);
  rugMat.specularColor = BABYLON.Color3.Black();
  rug.material = rugMat;

  // Стены комнаты
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.diffuseColor = new BABYLON.Color3(0.28, 0.31, 0.38);
  wallMat.specularColor = BABYLON.Color3.Black();

  const walls = [
    { x: 0, y: 1.5, z: 4.5, rotY: 0 },
    { x: 0, y: 1.5, z: -4.5, rotY: Math.PI },
    { x: -4.5, y: 1.5, z: 0, rotY: Math.PI / 2 },
    { x: 4.5, y: 1.5, z: 0, rotY: -Math.PI / 2 },
  ];

  walls.forEach((w, i) => {
    const wall = BABYLON.MeshBuilder.CreateBox(`wall_${i}`, { width: 9.2, height: 3.0, depth: 0.2 }, scene);
    wall.position = new BABYLON.Vector3(w.x, w.y, w.z);
    wall.rotation.y = w.rotY;
    wall.material = wallMat;
    wall.checkCollisions = true;
    wall.parent = parent;
  });

  // Декоративное окно на дальней стене
  const windowFrame = BABYLON.MeshBuilder.CreateBox("windowFrame", { width: 2.2, height: 1.4, depth: 0.06 }, scene);
  windowFrame.position = new BABYLON.Vector3(0, 1.75, 4.38);
  windowFrame.parent = parent;
  windowFrame.isPickable = false;
  const winMat = new BABYLON.StandardMaterial("winMat", scene);
  winMat.diffuseColor = new BABYLON.Color3(0.55, 0.72, 0.9);
  winMat.emissiveColor = new BABYLON.Color3(0.18, 0.24, 0.35);
  windowFrame.material = winMat;

  if (levelId === 2) {
    // Письменный стол у окна и журнальный столик сбоку
    createSolidTable(scene, parent, new BABYLON.Vector3(0, 0, 3.0), 1.6, 0.75, 0.75);
    createSolidTable(scene, parent, new BABYLON.Vector3(2.4, 0, 0.5), 0.9, 0.55, 0.9);
  } else if (levelId === 3) {
    // Тумба под кристалл в дальнем правом углу
    createSolidTable(scene, parent, new BABYLON.Vector3(2.6, 0, 2.6), 0.75, 0.8, 0.75);
    // Лабораторный стол слева
    createSolidTable(scene, parent, new BABYLON.Vector3(-2.2, 0, 1.6), 1.4, 0.75, 0.75);
    // Дополнительная тумба ближе к центру
    createSolidTable(scene, parent, new BABYLON.Vector3(0.2, 0, 2.8), 1.0, 0.7, 0.65);
  }
}

// Создает стол + невидимый полноростовой коллайдер, чтобы персонаж не мог залезть на стол
function createSolidTable(
  scene: BABYLON.Scene,
  parent: BABYLON.TransformNode,
  pos: BABYLON.Vector3,
  w: number,
  h: number,
  d: number
) {
  const mat = new BABYLON.StandardMaterial("pedMat_" + Math.random(), scene);
  mat.diffuseColor = new BABYLON.Color3(0.45, 0.32, 0.24);
  mat.specularColor = BABYLON.Color3.Black();

  // Визуальная столешница
  const top = BABYLON.MeshBuilder.CreateBox("tableBoard", { width: w, height: 0.06, depth: d }, scene);
  top.position = new BABYLON.Vector3(pos.x, h - 0.03, pos.z);
  top.material = mat;
  top.parent = parent;
  top.isPickable = false;

  // 4 ножки стола
  const legOffsets = [
    [-w / 2 + 0.06, -d / 2 + 0.06],
    [w / 2 - 0.06, -d / 2 + 0.06],
    [-w / 2 + 0.06, d / 2 - 0.06],
    [w / 2 - 0.06, d / 2 - 0.06],
  ];
  legOffsets.forEach(([lx, lz], idx) => {
    const leg = BABYLON.MeshBuilder.CreateBox(`leg_${idx}`, { width: 0.06, height: h - 0.06, depth: 0.06 }, scene);
    leg.position = new BABYLON.Vector3(pos.x + lx, (h - 0.06) / 2, pos.z + lz);
    leg.material = mat;
    leg.parent = parent;
    leg.isPickable = false;
  });

  // Невидимый барьер высотой 2.6 м — не дает камере забраться на стол!
  const blocker = BABYLON.MeshBuilder.CreateBox("tableBlocker", { width: w + 0.06, height: 2.6, depth: d + 0.06 }, scene);
  blocker.position = new BABYLON.Vector3(pos.x, 1.3, pos.z);
  blocker.visibility = 0;
  blocker.isPickable = false;
  blocker.checkCollisions = true;
  blocker.parent = parent;
}
