//src/components/dict/DictPage.tsx
"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { GRADE_OPTIONS, LETTERS, WORDS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export function DictPage() {
  const { learnedLetters, markLetterLearned, dictTab, setDictTab } =
    useAppStore();

  const [query, setQuery] = useState("");
  const [wordGradeFilter, setWordGradeFilter] = useState<number | "all">("all");

  const q = query.toLowerCase();

  const filteredLetters = useMemo(() => {
    return LETTERS.filter(
      (l) =>
        !q ||
        l.r.toLowerCase().includes(q) ||
        l.x.toLowerCase().includes(q) ||
        l.mg.includes(q),
    );
  }, [q]);

  const filteredWords = useMemo(() => {
    return WORDS.filter((w) => {
      const matchesQuery =
        !q ||
        w.r.toLowerCase().includes(q) ||
        w.mn.toLowerCase().includes(q) ||
        w.cat.toLowerCase().includes(q) ||
        w.mg.includes(q);

      if (!matchesQuery) return false;

      if (wordGradeFilter === "all") return true;

      if (!w.grades || w.grades.length === 0) return true;

      return w.grades.includes(wordGradeFilter);
    });
  }, [q, wordGradeFilter]);

  return (
    <div className="app-shell max-w-[1200px] mx-auto px-6 py-8 lg:py-10">
      {/* Header */}
      <div className="mb-7">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <p className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] text-ink">
              Толь бичиг
            </p>
            <p className="text-[15px] lg:text-[17px] text-ink-muted font-semibold mt-2 leading-relaxed max-w-[760px]">
              Үсгийн толь нь бүх ангид нийтлэг харагдана. Харин үгийн санг
              ангиар нь шүүж харах боломжтой.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
              <p className="text-[12px] font-bold text-ink-muted">Нийт үсэг</p>
              <p className="text-[24px] font-black text-sky-300 mt-1">
                {LETTERS.length}
              </p>
            </div>

            <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
              <p className="text-[12px] font-bold text-ink-muted">Нийт үг</p>
              <p className="text-[24px] font-black text-grass-300 mt-1">
                {filteredWords.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Хайх... (латин, кирилл эсвэл монгол бичиг)"
          className="w-full bg-white border-2 border-paper-100 rounded-[22px] px-5 py-4 text-[15px] font-semibold text-ink outline-none focus:border-sky-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-5">
        {(
          [
            { key: "letters", label: "Үсгүүд" },
            { key: "words", label: "Үгс" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setDictTab(tab.key)}
            className={cn(
              "px-5 py-3 rounded-full border-2 text-[14px] font-extrabold transition-all",
              dictTab === tab.key
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink-muted border-paper-100 hover:border-sky-100 hover:text-ink",
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grade filter only for words */}
      {dictTab === "words" && (
        <div className="mb-7">
          <p className="text-[12px] font-extrabold text-ink-muted uppercase tracking-[0.5px] mb-3">
            Ангиар шүүх
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setWordGradeFilter("all")}
              className={cn(
                "px-4 py-2.5 rounded-full border-2 text-[13px] font-extrabold transition-all",
                wordGradeFilter === "all"
                  ? "bg-sky-300 text-white border-sky-300"
                  : "bg-white text-ink border-paper-100 hover:border-sky-100",
              )}>
              Бүгд
            </button>

            {GRADE_OPTIONS.map((grade) => (
              <button
                key={grade}
                onClick={() => setWordGradeFilter(grade)}
                className={cn(
                  "px-4 py-2.5 rounded-full border-2 text-[13px] font-extrabold transition-all",
                  wordGradeFilter === grade
                    ? "bg-sky-300 text-white border-sky-300"
                    : "bg-white text-ink border-paper-100 hover:border-sky-100",
                )}>
                {grade}-р анги
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Letters */}
      {dictTab === "letters" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredLetters.map((l, idx) => {
            const learned = learnedLetters.includes(idx);

            return (
              <button
                key={`${l.mg}-${idx}`}
                onClick={() => markLetterLearned(idx)}
                className={cn(
                  "relative bg-white border-2 rounded-[28px] p-5 flex flex-col items-center gap-3 transition-all",
                  learned
                    ? "border-grass-300 bg-grass-50"
                    : "border-paper-100 hover:border-sky-100 hover:-translate-y-0.5",
                )}>
                {learned && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-grass-300 text-white text-[11px] font-black flex items-center justify-center">
                    ✓
                  </div>
                )}

                <div className="h-[120px] flex items-center justify-center">
                  <MongolianText
                    size="xl"
                    color={learned ? "#2a9a52" : "#c97b2a"}>
                    {l.mg}
                  </MongolianText>
                </div>

                <div className="text-center">
                  <p
                    className={cn(
                      "text-[18px] font-black",
                      learned ? "text-grass-300" : "text-ink",
                    )}>
                    {l.r}
                  </p>
                  <p className="text-[13px] text-ink-muted font-semibold mt-1">
                    Жишээ: {l.x}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Words */}
      {dictTab === "words" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWords.map((w, i) => (
            <div
              key={`${w.mg}-${i}`}
              className="bg-white border-2 border-paper-100 rounded-[26px] px-5 py-4 flex items-center gap-4 hover:border-sky-100 transition-all">
              <div className="w-[90px] flex justify-center">
                <MongolianText size="md" color="#c97b2a">
                  {w.mg}
                </MongolianText>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-black text-ink">{w.mn}</p>
                <p className="text-[13px] text-ink-muted font-semibold mt-1">
                  {w.r}
                </p>

                {w.grades && w.grades.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {w.grades.map((g) => (
                      <span
                        key={`${w.mn}-${g}`}
                        className="inline-flex px-2.5 py-1 rounded-full bg-sky-50 text-sky-300 text-[11px] font-extrabold border border-sky-100">
                        {g}-р анги
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span
                className={cn(
                  "inline-flex px-3 py-1.5 rounded-full text-[12px] font-extrabold border",
                  w.cat === "Үйл үг"
                    ? "bg-grass-50 text-grass-300 border-grass-100"
                    : w.cat === "Тэмдэг нэр"
                      ? "bg-sand-50 text-sand-300 border-sand-100"
                      : "bg-paper-50 text-ink-muted border-paper-100",
                )}>
                {w.cat}
              </span>
            </div>
          ))}

          {filteredWords.length === 0 && (
            <div className="col-span-full bg-white border-2 border-paper-100 rounded-[26px] p-6">
              <p className="text-[18px] font-black text-ink mb-2">
                Илэрц олдсонгүй
              </p>
              <p className="text-[14px] text-ink-muted font-semibold">
                Өөр түлхүүр үг эсвэл өөр анги сонгоод үзээрэй.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
