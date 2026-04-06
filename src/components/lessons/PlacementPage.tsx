"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { showToast } from "@/components/ui/Toast";
import { PLACEMENT_LEVELS, PLACEMENT_QUESTIONS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryResult {
  ok: number;
  tot: number;
}

export function PlacementPage() {
  const { setPlacementLevel } = useAppStore();
  const router = useRouter();

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ q: QuizQuestion; ok: boolean }[]>(
    [],
  );
  const [optStates, setOptStates] = useState<Record<number, "ok" | "bad">>({});
  const [done, setDone] = useState(false);
  const [resultLevel, setResultLevel] = useState(PLACEMENT_LEVELS[0]);

  const q = PLACEMENT_QUESTIONS[idx];
  const progress = Math.round((idx / PLACEMENT_QUESTIONS.length) * 100);

  function answer(chosen: number) {
    if (Object.keys(optStates).length) return;

    const isOk = chosen === q.c;
    const states: Record<number, "ok" | "bad"> = {};

    q.opts.forEach((_, i) => {
      if (i === q.c) states[i] = "ok";
      else if (i === chosen) states[i] = "bad";
    });

    setOptStates(states);

    if (isOk) {
      setScore((s) => s + 1);
      showToast("Зөв!", "ok");
    } else {
      showToast("Буруу", "bad");
    }

    const newAnswers = [...answers, { q, ok: isOk }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setOptStates({});

      if (idx + 1 >= PLACEMENT_QUESTIONS.length) {
        const newScore = score + (isOk ? 1 : 0);
        let lvl = PLACEMENT_LEVELS[0];

        for (let i = PLACEMENT_LEVELS.length - 1; i >= 0; i--) {
          if (newScore >= PLACEMENT_LEVELS[i].score) {
            lvl = PLACEMENT_LEVELS[i];
            break;
          }
        }

        setResultLevel(lvl);
        setPlacementLevel(lvl.n);
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setAnswers([]);
    setOptStates({});
    setDone(false);
    setResultLevel(PLACEMENT_LEVELS[0]);
  }

  if (done) {
    const cats: Record<string, CategoryResult> = {};

    answers.forEach(({ q: aq, ok }) => {
      const c = aq.cat ?? "Бусад";
      if (!cats[c]) cats[c] = { ok: 0, tot: 0 };
      cats[c].tot++;
      if (ok) cats[c].ok++;
    });

    const finalScore = score;

    const catIcons: Record<string, string> = {
      "Үсэг таних": "",
      "Үгийн утга": "",
      "Нөхцөл залгавар": "",
      Өгүүлбэр: "",
      Бусад: "",
    };

    return (
      <div className="app-shell max-w-[760px] mx-auto px-6 py-10 lg:py-14 animate-fade-up">
        <div className="text-center mb-7 lg:mb-8">
          <p className="text-[72px] lg:text-[84px] mb-3">{resultLevel.emoji}</p>
          <h2 className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] mb-2 text-ink">
            Таны түвшин: {resultLevel.name}
          </h2>
          <p className="text-[16px] lg:text-[18px] text-ink-muted font-semibold">
            Санал болгож буй түвшин: {resultLevel.grade}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border-2 border-paper-100 rounded-[30px] p-6 lg:p-8 mb-5 shadow-sm">
          <div className="relative shrink-0">
            <svg viewBox="0 0 96 96" width={96} height={96}>
              <circle
                cx={48}
                cy={48}
                r={40}
                fill="none"
                stroke="#e8e0d0"
                strokeWidth={8}
              />
              <circle
                cx={48}
                cy={48}
                r={40}
                fill="none"
                stroke="#1a6bbd"
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={
                  251.2 * (1 - finalScore / PLACEMENT_QUESTIONS.length)
                }
                transform="rotate(-90 48 48)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>

            <p className="absolute inset-0 flex items-center justify-center text-[14px] lg:text-[15px] font-black text-ink">
              {finalScore}/{PLACEMENT_QUESTIONS.length}
            </p>
          </div>

          <div className="flex-1 w-full">
            {Object.entries(cats).map(([cat, v]) => (
              <div
                key={cat}
                className="flex justify-between items-center text-[14px] lg:text-[15px] font-bold py-2.5 border-b border-paper-50 last:border-0">
                <span className="text-ink">{cat}</span>
                <span
                  style={{
                    color:
                      v.ok === v.tot
                        ? "#2a9a52"
                        : v.ok > v.tot / 2
                          ? "#c97b2a"
                          : "#c83030",
                  }}
                  className="font-extrabold">
                  {v.ok}/{v.tot}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {Object.entries(cats).map(([cat, v]) => {
            const p = v.ok / v.tot;
            const cls =
              p >= 0.8
                ? "bg-grass-50 text-grass-300"
                : p >= 0.5
                  ? "bg-sand-50 text-sand-300"
                  : "bg-ember-50 text-ember-300";

            const msg =
              p >= 0.8 ? "Маш сайн" : p >= 0.5 ? "Дундаж" : "Давтах хэрэгтэй";

            return (
              <div
                key={cat}
                className="flex items-center gap-4 bg-white border-2 border-paper-100 rounded-[24px] px-5 lg:px-6 py-4">
                <span className="text-[22px] lg:text-[24px] w-8 shrink-0">
                  {catIcons[cat] ?? ""}
                </span>

                <span className="flex-1 text-[14px] lg:text-[15px] font-bold text-ink">
                  {cat}
                </span>

                <span
                  className={cn(
                    "text-[12px] lg:text-[13px] font-extrabold px-3.5 py-2 rounded-full",
                    cls,
                  )}>
                  {v.ok}/{v.tot} · {msg}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5">
          <button
            onClick={() => router.push("/lessons")}
            className="flex-1 bg-sky-300 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 hover:bg-sky-200 transition-all shadow-sm">
            Миний хичээл рүү →
          </button>

          <button
            onClick={restart}
            className="flex-1 bg-white border-2 border-paper-100 font-extrabold text-[15px] lg:text-[16px] text-ink rounded-[20px] py-4 hover:border-sky-100 transition-all">
            Түвшин тогтоох шалгалтыг дахин өгөх
          </button>
        </div>
      </div>
    );
  }

  const diffMap: Record<number, { label: string; cls: string }> = {
    1: { label: "⬤ Анхан шат", cls: "bg-sky-50 text-sky-300" },
    2: { label: "⬤ Суурь шат", cls: "bg-grass-50 text-grass-300" },
    3: { label: "⬤ Дунд шат", cls: "bg-sand-50 text-sand-300" },
    4: { label: "⬤ Ахиж буй шат", cls: "bg-ember-50 text-ember-300" },
    5: { label: "⬤ Сайн түвшин", cls: "bg-[#f4f0ff] text-[#7c5cbf]" },
    6: { label: "⬤ Ахисан түвшин", cls: "bg-[#e8faf7] text-[#1a9e8a]" },
  };

  const diff = diffMap[q?.lvl ?? 1] ?? diffMap[1];

  return (
    <div className="app-shell max-w-[860px] mx-auto px-6 py-10 lg:py-14">
      <div className="flex items-center gap-4 mb-6 lg:mb-7">
        <button
          onClick={() => router.push("/level-select")}
          className="bg-white border-2 border-paper-100 text-[14px] lg:text-[15px] font-extrabold px-4 py-2.5 rounded-[16px] hover:border-sky-100 transition-all whitespace-nowrap">
          ← Болих
        </button>

        <ProgressBar value={progress} className="flex-1 h-3" />

        <span className="text-[14px] lg:text-[15px] font-extrabold text-ink-muted whitespace-nowrap">
          {idx + 1} / {PLACEMENT_QUESTIONS.length}
        </span>
      </div>

      <span
        className={cn(
          "inline-block text-[13px] lg:text-[14px] font-extrabold px-4 py-2 rounded-full mb-6",
          diff.cls,
        )}>
        {diff.label}
      </span>

      {q?.mg && (
        <div className="flex justify-center mb-5">
          <div className="bg-white border-2 border-paper-100 rounded-[26px] px-7 py-6 inline-flex shadow-sm">
            <MongolianText size="xl" color="#c97b2a">
              {q.mg}
            </MongolianText>
          </div>
        </div>
      )}

      <p className="text-[24px] lg:text-[30px] font-extrabold text-center leading-[1.35] mb-7 lg:mb-8 text-ink">
        {q.q}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {q.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            disabled={!!Object.keys(optStates).length}
            className={cn(
              "bg-white border-[2.5px] border-paper-100 rounded-[24px] py-7 px-5 flex items-center justify-center min-h-[138px] lg:min-h-[150px] text-[15px] lg:text-[17px] font-bold transition-all text-center shadow-sm",
              !Object.keys(optStates).length &&
                "hover:border-sky-100 hover:bg-sky-50 hover:-translate-y-0.5",
              optStates[i] === "ok" &&
                "border-grass-300 bg-grass-50 animate-pop",
              optStates[i] === "bad" &&
                "border-ember-300 bg-ember-50 animate-wobble",
            )}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
