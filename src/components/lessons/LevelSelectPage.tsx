"use client";

import { GRADE_OPTIONS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const GATE_QUIZ_BY_TARGET: Record<number, string> = {
  7: "g6_basic",
  8: "g7_rules",
  9: "g8_verb",
  10: "g9_reading",
  11: "g10_literature",
  12: "g11_culture",
};

const GRADE_DESC: Record<number, string> = {
  6: "Анхан түвшин · үсэг таних, энгийн үг унших",
  7: "Суурь дүрэм · эгшгийн зохицол, нөхцөл залгалт",
  8: "Хэлбэр зүй · үйл үгийн хэлбэр, үг бүтцийн ойлголт",
  9: "Уншлагын ахиц · өгүүлбэрийн бүтэц, эх ойлголт",
  10: "Уран уншлага · уран зохиолын эх, утга тайлбар",
  11: "Соёлын эх · уламжлал, нэр томьёо, эх ойлголт",
  12: "Ахисан шат · хөрвүүлэлт, найруулга, нэгтгэл",
};

const COLOR_BY_GRADE: Record<number, string> = {
  6: "bg-sky-300",
  7: "bg-grass-300",
  8: "bg-sand-300",
  9: "bg-ember-300",
  10: "bg-[#7c5cbf]",
  11: "bg-[#1a9e8a]",
  12: "bg-[#2c6fca]",
};

export function LevelSelectPage() {
  const { setSelectedGrade, startGateQuiz, unlockedGrades, placementLevel } =
    useAppStore();
  const router = useRouter();

  const highestUnlocked = Math.max(...unlockedGrades);

  function openGrade(grade: number) {
    setSelectedGrade(grade);
    router.push("/lessons");
  }

  function unlockNextGrade(targetGrade: number) {
    const quiz = GATE_QUIZ_BY_TARGET[targetGrade];
    if (!quiz) return;
    startGateQuiz(quiz, targetGrade);
    router.push("/quiz");
  }

  return (
    <div className="app-shell max-w-[980px] mx-auto px-6 py-10 lg:py-14">
      <div className="mb-8 lg:mb-10">
        <p className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] mb-2 text-ink">
          Түвшин ба анги сонгох
        </p>
        <p className="text-[16px] lg:text-[18px] text-ink-muted font-semibold leading-relaxed max-w-[820px]">
          Эхлээд түвшин тогтоох шалгалт өгч болно. Эсвэл өөрөө анги сонгож орно.
          Хэрэв дараагийн ангийг нээх бол өмнөх ангийн шалгалтад тэнцэж байж
          нээнэ.
        </p>
      </div>

      {placementLevel > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-grass-50 border-2 border-grass-100 px-4 py-2 text-[14px] font-extrabold text-grass-300">
          Сүүлд тогтоосон түвшин: {placementLevel}
        </div>
      )}

      <button
        onClick={() => router.push("/placement")}
        className="w-full flex items-center gap-5 bg-sky-50 border-2 border-sky-100 rounded-[28px] p-6 lg:p-7 mb-6 hover:bg-sky-100 hover:-translate-y-px transition-all text-left shadow-sm">
        <span className="text-[34px] lg:text-[40px] shrink-0"></span>

        <div className="flex-1 min-w-0">
          <p className="text-[18px] lg:text-[20px] font-extrabold text-sky-300">
            Түвшин тогтоох шалгалт өгөх
          </p>
          <p className="text-[14px] lg:text-[15px] text-sky-300 font-semibold opacity-80 mt-1 leading-relaxed">
            Систем таны түвшинг тогтоогоод тухайн ангийг шууд нээнэ
          </p>
        </div>

        <span className="text-[24px] lg:text-[28px] text-sky-300 shrink-0">
          →
        </span>
      </button>

      <div className="text-center text-[12px] lg:text-[13px] font-extrabold text-ink-muted tracking-[0.5px] uppercase mb-5 lg:mb-6">
        — эсвэл ангиа өөрөө сонго —
      </div>

      <div className="flex flex-col gap-4">
        {GRADE_OPTIONS.map((grade) => {
          const unlocked = unlockedGrades.includes(grade);
          const canUnlockNow = grade === highestUnlocked + 1;
          const lockedHard = !unlocked && !canUnlockNow;

          return (
            <div
              key={grade}
              className={cn(
                "w-full bg-white border-2 rounded-[28px] p-6 lg:p-7 shadow-sm",
                unlocked
                  ? "border-paper-100"
                  : canUnlockNow
                    ? "border-sand-100 bg-sand-50/40"
                    : "border-paper-100 opacity-70",
              )}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                <div
                  className={cn(
                    "w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-[18px] lg:text-[20px] font-black text-white shrink-0 shadow-sm",
                    COLOR_BY_GRADE[grade],
                  )}>
                  {grade}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[20px] lg:text-[22px] font-extrabold text-ink">
                      {grade}-р анги
                    </p>

                    {unlocked && (
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-grass-50 text-grass-300 border border-grass-100">
                        Нээгдсэн
                      </span>
                    )}

                    {canUnlockNow && (
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-sand-50 text-sand-300 border border-sand-100">
                        Шалгалтаар нээнэ
                      </span>
                    )}

                    {lockedHard && (
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-paper-50 text-ink-muted border border-paper-100">
                        🔒 Түгжээтэй
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] lg:text-[15px] text-ink-muted font-semibold mt-2 leading-relaxed">
                    {GRADE_DESC[grade]}
                  </p>

                  {!unlocked && canUnlockNow && (
                    <p className="text-[13px] text-sand-300 font-bold mt-2">
                      {grade}-р ангийг нээхийн тулд {grade - 1}-р ангийн
                      шалгалтад тэнцэнэ.
                    </p>
                  )}

                  {!unlocked && lockedHard && (
                    <p className="text-[13px] text-ink-muted font-bold mt-2">
                      Эхлээд {grade - 1}-р ангийг нээх шаардлагатай.
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {unlocked ? (
                    <button
                      onClick={() => openGrade(grade)}
                      className="min-w-[160px] bg-sky-300 text-white font-extrabold text-[15px] lg:text-[16px] px-6 py-4 rounded-[20px] hover:bg-sky-200 transition-all">
                      Хичээл рүү →
                    </button>
                  ) : canUnlockNow ? (
                    <button
                      onClick={() => unlockNextGrade(grade)}
                      className="min-w-[220px] bg-sand-300 text-white font-extrabold text-[15px] lg:text-[16px] px-6 py-4 rounded-[20px] hover:opacity-90 transition-all">
                      {grade - 1}-р ангийн шалгалт өгөх
                    </button>
                  ) : (
                    <button
                      disabled
                      className="min-w-[160px] bg-paper-50 text-ink-muted font-extrabold text-[15px] lg:text-[16px] px-6 py-4 rounded-[20px] border-2 border-paper-100 cursor-not-allowed">
                      🔒 Түгжээтэй
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
