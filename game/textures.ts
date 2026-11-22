import * as BABYLON from "@babylonjs/core";

export function createWoodTexture(scene: BABYLON.Scene, baseHex: string): BABYLON.DynamicTexture {
  const tex = new BABYLON.DynamicTexture("woodTex_" + Math.random(), { width: 256, height: 256 }, scene, false);
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.14)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 45; i++) {
    ctx.beginPath();
    const y = (i * 256) / 45;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(85, y + Math.sin(i) * 6, 170, y - Math.cos(i) * 6, 256, y);
    ctx.stroke();
  }
  tex.update();
  return tex;
}

export function createLatteTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
  const tex = new BABYLON.DynamicTexture("latteTex_" + Math.random(), { width: 128, height: 128 }, scene, false);
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "#4b2814";
  ctx.fillRect(0, 0, 128, 128);

  const grad = ctx.createRadialGradient(64, 64, 15, 64, 64, 62);
  grad.addColorStop(0, "#6f3e20");
  grad.addColorStop(0.75, "#8d5530");
  grad.addColorStop(1, "#e6ccb2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  ctx.fillStyle = "#f5ebe0";
  ctx.beginPath();
  ctx.arc(64, 64, 18, 0, Math.PI * 2);
  ctx.fill();
  tex.update();
  return tex;
}

export function createBookCoverTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
  const tex = new BABYLON.DynamicTexture("bookTex_" + Math.random(), { width: 256, height: 256 }, scene, false);
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "#2b4c8c";
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = "#f4c95d";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 216, 216);

  ctx.fillStyle = "#f4c95d";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ENGLISH", 128, 115);
  ctx.font = "20px sans-serif";
  ctx.fillText("STORIES", 128, 150);
  tex.update();
  return tex;
}

export function createClockDialTexture(scene: BABYLON.Scene): BABYLON.DynamicTexture {
  const tex = new BABYLON.DynamicTexture("clockTex_" + Math.random(), { width: 256, height: 256 }, scene, false);
  const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "#faf8f5";
  ctx.fillRect(0, 0, 256, 256);

  ctx.translate(128, 128);
  ctx.fillStyle = "#1f2937";
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 6);
    ctx.fillRect(-3, -108, 6, i % 3 === 0 ? 18 : 10);
    ctx.restore();
  }

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-45, -35);
  ctx.stroke();

  ctx.strokeStyle = "#FF7655";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(15, -78);
  ctx.stroke();

  tex.update();
  return tex;
}
