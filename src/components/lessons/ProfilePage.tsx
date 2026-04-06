"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function levelLabel(level: number) {
  switch (level) {
    case 1:
      return "Анхан шат";
    case 2:
      return "Дунд шат";
    case 3:
      return "Дэвшилтэт шат";
    case 4:
      return "Ахисан шат";
    case 5:
      return "Гүнзгийрүүлсэн шат";
    case 6:
      return "Төгсгөлийн шат";
    default:
      return "Анхан шат";
  }
}

export function ProfilePage() {
  const router = useRouter();

  const {
    userName,
    streak,
    xp,
    level,
    selectedGrade,
    placementLevel,
    learnedLetters,
    completedLessons,
    logout,
    resetProgress,
    isLoggedIn,
    openAuthModal,
  } = useAppStore();

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal("Профайл үзэхийн тулд нэвтэрнэ үү.");
      router.replace("/");
    }
  }, [isLoggedIn, openAuthModal, router]);

  if (!isLoggedIn) return null;

  const xpMax = 2000;
  const xpPct = Math.min(100, Math.round((xp / xpMax) * 100));

  const stats = [
    { n: `${selectedGrade}`, label: "Сонгосон анги", color: "text-sky-300" },
    { n: learnedLetters.length, label: "Сурсан үсэг", color: "text-grass-300" },
    {
      n: completedLessons.length,
      label: "Дуусгасан хичээл",
      color: "text-sand-300",
    },
  ];

  const progress = [
    {
      label: "Цагаан толгой",
      current: learnedLetters.length,
      total: 35,
      color: "#1a6bbd",
    },
    {
      label: "Хичээл",
      current: completedLessons.length,
      total: 21,
      color: "#2a9a52",
    },
    {
      label: "Оноо",
      current: Math.min(xp, xpMax),
      total: xpMax,
      color: "#c97b2a",
    },
    {
      label: "Цуврал өдөр",
      current: Math.min(streak, 30),
      total: 30,
      color: "#c83030",
    },
  ];

  const badges = [
    {
      icon: "🔤",
      name: "Үсэг танигч",
      desc: "10 ба түүнээс дээш үсэг сурсан",
      unlocked: learnedLetters.length >= 10,
    },
    {
      icon: "📘",
      name: "Хичээл эхлүүлэгч",
      desc: "1 ба түүнээс дээш хичээл дуусгасан",
      unlocked: completedLessons.length >= 1,
    },
    {
      icon: "⭐",
      name: "Идэвхтэй сурагч",
      desc: "100 ба түүнээс дээш XP цуглуулсан",
      unlocked: xp >= 100,
    },
    {
      icon: "🔥",
      name: "Тууштай",
      desc: "3 ба түүнээс дээш streak-тэй",
      unlocked: streak >= 3,
    },
  ];

  return (
    <div className="app-shell max-w-[980px] mx-auto px-6 py-10 lg:py-14">
      <div className="bg-white border-2 border-paper-100 rounded-[32px] p-7 lg:p-9 mb-6 flex items-center gap-5 lg:gap-6 shadow-[0_10px_28px_rgba(22,28,45,.05)]">
        <div className="w-[86px] h-[86px] lg:w-[96px] lg:h-[96px] rounded-full bg-gradient-to-br from-sky-200 to-grass-200 border-4 border-white shadow-[0_0_0_4px_#b8d9ff] flex items-center justify-center text-[30px] lg:text-[34px] font-black text-white shrink-0">
          {userName?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[28px] lg:text-[34px] font-black tracking-[-0.03em] text-ink">
            {userName || "Хэрэглэгч"}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-sky-50 text-sky-300 text-[12px] lg:text-[13px] font-extrabold">
              {selectedGrade}-р анги
            </span>

            <span className="inline-flex px-3 py-1.5 rounded-full bg-grass-50 text-grass-300 text-[12px] lg:text-[13px] font-extrabold">
              Түвшин {placementLevel}
            </span>

            <span className="inline-flex px-3 py-1.5 rounded-full bg-sand-50 text-sand-300 text-[12px] lg:text-[13px] font-extrabold">
              {levelLabel(level)}
            </span>
          </div>

          <p className="text-[13px] lg:text-[14px] text-ink-muted font-semibold mt-3">
            {xp} / {xpMax} Оноо
          </p>
          <ProgressBar
            value={xpPct}
            className="mt-3 w-[340px] max-w-full h-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-6">
        {stats.map(({ n, label, color }) => (
          <div
            key={label}
            className="bg-white border-2 border-paper-100 rounded-[28px] p-6 lg:p-7 text-center shadow-sm">
            <p className={`text-[34px] lg:text-[42px] font-black ${color}`}>
              {n}
            </p>
            <p className="text-[13px] lg:text-[14px] font-bold text-ink-muted mt-1.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-7 lg:p-8 shadow-sm">
          <h3 className="text-[18px] lg:text-[22px] font-black mb-6 text-ink">
            Суралцалтын явц
          </h3>

          <div className="flex flex-col gap-5">
            {progress.map(({ label, current, total, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center text-[14px] lg:text-[15px] font-bold mb-2.5">
                  <span className="text-ink">{label}</span>
                  <span style={{ color }} className="font-extrabold">
                    {current}/{total}
                  </span>
                </div>
                <ProgressBar
                  value={Math.round((current / total) * 100)}
                  color={color}
                  className="h-3"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-7 lg:p-8 shadow-sm">
          <h3 className="text-[18px] lg:text-[22px] font-black mb-6 text-ink">
            Ерөнхий мэдээлэл
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-paper-50 pb-3">
              <span className="text-[14px] lg:text-[15px] text-ink-muted font-semibold">
                Хэрэглэгчийн нэр
              </span>
              <span className="text-[14px] lg:text-[15px] font-extrabold text-ink">
                {userName || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-paper-50 pb-3">
              <span className="text-[14px] lg:text-[15px] text-ink-muted font-semibold">
                Сонгосон анги
              </span>
              <span className="text-[14px] lg:text-[15px] font-extrabold text-sky-300">
                {selectedGrade}-р анги
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-paper-50 pb-3">
              <span className="text-[14px] lg:text-[15px] text-ink-muted font-semibold">
                Түвшин
              </span>
              <span className="text-[14px] lg:text-[15px] font-extrabold text-grass-300">
                Түвшин {placementLevel}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-paper-50 pb-3">
              <span className="text-[14px] lg:text-[15px] text-ink-muted font-semibold">
                Цуглуулсан оноо
              </span>
              <span className="text-[14px] lg:text-[15px] font-extrabold text-sand-300">
                {xp}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[14px] lg:text-[15px] text-ink-muted font-semibold">
                Тасралтгүй суралцсан өдөр
              </span>
              <span className="text-[14px] lg:text-[15px] font-extrabold text-ember-300">
                {streak} өдөр
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-paper-100 rounded-[28px] p-7 lg:p-8 shadow-sm mb-6">
        <h3 className="text-[18px] lg:text-[22px] font-black mb-6 text-ink">
          Медалиуд
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {badges.map(({ icon, name, desc, unlocked }) => (
            <div
              key={name}
              className={`bg-paper-50 border-2 border-paper-100 rounded-[24px] p-5 lg:p-6 text-center transition-all ${
                !unlocked
                  ? "opacity-40"
                  : "hover:-translate-y-1 hover:shadow-sm"
              }`}>
              <p className="text-[32px] lg:text-[38px] mb-3">{icon}</p>
              <p className="text-[13px] lg:text-[14px] font-extrabold text-ink leading-snug">
                {name}
              </p>
              <p className="text-[11px] lg:text-[12px] text-ink-muted mt-1.5 font-semibold leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={logout}
          className="w-full bg-ember-300 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 hover:opacity-90 transition-all shadow-sm">
          Гарах
        </button>

        <button
          onClick={() => {
            const ok = window.confirm(
              "Бүх ахиц, оноо, сурсан үсгүүдийг цэвэрлэх үү?",
            );
            if (ok) resetProgress();
          }}
          className="w-full bg-white border-2 border-paper-100 text-ink font-extrabold text-[15px] lg:text-[16px] rounded-[20px] py-4 hover:border-sky-100 transition-all">
          Ахиц цэвэрлэх
        </button>
      </div>
    </div>
  );
}
