"use client";

import { useState } from "react";
import { QUEST_LEVELS } from "@/data/quests";
import { QuestCanvas } from "@/components/QuestCanvas";
import { QuestItemConfig } from "@/types/quest";

export default function Home() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<QuestItemConfig | null>(null);
  const [status, setStatus] = useState<"idle" | "step_done" | "level_done" | "error">("idle");
  const [showHint, setShowHint] = useState(false);
  const [fps, setFps] = useState(60);

  const currentLevel = QUEST_LEVELS[levelIndex];
  const currentStep = currentLevel.steps[stepIndex];

  const handleLevelChange = (index: number) => {
    setLevelIndex(index);
    setStepIndex(0);
    setSelectedItem(null);
    setStatus("idle");
    setShowHint(false);
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  const handleVerify = () => {
    if (!selectedItem || !currentStep) return;

    if (selectedItem.id === currentStep.targetId) {
      speak(selectedItem.en);
      if (stepIndex + 1 < currentLevel.steps.length) {
        setStatus("step_done");
        setTimeout(() => {
          setStepIndex((prev) => prev + 1);
          setSelectedItem(null);
          setStatus("idle");
          setShowHint(false);
        }, 900);
      } else {
        setStatus("level_done");
      }
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="relative w-screen h-dvh overflow-hidden bg-zinc-950 select-none font-sans">
      <header className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-3 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
            {QUEST_LEVELS.map((lvl, idx) => {
              const active = idx === levelIndex;
              return (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelChange(idx)}
                  style={{ backgroundColor: active ? "#FF7655" : "transparent" }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    active ? "text-white shadow-md" : "text-white/70 hover:text-white"
                  }`}
                >
                  {lvl.subtitle}
                </button>
              );
            })}
          </div>

          <div className="px-2.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs font-mono text-white/80 shrink-0">
            {fps} FPS
          </div>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex justify-between items-center gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7655]">
                {currentLevel.title}
              </span>
              <span className="block text-[11px] text-zinc-400">{currentLevel.modeLabel}</span>
            </div>
            <button
              onClick={() => speak(currentStep.taskEn)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white/80 hover:text-white shrink-0"
            >
              🔊 Listen
            </button>
          </div>

          <p className="text-base font-semibold mt-2 leading-snug">{currentStep.taskEn}</p>
          <p className="text-xs text-zinc-400 mt-1">{currentStep.taskRu}</p>
        </div>
      </header>

      {selectedItem && (
        <section className="absolute bottom-5 left-4 right-4 z-10 max-w-lg mx-auto bg-white text-zinc-900 p-5 rounded-3xl shadow-2xl">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{selectedItem.en}</h2>
              <p className="text-sm text-zinc-500">{selectedItem.ru}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 h-11 rounded-2xl bg-zinc-100 text-zinc-700 text-xs font-bold active:scale-95 transition"
              >
                {showHint ? "Скрыть" : "Подсказка"}
              </button>
              <button
                onClick={() => speak(selectedItem.en)}
                className="w-11 h-11 rounded-2xl bg-[#FF7655]/15 text-[#FF7655] flex items-center justify-center text-lg active:scale-95 transition"
                aria-label="Pronounce"
              >
                🔊
              </button>
            </div>
          </div>

          {showHint && (
            <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200/60">
              💡 Hint: {selectedItem.hint}
            </div>
          )}

          {status === "error" && (
            <p className="text-xs font-semibold text-red-500 mb-2">
              Не совсем то! Прочитайте текущее задание сверху.
            </p>
          )}

          <button
            onClick={handleVerify}
            disabled={status === "step_done" || status === "level_done"}
            style={{
              backgroundColor:
                status === "step_done" || status === "level_done" ? "#10b981" : "#FF7655",
            }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg active:scale-[0.98] transition"
          >
            {status === "step_done" && "✅ Верно! Загружаем следующее задание..."}
            {status === "level_done" && "🎉 Уровень пройден! Выберите следующий сверху"}
            {(status === "idle" || status === "error") && "Подтвердить выбор"}
          </button>
        </section>
      )}

      <QuestCanvas
        level={currentLevel}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setStatus("idle");
          setShowHint(false);
        }}
        onFpsUpdate={setFps}
      />
    </main>
  );
}
