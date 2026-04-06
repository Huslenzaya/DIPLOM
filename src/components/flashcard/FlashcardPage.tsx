"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { showToast } from "@/components/ui/Toast";
import { LETTERS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { shuffle } from "@/lib/utils";
import type { Letter } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type FlashSet = "all" | "vowels" | "consonants";
type Rating = "known" | "unknown" | null;

function buildSet(type: FlashSet): Letter[] {
  if (type === "vowels") return LETTERS.filter((l) => l.t === "vowel");
  if (type === "consonants") return LETTERS.filter((l) => l.t === "consonant");
  return [...LETTERS];
}

export function FlashcardPage() {
  const router = useRouter();
  const { markLetterLearned } = useAppStore();

  const [setType, setSetType] = useState<FlashSet>("all");
  const [cards, setCards] = useState<Letter[]>(() => buildSet("all"));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<Rating[]>(() =>
    new Array(LETTERS.length).fill(null),
  );

  const card = cards[idx];
  const progress = Math.round((idx / cards.length) * 100);

  function changeSet(type: FlashSet) {
    setSetType(type);
    const newCards = buildSet(type);
    setCards(newCards);
    setIdx(0);
    setFlipped(false);
    setResults(new Array(newCards.length).fill(null));
  }

  function flipCard() {
    setFlipped((f) => !f);
  }

  const advance = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      if (idx < cards.length - 1) {
        setIdx((i) => i + 1);
      } else {
        showToast("🎉 Бүгдийг нэг удаа харлаа!", "ok");
        setIdx(0);
      }
    }, 80);
  }, [idx, cards.length]);

  function rate(knew: boolean) {
    const globalIdx = LETTERS.indexOf(card);
    const newResults = [...results];
    newResults[idx] = knew ? "known" : "unknown";
    setResults(newResults);

    if (knew && globalIdx >= 0) markLetterLearned(globalIdx);

    showToast(knew ? "Мэдлээ!" : "Дахин давтана", knew ? "ok" : "bad");

    setTimeout(() => {
      if (idx < cards.length - 1) {
        setIdx((i) => i + 1);
        setFlipped(false);
      } else {
        const okCount = newResults.filter((r) => r === "known").length;
        showToast(`Дууслаа! ${okCount}/${cards.length} мэдлээ`, "ok");
        setIdx(0);
        setFlipped(false);
      }
    }, 650);
  }

  function doShuffle() {
    setCards((c) => shuffle(c));
    setIdx(0);
    setFlipped(false);
    setResults(new Array(cards.length).fill(null));
    showToast("Холилоо!", "info");
  }

  const setTypes: { t: FlashSet; label: string }[] = [
    { t: "all", label: "Бүгд" },
    { t: "vowels", label: "Эгшиг" },
    { t: "consonants", label: "Гийгүүлэгч" },
  ];

  return (
    <div className="app-shell max-w-[900px] mx-auto px-6 py-10 lg:py-14 text-center">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-7">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <button
            onClick={() => router.push("/")}
            className="bg-white border-2 border-paper-100 text-ink text-[14px] lg:text-[15px] font-extrabold px-4 py-2.5 rounded-[16px] hover:border-sky-100 hover:bg-sky-50 transition-all">
            ← Буцах
          </button>

          <p className="text-[28px] lg:text-[34px] font-black tracking-[-0.03em] text-ink">
            Цээжлэх карт
          </p>
        </div>

        <div className="flex gap-2 justify-center lg:justify-end flex-wrap">
          {setTypes.map(({ t, label }) => (
            <button
              key={t}
              onClick={() => changeSet(t)}
              className={`text-[13px] lg:text-[14px] font-extrabold px-4 py-2.5 rounded-[16px] border-2 transition-all ${
                setType === t
                  ? "bg-ink text-white border-ink shadow-sm"
                  : "bg-white border-paper-100 text-ink-muted hover:text-ink hover:border-sky-100"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-7 lg:mb-8">
        <ProgressBar value={progress} className="flex-1 h-3" />
        <span className="text-[14px] lg:text-[15px] font-extrabold text-ink-muted whitespace-nowrap">
          {idx + 1} / {cards.length}
        </span>
      </div>

      <div
        className={`flip-scene h-[360px] lg:h-[420px] cursor-pointer mb-7 lg:mb-8 ${flipped ? "flipped" : ""}`}
        onClick={flipCard}
        style={{ perspective: 1000 }}>
        <div
          className="flip-inner w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          }}>
          <div
            className="flip-face w-full h-full absolute inset-0 rounded-[34px] bg-white border-2 border-paper-100 flex flex-col items-center justify-center gap-4 p-8 lg:p-10 shadow-[0_12px_30px_rgba(22,28,45,.08)]"
            style={{ backfaceVisibility: "hidden" }}>
            <MongolianText size="2xl" color="#c97b2a">
              {card.mg}
            </MongolianText>

            <p className="text-[13px] lg:text-[14px] font-bold text-ink-muted absolute bottom-5 right-5">
              Дарж харна уу
            </p>
          </div>

          <div
            className="flip-face flip-back w-full h-full absolute inset-0 rounded-[34px] bg-sky-50 border-2 border-sky-100 flex flex-col items-center justify-center gap-4 p-8 lg:p-10 shadow-[0_12px_30px_rgba(22,28,45,.08)]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}>
            <p className="text-[38px] lg:text-[48px] font-black text-sky-300">
              {card.r}
            </p>

            <p className="text-[18px] lg:text-[20px] text-ink-muted font-semibold">
              {card.x}
            </p>

            <span
              className={`text-[12px] lg:text-[13px] font-extrabold px-4 py-2 rounded-full ${
                card.t === "vowel"
                  ? "bg-sky-50 text-sky-300"
                  : "bg-sand-50 text-sand-300"
              }`}>
              {card.t === "vowel" ? "Эгшиг" : "Гийгүүлэгч"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6 lg:mb-7 flex-wrap">
        <button
          onClick={() => rate(false)}
          title="Дахин давтах"
          className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-white border-2 border-paper-100 text-[24px] lg:text-[28px] hover:border-ember-300 hover:bg-ember-50 transition-all shadow-sm"></button>

        <button
          onClick={advance}
          className="px-7 lg:px-8 h-16 lg:h-[72px] rounded-full bg-white border-2 border-sky-100 text-sky-300 font-extrabold text-[15px] lg:text-[17px] hover:bg-sky-50 transition-all shadow-sm">
          Дараагийн →
        </button>

        <button
          onClick={() => rate(true)}
          title="Мэдлээ!"
          className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-white border-2 border-paper-100 text-[24px] lg:text-[28px] hover:border-grass-300 hover:bg-grass-50 transition-all shadow-sm"></button>
      </div>

      <div className="flex gap-2 justify-center flex-wrap mb-6 lg:mb-7">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === idx
                ? "bg-sky-300 scale-125"
                : results[i] === "known"
                  ? "bg-grass-300"
                  : results[i] === "unknown"
                    ? "bg-ember-300"
                    : "bg-paper-100"
            }`}
          />
        ))}
      </div>

      <button
        onClick={doShuffle}
        className="bg-white border-2 border-paper-100 text-ink font-extrabold text-[15px] lg:text-[16px] px-6 py-3 rounded-[18px] hover:border-sky-100 hover:bg-sky-50 transition-all">
        Холих
      </button>
    </div>
  );
}
