"use client";

import { useEffect, useRef, useState } from "react";
import { QuestEngine } from "@/game/QuestEngine";
import { QuestItemConfig, QuestLevel } from "@/types/quest";

interface Props {
  level: QuestLevel;
  onSelectItem: (item: QuestItemConfig) => void;
  onFpsUpdate: (fps: number) => void;
}

export function QuestCanvas({ level, onSelectItem, onFpsUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<QuestEngine | null>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);

  // Определяем смартфон или планшет по ширине экрана и наличию тача
  useEffect(() => {
    const checkDevice = () => {
      const isCompact = window.innerWidth <= 1024;
      const hasTouch = navigator.maxTouchPoints > 0;
      setIsMobileOrTablet(isCompact || hasTouch);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 1. Создание движка (строго один экземпляр)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || engineRef.current) return;

    const engine = new QuestEngine(canvas, onSelectItem, onFpsUpdate);
    engineRef.current = engine;

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // 2. Загрузка и переключение уровней
  useEffect(() => {
    if (canvasRef.current && engineRef.current) {
      engineRef.current.loadLevel(level, canvasRef.current);
      engineRef.current.resize();
      engineRef.current.setMoveInput(0, 0);
      setStickPos({ x: 0, y: 0 });
    }
  }, [level]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragOrigin.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return;
    const maxRadius = 36;
    const dx = Math.max(-maxRadius, Math.min(maxRadius, e.clientX - dragOrigin.current.x));
    const dy = Math.max(-maxRadius, Math.min(maxRadius, e.clientY - dragOrigin.current.y));

    setStickPos({ x: dx, y: dy });
    engineRef.current?.setMoveInput(dx / maxRadius, -dy / maxRadius);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragOrigin.current = null;
    setStickPos({ x: 0, y: 0 });
    engineRef.current?.setMoveInput(0, 0);
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block outline-none touch-none" />

      {level.mode === "room_walk" && isMobileOrTablet && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="fixed bottom-8 left-6 z-20 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        >
          <div
            style={{ transform: `translate(${stickPos.x}px, ${stickPos.y}px)` }}
            className="w-10 h-10 rounded-full bg-[#FF7655] shadow-lg pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
