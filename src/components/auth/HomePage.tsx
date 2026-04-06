"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { LETTERS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FLOATERS = [
  {
    key: "green",
    mg: "ᠮᠠᠨ ᠪ",
    label: "МАНАЙ",
    color: "#3ea55b",
    border: "#b8ecc8",
    pillBg: "#e8f7ec",
    className:
      "right-[100%] top-[52%] -translate-y-1/2 w-[140px] h-[235px] lg:w-[165px] lg:h-[270px] z-[2]",
    textSize: "lg" as const,
  },
  {
    key: "red",
    mg: "ᠭᠠᠯᠢᠭᠲᠠᠨ ᠳ᠋ᠤ ",
    label: "ГАЛИГТАНД",
    color: "#d33a3a",
    border: "#f3b3b3",
    pillBg: "#fde8e8",
    className:
      "left-[5%] top-[18px] w-[150px] h-[255px] lg:w-[175px] lg:h-[350px] z-[4]",
    textSize: "lg" as const,
  },
  {
    key: "orange",
    mg: "ᠲᠠᠪᠲᠠᠢ",
    label: "ТАВТАЙ",
    color: "#c9801f",
    border: "#efd39b",
    pillBg: "#fff3d8",
    className:
      "left-[40%] top-[52%] -translate-y-1/2 w-[140px] h-[235px] lg:w-[165px] lg:h-[270px] z-[2]",
    textSize: "lg" as const,
  },
  {
    key: "blue",
    mg: "ᠮᠣᠷᠢᠯᠠ! ",
    label: "МОРИЛ!",
    color: "#2c6fca",
    border: "#b8d9ff",
    pillBg: "#e8f3ff",
    className:
      "right-[2%] top-[18px] w-[135px] h-[230px] lg:w-[160px] lg:h-[290px] z-[3]",
    textSize: "lg" as const,
  },
];

export function HomePage() {
  const router = useRouter();
  const {
    selectedGrade,
    learnedLetters,
    completedLessons,
    userName,
    isLoggedIn,
    hasSeenLevelEntry,
  } = useAppStore();

  const stats = [
    {
      icon: "/icons/alphabet.png",
      n: learnedLetters.length.toString(),
      label: "Сурсан үсэг",
      color: "text-sky-300",
    },
    {
      icon: "/icons/level.png",
      n: selectedGrade.toString(),
      label: "Сонгосон анги",
      color: "text-grass-300",
    },
    {
      icon: "/icons/gamepad.png",
      n: completedLessons.length.toString(),
      label: "Дуусгасан хичээл",
      color: "text-sand-300",
    },
    {
      icon: "/icons/cards.png",
      n: LETTERS.length.toString(),
      label: "Цээжлэх карт",
      color: "text-ember-300",
    },
  ];

  function handleStartLearning() {
    if (!isLoggedIn) {
      router.push("/lessons");
      return;
    }

    if (!hasSeenLevelEntry) {
      router.push("/level-select");
      return;
    }

    router.push("/lessons");
  }

  return (
    <div className="bg-paper min-h-screen">
      <section className="app-shell pt-24 lg:pt-28 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-12 items-center">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 text-sky-300 text-[14px] lg:text-[15px] font-extrabold px-4 py-2 rounded-full mb-5 tracking-wide shadow-sm">
              Үндэсний Монгол бичиг
            </div>

            <h1 className="text-[50px] md:text-[62px] lg:text-[76px] font-black leading-[0.97] tracking-[-0.04em] text-ink mb-5">
              Монгол <span className="text-sky-300">Бичиг</span>
              <br />
              <span className="text-sand-300">Сур &amp;</span> Тогло
            </h1>

            <p className="text-[17px] lg:text-[20px] text-ink-muted font-semibold leading-[1.6] mb-3 max-w-[560px]">
              {userName
                ? `${userName}, тавтай морил.`
                : "Тавтай морил. Нэвтрэхгүй байсан ч нэг хичээл, жишээ агуулгуудыг сонирхон үзэж болно."}
            </p>

            <p className="text-[16px] lg:text-[18px] text-ink-muted font-semibold leading-[1.6] mb-3 max-w-[560px]">
              Одоогийн сонгосон анги:{" "}
              <span className="text-sky-300 font-extrabold">
                {selectedGrade}-р анги
              </span>
            </p>

            <p className="text-[15px] lg:text-[17px] text-ink-muted font-semibold leading-[1.6] mb-8 max-w-[560px]">
              6–12-р ангийн сурах бичгийн агуулгад тулгуурласан сургалтын орчин.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleStartLearning}
                className="min-h-[58px] px-8 rounded-[20px] bg-sky-300 text-white font-extrabold text-[17px] lg:text-[18px] hover:bg-sky-200 hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(26,107,189,.28)]">
                {isLoggedIn ? "Сурлагаа эхлэх" : "Хичээл үзэх"}
              </button>

              <button
                onClick={() => router.push("/flash")}
                className="min-h-[58px] px-8 rounded-[20px] bg-white text-ink font-extrabold text-[16px] lg:text-[17px] border-2 border-paper-100 hover:border-sky-100 hover:bg-sky-50 transition-all">
                Карт цээжлэх
              </button>
            </div>
          </div>

          <div className="relative h-[360px] md:h-[400px] lg:h-[470px]">
            {FLOATERS.map((f, i) => (
              <div
                key={f.key}
                className={`absolute rounded-[28px] bg-white border-[3px] shadow-[0_14px_30px_rgba(20,28,40,.06)] flex flex-col items-center justify-between py-5 lg:py-6 ${f.className} ${
                  i === 0
                    ? "animate-bob"
                    : i === 1
                      ? "animate-bob-2"
                      : i === 2
                        ? "animate-bob-3"
                        : "animate-bob-4"
                }`}
                style={{ borderColor: f.border }}>
                <div className="flex-1 flex items-center justify-center">
                  <MongolianText
                    size={f.textSize}
                    color={f.color}
                    className="drop-shadow-sm">
                    {f.mg}
                  </MongolianText>
                </div>

                <span
                  className="text-[13px] lg:text-[15px] font-black px-4 py-2 rounded-full leading-none"
                  style={{ backgroundColor: f.pillBg, color: f.color }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell pb-16 lg:pb-20">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
          {stats.map(({ icon, n, label, color }) => (
            <div
              key={label}
              className="bg-white border-2 border-paper-100 rounded-[28px] p-6 lg:p-8 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,28,45,.08)] transition-all cursor-default min-h-[170px] lg:min-h-[190px]">
              <div className="mb-5 w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] rounded-2xl bg-paper-50 flex items-center justify-center">
                <Image
                  src={icon}
                  alt={label}
                  width={64}
                  height={64}
                  className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] object-contain"
                />
              </div>

              <p className={`text-[34px] lg:text-[42px] font-black ${color}`}>
                {n}
              </p>
              <p className="text-[14px] lg:text-[15px] font-bold text-ink-muted mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
