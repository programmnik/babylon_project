import * as BABYLON from "@babylonjs/core";
import { CameraMode, QuestItemConfig, QuestLevel } from "@/types/quest";
import { createDetailedItem } from "./meshFactory";
import { buildRoomEnvironment, buildTableEnvironment } from "./objects/environment";

export class QuestEngine {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private activeCamera: BABYLON.ArcRotateCamera | BABYLON.UniversalCamera | null = null;
  private currentMode: CameraMode = "orbit_top";
  private onSelectCallback: (item: QuestItemConfig) => void;
  private onFpsCallback: (fps: number) => void;

  private moveInput = { x: 0, z: 0 };
  private pressedKeys = new Set<string>();
  private animatedMeshes: BABYLON.Mesh[] = [];
  private levelRoot: BABYLON.TransformNode | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    onSelect: (item: QuestItemConfig) => void,
    onFps: (fps: number) => void
  ) {
    this.onSelectCallback = onSelect;
    this.onFpsCallback = onFps;

    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;

    const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
    hemi.intensity = 1.15;
    hemi.groundColor = new BABYLON.Color3(0.45, 0.45, 0.5);

    const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-0.5, -1, -0.5), this.scene);
    dirLight.position = new BABYLON.Vector3(4, 8, 4);
    dirLight.intensity = 0.55;

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("keyup", this.handleKeyUp);
    }

    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERTAP) {
        const pick = pointerInfo.pickInfo;
        if (!pick?.hit || !pick.pickedMesh) return;

        if (pick.pickedMesh.metadata) {
          this.handleItemTap(pick.pickedMesh as BABYLON.Mesh);
        } else if (
          pick.pickedMesh.name === "roomFloor" &&
          pick.pickedPoint &&
          (this.currentMode === "room_point_click" || this.currentMode === "room_walk")
        ) {
          this.teleportToPoint(pick.pickedPoint);
        }
      }
    });

    let time = 0;
    this.scene.registerBeforeRender(() => {
      time += 0.04;
      this.updateAnimations(time);
      this.updateWorldAxisMovement();
    });

    this.engine.runRenderLoop(() => {
      if (this.scene.activeCamera) {
        this.scene.render();
        this.onFpsCallback(Math.round(this.engine.getFps()));
      }
    });
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.pressedKeys.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKeys.delete(e.code);
  };

  private updateAnimations(time: number) {
    this.animatedMeshes.forEach((m, idx) => {
      if (!m.isDisposed()) {
        m.position.y += Math.sin(time + idx) * 0.0008;
        m.rotation.y += 0.012;
      }
    });
  }

  private updateWorldAxisMovement() {
    if (this.currentMode !== "room_walk" || !(this.activeCamera instanceof BABYLON.UniversalCamera)) {
      return;
    }

    let moveX = this.moveInput.x;
    let moveZ = this.moveInput.z;

    if (this.pressedKeys.has("KeyW") || this.pressedKeys.has("ArrowUp")) moveZ += 1;
    if (this.pressedKeys.has("KeyS") || this.pressedKeys.has("ArrowDown")) moveZ -= 1;
    if (this.pressedKeys.has("KeyD") || this.pressedKeys.has("ArrowRight")) moveX += 1;
    if (this.pressedKeys.has("KeyA") || this.pressedKeys.has("ArrowLeft")) moveX -= 1;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      // Берем направление камеры только в горизонтальной плоскости XZ (игнорируем наклон вверх/вниз)
      const forward = this.activeCamera.getDirection(BABYLON.Axis.Z);
      forward.y = 0;
      if (forward.lengthSquared() > 0.0001) {
        forward.normalize();
      } else {
        // Если камера смотрит строго вертикально вверх или вниз, вычисляем направление по углу Y
        forward.set(Math.sin(this.activeCamera.rotation.y), 0, Math.cos(this.activeCamera.rotation.y));
      }

      // Вектор вправо строим через векторное произведение (Вверх × Вперед), чтобы он всегда был строго перпендикулярен
      const right = BABYLON.Vector3.Cross(BABYLON.Axis.Y, forward).normalize();

      const moveDir = forward.scale(moveZ).add(right.scale(moveX));
      if (moveDir.length() > 1) {
        moveDir.normalize();
      }

      const speed = 0.045;
      this.activeCamera.cameraDirection.addInPlace(moveDir.scale(speed));
    }
  }


  public setMoveInput(x: number, z: number) {
    this.moveInput = { x, z };
  }
  public loadLevel(level: QuestLevel, canvas: HTMLCanvasElement) {
    this.currentMode = level.mode;
    this.animatedMeshes = [];

    if (this.levelRoot) {
      this.levelRoot.dispose(false, true);
    }
    this.levelRoot = new BABYLON.TransformNode("levelRoot", this.scene);

    if (this.activeCamera) {
      this.activeCamera.dispose();
      this.activeCamera = null;
    }

    this.scene.clearColor = BABYLON.Color4.FromHexString(level.ambientColor + "FF");

    if (level.mode === "orbit_top") {
      const cam = new BABYLON.ArcRotateCamera(
        "orbitCam",
        -Math.PI / 2,
        Math.PI / 3.1,
        1.65,
        new BABYLON.Vector3(0, 0.08, 0),
        this.scene
      );
      cam.minZ = 0.05;
      cam.maxZ = 30;
      cam.wheelPrecision = 80;
      cam.pinchPrecision = 80;
      cam.attachControl(canvas, true);
      cam.lowerRadiusLimit = 0.75;
      cam.upperRadiusLimit = 2.8;
      cam.upperBetaLimit = Math.PI / 2.15;
      this.activeCamera = cam;
      this.scene.activeCamera = cam;

      buildTableEnvironment(this.scene, this.levelRoot, level.floorColor);
    } else {
      const cam = new BABYLON.UniversalCamera("fpCam", new BABYLON.Vector3(0, 1.6, -2.1), this.scene);
      cam.minZ = 0.1;
      cam.maxZ = 30;
      cam.setTarget(new BABYLON.Vector3(0, 1.15, 1.0));
      cam.attachControl(canvas, true);
      cam.angularSensibility = 3000;

      // Отключаем встроенное движение по взгляду — ходим только через updateWorldAxisMovement()
      cam.keysUp = [];
      cam.keysDown = [];
      cam.keysLeft = [];
      cam.keysRight = [];

      cam.checkCollisions = true;
      cam.applyGravity = false;
      cam.ellipsoid = new BABYLON.Vector3(0.35, 0.75, 0.35);

      this.activeCamera = cam;
      this.scene.activeCamera = cam;

      buildRoomEnvironment(this.scene, this.levelRoot, level.floorColor, level.id);
    }

    level.items.forEach((itemConfig) => {
      const mesh = createDetailedItem(this.scene, itemConfig);
      mesh.parent = this.levelRoot;
      if (itemConfig.kind === "energy_crystal") {
        this.animatedMeshes.push(mesh);
      }
    });
  }

  private teleportToPoint(point: BABYLON.Vector3) {
    if (!(this.activeCamera instanceof BABYLON.UniversalCamera)) return;

    const marker = BABYLON.MeshBuilder.CreateTorus("tpMarker", { diameter: 0.4, thickness: 0.03 }, this.scene);
    marker.position = new BABYLON.Vector3(point.x, 0.015, point.z);
    const mMat = new BABYLON.StandardMaterial("tpMat", this.scene);
    mMat.emissiveColor = BABYLON.Color3.FromHexString("#FF7655");
    marker.material = mMat;
    setTimeout(() => {
      if (!marker.isDisposed()) marker.dispose();
    }, 550);

    const clampedX = Math.max(-2.3, Math.min(2.3, point.x));
    const clampedZ = Math.max(-2.3, Math.min(2.3, point.z));
    const targetCamPos = new BABYLON.Vector3(clampedX, 1.6, clampedZ);

    BABYLON.Animation.CreateAndStartAnimation(
      "tpMove",
      this.activeCamera,
      "position",
      60,
      18,
      this.activeCamera.position.clone(),
      targetCamPos,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

    private handleItemTap(mesh: BABYLON.Mesh) {
    this.scene.meshes.forEach((m) => {
      if (
        m.material instanceof BABYLON.StandardMaterial &&
        m.name !== "crystal" &&
        m.name !== "lampShade"
      ) {
        m.material.emissiveColor = BABYLON.Color3.Black();
      }
    });

    // Вычисляем реальный размер объекта по его дочерним мешам
    let maxRadius = 0.2;
    mesh.getChildMeshes().forEach((child) => {
      if (child instanceof BABYLON.Mesh) {
        if (child.material instanceof BABYLON.StandardMaterial) {
          child.material.emissiveColor = BABYLON.Color3.FromHexString("#FF7655").scale(0.35);
        }
        child.computeWorldMatrix(true);
        const bounding = child.getBoundingInfo().boundingSphere;
        if (bounding.radiusWorld > maxRadius) {
          maxRadius = bounding.radiusWorld;
        }
      }
    });

    const config = mesh.metadata as QuestItemConfig;

    if (this.currentMode === "orbit_top" && this.activeCamera instanceof BABYLON.ArcRotateCamera) {
      const targetPos = new BABYLON.Vector3(mesh.position.x, 0.1, mesh.position.z);
      BABYLON.Animation.CreateAndStartAnimation(
        "orbitFocus",
        this.activeCamera,
        "target",
        60,
        20,
        this.activeCamera.target.clone(),
        targetPos,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      // Подбираем комфортный зум в зависимости от размера предмета (не ближе 0.95 м)
      const idealZoom = Math.max(0.95, Math.min(1.65, maxRadius * 5.2));
      BABYLON.Animation.CreateAndStartAnimation(
        "orbitZoom",
        this.activeCamera,
        "radius",
        60,
        20,
        this.activeCamera.radius,
        idealZoom,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    } else if (this.activeCamera instanceof BABYLON.UniversalCamera) {
      const itemPos = mesh.position.clone();
      const dir = this.activeCamera.position.subtract(itemPos);
      dir.y = 0;
      if (dir.lengthSquared() > 0.001) {
        dir.normalize();
      } else {
        dir.set(0, 0, -1);
      }

      // Расчет дистанции: приоритет у approachDistance, иначе формула от размера предмета + запас под стол (0.95 м)
      const computedDistance = config.approachDistance ?? Math.max(1.25, 0.95 + maxRadius * 2.2);

      const standPos = itemPos.add(dir.scale(computedDistance));
      standPos.x = Math.max(-3.8, Math.min(3.8, standPos.x));
      standPos.z = Math.max(-3.8, Math.min(3.8, standPos.z));
      standPos.y = 1.6;

      BABYLON.Animation.CreateAndStartAnimation(
        "roomApproach",
        this.activeCamera,
        "position",
        60,
        22,
        this.activeCamera.position.clone(),
        standPos,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      const lookTarget = new BABYLON.Vector3(itemPos.x, Math.max(0.75, itemPos.y), itemPos.z);
      const dummyCam = this.activeCamera.clone("dummy") as BABYLON.UniversalCamera;
      dummyCam.position = standPos;
      dummyCam.setTarget(lookTarget);
      const targetRot = dummyCam.rotation.clone();
      dummyCam.dispose();

      BABYLON.Animation.CreateAndStartAnimation(
        "roomLook",
        this.activeCamera,
        "rotation",
        60,
        22,
        this.activeCamera.rotation.clone(),
        targetRot,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    }

    this.onSelectCallback(config);
  }


  public resize() {
    this.engine.resize();
  }

  public dispose() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    }
    this.engine.dispose();
  }
}
