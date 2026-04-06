"use client";

import { FloatingMascot } from "@/components/ui/FloatingMascot";
import { MascotGuideCard } from "@/components/ui/MascotGuideCard";
import { MongolianText } from "@/components/ui/MongolianText";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { showToast } from "@/components/ui/Toast";
import { QUIZ_BANKS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getTitle(quizMode: "normal" | "gate", quizFromLesson: boolean) {
  if (quizMode === "gate") return "Шат ахих шалгалт";
  if (quizFromLesson) return "Хичээлийн шалгалт";
  return "Шалгалт";
}

function getTipTitle(q: QuizQuestion) {
  if (q.cat === "Үсэг таних") return "Үсэг таних зөвлөмж";
  if (q.cat === "Нөхцөл залгавар") return "Дүрмийн зөвлөмж";
  if (q.cat === "Үгийн утга") return "Үгийн утгын зөвлөмж";
  if (q.cat === "Өгүүлбэр") return "Өгүүлбэрийн зөвлөмж";
  return "Зөвлөмж";
}

function getTipDetail(q: QuizQuestion) {
  if (q.cat === "Үсэг таних") {
    return [
      "Үсгийг хараад эхлээд эгшиг үү, гийгүүлэгч үү гэдгийг ялга.",
      "Үсгийн байрлал өөрчлөгдөхөд хэлбэр өөр байж болдгийг санаарай.",
      "Жишээ үгтэй нь холбож бодвол илүү амархан.",
    ];
  }

  if (q.cat === "Нөхцөл залгавар") {
    return [
      "Үгийн төгсгөлийн үсэг болон эгшгийн зохицлыг хамтад нь ажигла.",
      "Бүхэл үгийн хэлбэрийг харьцуулж бодоорой.",
      "Ижил төстэй хувилбаруудын дундаас дүрмийн зөвийг сонго.",
    ];
  }

  if (q.cat === "Үгийн утга") {
    return [
      "Үгийн утга, хэрэглээ, аймгийг бодож сонго.",
      "Нэр үг, үйл үг, тэмдэг нэрийг ялгаарай.",
      "Өмнөх жишээнүүдээ санаарай.",
    ];
  }

  if (q.cat === "Өгүүлбэр") {
    return [
      "Өгүүлбэрийн гол санаа болон үгийн холбоог ажигла.",
      "Ганц үг зөв мэт харагдсан ч өгүүлбэрт буруу байж болно.",
      "Бүх сонголтыг уншсаны дараа сонго.",
    ];
  }

  return [
    "Асуултыг анхааралтай уншаарай.",
    "Сонголтуудыг хооронд нь харьцуул.",
    "Хамгийн зөв утга, дүрэмтэй хариуг сонго.",
  ];
}

function TipModal({
  open,
  title,
  lines,
  onClose,
}: {
  open: boolean;
  title: string;
  lines: string[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[620px] overflow-hidden rounded-[30px] border-2 border-paper-100 bg-white shadow-[0_18px_48px_rgba(20,28,45,.18)]">
        <div className="flex items-center justify-between border-b-2 border-[#f3df9a] bg-[#fff7df] px-6 py-4">
          <div>
            <p className="text-[22px] font-black text-[#8a5a00] lg:text-[24px]">
              💡 {title}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#9a7a25]">
              Асуултад хариулахын өмнө энэ тайлбарыг уншаарай
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full border border-[#f3df9a] bg-white/80 text-[20px] font-black text-[#8a5a00] transition-all hover:bg-white">
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-3">
            {lines.map((line, i) => (
              <div
                key={i}
                className="rounded-[18px] border border-[#f5e5b8] bg-[#fffaf0] px-4 py-3">
                <p className="text-[15px] font-semibold leading-relaxed text-[#5d5240]">
                  {line}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-[18px] bg-[#f0a030] px-6 py-3 text-[15px] font-extrabold text-white transition-all hover:opacity-90">
              Ойлголоо
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizPage() {
  const router = useRouter();
  const {
    quizTopic,
    quizFromLesson,
    quizHideTips,
    quizMode,
    pendingUnlockGrade,
    currentLesson,
    lives,
    loseLife,
    resetLives,
    addXp,
    markLessonCompleted,
    completeGateUnlock,
    clearPendingUnlockGrade,
    startGateQuiz,
  } = useAppStore();

  const [gateTarget] = useState<number | null>(pendingUnlockGrade);

  const questions = useMemo<QuizQuestion[]>(() => {
    return QUIZ_BANKS[quizTopic] ?? QUIZ_BANKS.default ?? [];
  }, [quizTopic]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [passed, setPassed] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const current = questions[idx];
  const total = questions.length;
  const progress = total ? Math.round((idx / total) * 100) : 0;

  const isExamLesson = currentLesson.endsWith("_exam");
  const shouldHideTips =
    quizMode === "gate" || quizHideTips === true || isExamLesson;

  const passCount = useMemo(() => {
    if (!total) return 0;
    return quizMode === "gate"
      ? Math.ceil(total * 0.7)
      : Math.ceil(total * 0.6);
  }, [quizMode, total]);

  const mascotMood =
    picked === null ? "neutral" : picked === current?.c ? "happy" : "sad";

  const mascotMessage =
    picked === null
      ? idx === total - 1
        ? "Сүүлийн асуулт үлдлээ. Анхаараад сонгоорой."
        : "Анхаараад зөв хариулаарай."
      : picked === current?.c
        ? "Маш сайн! Чи зөв хариуллаа."
        : "Зүгээр ээ, дахин оролдож сурна шүү.";

  useEffect(() => {
    if (!quizTopic) {
      router.replace("/lessons");
    }
  }, [quizTopic, router]);

  useEffect(() => {
    resetLives();
    return () => {
      if (quizMode === "gate") {
        clearPendingUnlockGrade();
      }
    };
  }, [quizMode, clearPendingUnlockGrade, resetLives]);

  useEffect(() => {
    if (!shouldHideTips && idx === 0) {
      setTipOpen(true);
    } else {
      setTipOpen(false);
    }
  }, [idx, shouldHideTips]);

  if (!questions.length || !current) {
    return (
      <div className="app-shell mx-auto max-w-[860px] px-6 py-10 lg:py-14">
        <div className="rounded-[28px] border-2 border-paper-100 bg-white p-8">
          <p className="mb-2 text-[24px] font-black text-ink">
            Шалгалтын өгөгдөл олдсонгүй
          </p>
          <p className="text-[15px] font-semibold text-ink-muted">
            Энэ шалгалтын асуултын сан хоосон байна.
          </p>

          <div className="mt-5">
            <button
              onClick={() => router.push("/lessons")}
              className="rounded-[18px] bg-sky-300 px-6 py-3.5 text-[15px] font-extrabold text-white transition-all hover:bg-sky-200">
              Хичээл рүү буцах
            </button>
          </div>
        </div>
      </div>
    );
  }

  function finishQuiz(finalScore: number, remainingLives: number) {
    const hasPassed = finalScore >= passCount && remainingLives > 0;

    setPassed(hasPassed);
    setDone(true);

    if (quizMode === "normal" && hasPassed && quizFromLesson) {
      addXp(25);
      markLessonCompleted(currentLesson);
    }

    if (quizMode === "normal" && !quizFromLesson && hasPassed) {
      addXp(25);
    }

    if (quizMode === "gate" && !hasPassed) {
      clearPendingUnlockGrade();
    }
  }

  function handleAnswer(choiceIdx: number) {
    if (locked || picked !== null) return;

    const isCorrect = choiceIdx === current.c;
    const nextLives = isCorrect ? lives : Math.max(0, lives - 1);

    setPicked(choiceIdx);
    setLocked(true);

    if (isCorrect) {
      setScore((s) => s + 1);
      addXp(5);
      showToast("Зөв!", "ok");
    } else {
      loseLife();
      showToast("Буруу", "bad");
    }

    setTimeout(() => {
      const finalScore = isCorrect ? score + 1 : score;
      const isLast = idx >= total - 1;
      const noLives = nextLives <= 0;

      if (isLast || noLives) {
        finishQuiz(finalScore, nextLives);
      } else {
        setIdx((i) => i + 1);
        setPicked(null);
        setLocked(false);
      }
    }, 1050);
  }

  function restartNormalQuiz() {
    resetLives();
    setIdx(0);
    setScore(0);
    setPicked(null);
    setLocked(false);
    setDone(false);
    setPassed(false);
    setTipOpen(false);
  }

  function retryGateQuiz() {
    if (!gateTarget) return;
    startGateQuiz(quizTopic, gateTarget);
    router.push("/quiz");
  }

  if (done) {
    return (
      <>
        <FloatingMascot
          mood={passed ? "happy" : "sad"}
          mode={passed ? "celebrate" : "comfort"}
          messages={
            passed
              ? [
                  "Шинэ шат руу орж болно шүү.",
                  "Чи сайн ажиллалаа.",
                  "Одоо дараагийн хэсэг рүү явцгаая.",
                ]
              : [
                  "Дахиад нэг оролдоход болно.",
                  "Эхлээд хичээлээ жаахан давтъя.",
                  "Алдаа гаргах нь хэвийн шүү.",
                ]
          }
        />

        <div className="app-shell mx-auto max-w-[860px] px-6 py-10 lg:py-14 animate-fade-up">
          <div className="mb-8">
            <MascotGuideCard
              mood={passed ? "happy" : "sad"}
              mode={passed ? "celebrate" : "comfort"}
              title={passed ? "Баяр хүргэе" : "Тайван байгаарай"}
              message={
                passed
                  ? "Шалгалт амжилттай дууслаа. Чи дараагийн алхам руу орж болно."
                  : "Энэ удаа болоогүй ч хамаагүй. Хичээлээ давтаад дахин оролдоё."
              }
              hint={
                passed
                  ? "Доорх товчоор дараагийн хэсэг рүү орж болно."
                  : "Доорх товчоор дахин оролдох эсвэл буцаад хичээлээ үзэж болно."
              }
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-[32px] font-black tracking-[-0.03em] text-ink lg:text-[40px]">
              {passed ? "Шалгалт амжилттай!" : "Шалгалт дууслаа"}
            </h2>

            <p className="text-[16px] font-semibold text-ink-muted lg:text-[18px]">
              {score}/{total} зөв хариулт
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border-2 border-paper-100 bg-white p-5 text-center">
              <p className="text-[30px] font-black text-sky-300">{score}</p>
              <p className="mt-1 text-[13px] font-bold text-ink-muted">Зөв</p>
            </div>

            <div className="rounded-[24px] border-2 border-paper-100 bg-white p-5 text-center">
              <p className="text-[30px] font-black text-ember-300">
                {total - score}
              </p>
              <p className="mt-1 text-[13px] font-bold text-ink-muted">Буруу</p>
            </div>

            <div className="rounded-[24px] border-2 border-paper-100 bg-white p-5 text-center">
              <p className="text-[30px] font-black text-grass-300">
                {passCount}
              </p>
              <p className="mt-1 text-[13px] font-bold text-ink-muted">
                Тэнцэх босго
              </p>
            </div>
          </div>

          <div
            className={cn(
              "mb-7 rounded-[24px] border-2 p-5",
              passed
                ? "border-grass-100 bg-grass-50"
                : "border-sand-100 bg-sand-50",
            )}>
            {quizMode === "gate" ? (
              passed ? (
                <p className="text-[15px] font-semibold leading-relaxed text-[#355b46] lg:text-[16px]">
                  Та өмнөх шатны шалгалтад тэнцлээ.{" "}
                  <span className="font-extrabold">
                    {gateTarget}-р анги одоо нээгдэхэд бэлэн боллоо.
                  </span>
                </p>
              ) : (
                <p className="text-[15px] font-semibold leading-relaxed text-[#7b6133] lg:text-[16px]">
                  Та энэ шатны шалгалтын босгыг хараахан даваагүй байна. Дахин
                  оролдоод дараагийн ангийг нээгээрэй.
                </p>
              )
            ) : passed ? (
              <p className="text-[15px] font-semibold leading-relaxed text-[#355b46] lg:text-[16px]">
                Та энэ шалгалтад амжилттай оролцлоо. Ахиц таны профайл дээр
                хадгалагдсан.
              </p>
            ) : (
              <p className="text-[15px] font-semibold leading-relaxed text-[#7b6133] lg:text-[16px]">
                Та дахин оролдож, хичээлээ давтаж байгаад дахин шалгалт өгч
                болно.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            {quizMode === "gate" ? (
              passed && gateTarget ? (
                <button
                  onClick={() => {
                    completeGateUnlock(gateTarget);
                    router.push("/lessons");
                  }}
                  className="flex-1 rounded-[20px] bg-sky-300 py-4 text-[16px] font-extrabold text-white shadow-sm transition-all hover:bg-sky-200 lg:text-[17px]">
                  {gateTarget}-р ангид орох →
                </button>
              ) : (
                <button
                  onClick={retryGateQuiz}
                  className="flex-1 rounded-[20px] bg-sand-300 py-4 text-[16px] font-extrabold text-white shadow-sm transition-all hover:opacity-90 lg:text-[17px]">
                  Дахин оролдох
                </button>
              )
            ) : (
              <button
                onClick={() => router.push("/lessons")}
                className="flex-1 rounded-[20px] bg-sky-300 py-4 text-[16px] font-extrabold text-white shadow-sm transition-all hover:bg-sky-200 lg:text-[17px]">
                Хичээл рүү буцах
              </button>
            )}

            <button
              onClick={() => {
                if (quizMode === "gate") {
                  router.push("/level-select");
                } else {
                  restartNormalQuiz();
                }
              }}
              className="flex-1 rounded-[20px] border-2 border-paper-100 bg-white py-4 text-[15px] font-extrabold text-ink transition-all hover:border-sky-100 lg:text-[16px]">
              {quizMode === "gate" ? "Түвшин сонгох руу буцах" : "Дахин өгөх"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TipModal
        open={tipOpen}
        title={getTipTitle(current)}
        lines={getTipDetail(current)}
        onClose={() => setTipOpen(false)}
      />

      <FloatingMascot
        mood={mascotMood}
        mode={
          picked === null
            ? "encourage"
            : picked === current.c
              ? "celebrate"
              : "comfort"
        }
        messages={[
          "Анхаараад сонгоорой.",
          "Сонголтуудыг хооронд нь харьцуул.",
          "Яарахгүй бодоод хариулаарай.",
        ]}
      />

      <div className="app-shell mx-auto max-w-[860px] px-6 py-10 lg:py-14">
        <div className="mb-6 flex items-center gap-4 lg:mb-7">
          <button
            onClick={() => {
              if (quizMode === "gate") {
                clearPendingUnlockGrade();
                router.push("/level-select");
              } else {
                router.push("/lessons");
              }
            }}
            className="whitespace-nowrap rounded-[16px] border-2 border-paper-100 bg-white px-4 py-2.5 text-[14px] font-extrabold transition-all hover:border-sky-100 lg:text-[15px]">
            ← Болих
          </button>

          <ProgressBar value={progress} className="h-3 flex-1" />

          <span className="whitespace-nowrap text-[14px] font-extrabold text-ink-muted lg:text-[15px]">
            {idx + 1} / {total}
          </span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[13px] font-extrabold text-sky-300">
            {getTitle(quizMode, quizFromLesson)}
          </span>

          {quizMode === "gate" && gateTarget && (
            <span className="inline-flex rounded-full border border-sand-100 bg-sand-50 px-4 py-2 text-[13px] font-extrabold text-sand-300">
              {gateTarget}-р ангийг нээх шалгалт
            </span>
          )}

          {isExamLesson && quizMode !== "gate" && (
            <span className="inline-flex rounded-full border border-ember-100 bg-ember-50 px-4 py-2 text-[13px] font-extrabold text-ember-300">
              Эцсийн шалгалт
            </span>
          )}

          {!shouldHideTips && (
            <button
              onClick={() => setTipOpen(true)}
              className="inline-flex rounded-full border border-[#f3df9a] bg-[#fff7df] px-4 py-2 text-[13px] font-extrabold text-[#9a6a00] transition-all hover:bg-[#ffefbf]">
              💡 Зөвлөмж / дүрэм харах
            </button>
          )}
        </div>

        <div className="mb-6">
          <MascotGuideCard
            mood={mascotMood}
            mode={
              picked === null
                ? "encourage"
                : picked === current.c
                  ? "celebrate"
                  : "comfort"
            }
            title="Туслах"
            message={mascotMessage}
            hint={
              picked === null
                ? "Асуултыг уншаад, дараа нь доорх сонголтуудаас зөвийг нь сонго."
                : picked === current.c
                  ? "Ингэж үргэлжлүүлбэл чи амжилттай дуусгана."
                  : "Буруу байсан ч хамаагүй. Дараагийн асуулт дээрээ төвлөрөөрэй."
            }
            actionLabel={!shouldHideTips ? "Зөвлөмж харах" : undefined}
            onAction={!shouldHideTips ? () => setTipOpen(true) : undefined}
          />
        </div>

        <div className="mb-5 flex justify-center">
          <div className="inline-flex rounded-[26px] border-2 border-paper-100 bg-white px-7 py-6 shadow-sm">
            {current.mg ? (
              <MongolianText size="xl" color="#c97b2a">
                {current.mg}
              </MongolianText>
            ) : (
              <p className="text-[15px] font-semibold text-ink-muted">
                Доорх асуултыг уншаад зөв хариултыг сонгоно уу.
              </p>
            )}
          </div>
        </div>

        <p className="mb-7 text-center text-[24px] font-extrabold leading-[1.35] text-ink lg:mb-8 lg:text-[30px]">
          {current.q}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {current.opts.map((opt, i) => {
            const isCorrect = i === current.c;
            const isPicked = picked === i;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={locked}
                className={cn(
                  "flex min-h-[138px] items-center justify-center rounded-[24px] border-[2.5px] border-paper-100 bg-white px-5 py-7 text-center text-[15px] font-bold shadow-sm transition-all duration-200 ease-out lg:min-h-[150px] lg:text-[17px]",
                  !locked &&
                    "hover:-translate-y-0.5 hover:border-sky-100 hover:bg-sky-50",
                  locked &&
                    isCorrect &&
                    "animate-pop border-grass-300 bg-grass-50",
                  locked &&
                    isPicked &&
                    !isCorrect &&
                    "animate-wobble border-ember-300 bg-ember-50",
                )}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
