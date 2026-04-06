"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { GRADE_OPTIONS, LETTERS } from "@/lib/data";
import { useLessons } from "@/lib/hooks/useLessons";
import { useAppStore } from "@/lib/store";
import { cn, shuffle } from "@/lib/utils";
import type { Letter } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const KIND_META = {
  lesson: {
    label: "Хичээл",
    chip: "bg-sky-50 text-sky-300 border-sky-100",
    icon: "📘",
    button: "Хичээл үзэх",
  },
  rule: {
    label: "Дүрэм",
    chip: "bg-grass-50 text-grass-300 border-grass-100",
    icon: "📗",
    button: "Дүрэм үзэх",
  },
  practice: {
    label: "Дасгал",
    chip: "bg-sand-50 text-sand-300 border-sand-100",
    icon: "✍️",
    button: "Дасгал эхлэх",
  },
  exam: {
    label: "Шалгалт",
    chip: "bg-ember-50 text-ember-300 border-ember-100",
    icon: "📝",
    button: "Шалгалт өгөх",
  },
} as const;

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
  9: "Уншлага · өгүүлбэрийн бүтэц, эх ойлголт",
  10: "Уран уншлага · зохиолын эх, утга тайлбар",
  11: "Соёлын эх · уламжлал, нэр томьёо",
  12: "Ахисан шат · хөрвүүлэлт, найруулга",
};

type FlashSet = "all" | "vowels" | "consonants";

function buildFlashSet(type: FlashSet): Letter[] {
  if (type === "vowels") return LETTERS.filter((l) => l.t === "vowel");
  if (type === "consonants") return LETTERS.filter((l) => l.t === "consonant");
  return [...LETTERS];
}

function EmbeddedFlashcards() {
  const router = useRouter();
  const { markLetterLearned, learnedLetters } = useAppStore();

  const [setType, setSetType] = useState<FlashSet>("all");
  const [cards, setCards] = useState<Letter[]>(() => buildFlashSet("all"));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[idx];
  const progress = cards.length
    ? Math.round(((idx + 1) / cards.length) * 100)
    : 0;

  function changeSet(type: FlashSet) {
    const next = buildFlashSet(type);
    setSetType(type);
    setCards(next);
    setIdx(0);
    setFlipped(false);
  }

  function nextCard() {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % cards.length);
    }, 80);
  }

  function shuffleCards() {
    setCards((prev) => shuffle(prev));
    setIdx(0);
    setFlipped(false);
  }

  function markKnown() {
    const globalIdx = LETTERS.indexOf(card);
    if (globalIdx >= 0) {
      markLetterLearned(globalIdx);
    }
    nextCard();
  }

  const setTypes: { key: FlashSet; label: string }[] = [
    { key: "all", label: "Бүгд" },
    { key: "vowels", label: "Эгшиг" },
    { key: "consonants", label: "Гийгүүлэгч" },
  ];

  const learnedCurrent =
    LETTERS.indexOf(card) >= 0
      ? learnedLetters.includes(LETTERS.indexOf(card))
      : false;

  return (
    <div className="bg-white border-2 border-paper-100 rounded-[32px] p-6 lg:p-8 shadow-[0_10px_28px_rgba(22,28,45,.05)]">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex px-3 py-1 rounded-full border text-[12px] font-extrabold bg-ember-50 text-ember-300 border-ember-100">
              Цээжлэх карт
            </span>

            <span className="inline-flex px-3 py-1 rounded-full bg-paper-50 text-ink-muted text-[12px] font-bold border border-paper-100">
              {cards.length} карт
            </span>

            {learnedCurrent && (
              <span className="inline-flex px-3 py-1 rounded-full bg-grass-50 text-grass-300 text-[12px] font-extrabold border border-grass-100">
                ✓ Сурсан
              </span>
            )}
          </div>

          <h2 className="text-[28px] lg:text-[34px] font-black tracking-[-0.03em] text-ink leading-tight">
            Үсэг цээжлэх хэсэг
          </h2>

          <p className="text-[15px] lg:text-[16px] text-ink-muted font-semibold mt-3 leading-relaxed max-w-[780px]">
            Хичээл үзэхийн хажуугаар эндээс үсэг давтаж, эгшиг ба гийгүүлэгчийг
            цээжилж болно.
          </p>
        </div>

        <button
          onClick={() => router.push("/flash")}
          className="shrink-0 px-6 py-4 rounded-[20px] text-[15px] lg:text-[16px] font-extrabold transition-all bg-sky-300 text-white hover:bg-sky-200">
          Бүтэн картын хэсэг рүү →
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {setTypes.map((item) => (
          <button
            key={item.key}
            onClick={() => changeSet(item.key)}
            className={cn(
              "px-4 py-2.5 rounded-full border-2 text-[13px] font-extrabold transition-all",
              setType === item.key
                ? "bg-ink text-white border-ink"
                : "bg-white text-ink border-paper-100 hover:border-sky-100",
            )}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="h-3 bg-paper-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full progress-fill"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #3dba68, #4a9ede)",
            }}
          />
        </div>
        <p className="text-[13px] text-ink-muted font-bold mt-2">
          {idx + 1} / {cards.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch">
        <div
          className={cn(
            "relative min-h-[340px] rounded-[32px] border-2 cursor-pointer transition-all shadow-sm",
            flipped
              ? "bg-sky-50 border-sky-100"
              : "bg-white border-paper-100 hover:border-sky-100",
          )}
          onClick={() => setFlipped((v) => !v)}>
          {!flipped ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <MongolianText size="2xl" color="#c97b2a">
                {card.mg}
              </MongolianText>
              <p className="text-[14px] lg:text-[15px] font-bold text-ink-muted mt-6">
                Дарж эргүүлж харна уу
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <p className="text-[42px] lg:text-[52px] font-black text-sky-300">
                {card.r}
              </p>
              <p className="text-[18px] lg:text-[20px] text-ink-muted font-semibold mt-4">
                {card.x}
              </p>
              <span
                className={cn(
                  "mt-5 inline-flex text-[12px] lg:text-[13px] font-extrabold px-4 py-2 rounded-full",
                  card.t === "vowel"
                    ? "bg-sky-50 text-sky-300"
                    : "bg-sand-50 text-sand-300",
                )}>
                {card.t === "vowel" ? "Эгшиг" : "Гийгүүлэгч"}
              </span>
            </div>
          )}
        </div>

        <div className="bg-paper-50 border-2 border-paper-100 rounded-[28px] p-5 lg:p-6">
          <p className="text-[13px] uppercase tracking-[0.08em] font-extrabold text-ink-muted mb-4">
            Үйлдлүүд
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={markKnown}
              className="w-full bg-grass-300 text-white font-extrabold text-[15px] lg:text-[16px] rounded-[18px] py-3.5 hover:opacity-90 transition-all">
              Мэдлээ
            </button>

            <button
              onClick={nextCard}
              className="w-full bg-sky-300 text-white font-extrabold text-[15px] lg:text-[16px] rounded-[18px] py-3.5 hover:bg-sky-200 transition-all">
              Дараагийн карт
            </button>

            <button
              onClick={shuffleCards}
              className="w-full bg-white border-2 border-paper-100 text-ink font-extrabold text-[15px] lg:text-[16px] rounded-[18px] py-3.5 hover:border-sky-100 transition-all">
              Холих
            </button>
          </div>

          <div className="mt-5 bg-white border-2 border-paper-100 rounded-[22px] p-4">
            <p className="text-[12px] font-extrabold text-sky-300 mb-2 uppercase tracking-wide">
              Ашиглах зөвлөмж
            </p>
            <ul className="list-disc pl-5 text-[14px] text-[#5f6787] font-semibold leading-relaxed space-y-1.5">
              <li>Эхлээд үсгийг хараад тань</li>
              <li>Дараа нь картаа эргүүлж дуудлага хар</li>
              <li>Жишээ үгээр нь тогтоогоорой</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelSwitchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const {
    selectedGrade,
    unlockedGrades,
    placementLevel,
    setSelectedGrade,
    startGateQuiz,
    isLoggedIn,
    openAuthModal,
  } = useAppStore();

  const highestUnlocked = Math.max(...unlockedGrades);

  if (!open) return null;

  function openGrade(grade: number) {
    if (!isLoggedIn && grade !== 6) {
      openAuthModal(
        "6-р ангийн жишээ хичээлээс цааш үзэхийн тулд нэвтэрнэ үү.",
      );
      return;
    }
    setSelectedGrade(grade);
    onClose();
  }

  function unlockNextGrade(targetGrade: number) {
    if (!isLoggedIn) {
      openAuthModal("Дараагийн анги нээхийн тулд нэвтэрнэ үү.");
      return;
    }
    const quiz = GATE_QUIZ_BY_TARGET[targetGrade];
    if (!quiz) return;
    onClose();
    startGateQuiz(quiz, targetGrade);
    router.push("/quiz");
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px] flex items-center justify-center px-4">
      <div className="w-full max-w-[820px] bg-white border-2 border-paper-100 rounded-[32px] shadow-[0_18px_48px_rgba(20,28,45,.18)]">
        <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-paper-50">
          <div>
            <p className="text-[24px] lg:text-[28px] font-black text-ink">
              Түвшин солих
            </p>
            <p className="text-[14px] text-ink-muted font-semibold mt-1">
              Одоогийн анги: {selectedGrade}-р анги
              {placementLevel > 0 && ` · Placement түвшин: ${placementLevel}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-paper-50 border-2 border-paper-100 text-[20px] font-black text-ink-muted hover:bg-paper-100 transition-all">
            ×
          </button>
        </div>

        <div className="px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-1">
            {GRADE_OPTIONS.map((grade) => {
              const unlocked = unlockedGrades.includes(grade);
              const canUnlockNow = grade === highestUnlocked + 1;
              const guestLocked = !isLoggedIn && grade !== 6;

              return (
                <div
                  key={grade}
                  className={cn(
                    "border-2 rounded-[26px] p-5",
                    unlocked && !guestLocked
                      ? "bg-white border-paper-100"
                      : canUnlockNow && !guestLocked
                        ? "bg-sand-50/40 border-sand-100"
                        : "bg-paper-50/70 border-paper-100 opacity-80",
                  )}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black text-white shrink-0",
                        grade === 6 && "bg-sky-300",
                        grade === 7 && "bg-grass-300",
                        grade === 8 && "bg-sand-300",
                        grade === 9 && "bg-ember-300",
                        grade === 10 && "bg-[#7c5cbf]",
                        grade === 11 && "bg-[#1a9e8a]",
                        grade === 12 && "bg-[#2c6fca]",
                      )}>
                      {grade}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="text-[20px] font-extrabold text-ink">
                          {grade}-р анги
                        </p>

                        {grade === selectedGrade && (
                          <span className="inline-flex px-3 py-1 rounded-full bg-sky-50 text-sky-300 text-[11px] font-extrabold border border-sky-100">
                            Одоогийн
                          </span>
                        )}

                        {guestLocked ? (
                          <span className="inline-flex px-3 py-1 rounded-full bg-paper-100 text-ink-muted text-[11px] font-extrabold border border-paper-100">
                            🔒 Нэвтэрч нээнэ
                          </span>
                        ) : unlocked ? (
                          <span className="inline-flex px-3 py-1 rounded-full bg-grass-50 text-grass-300 text-[11px] font-extrabold border border-grass-100">
                            Нээгдсэн
                          </span>
                        ) : canUnlockNow ? (
                          <span className="inline-flex px-3 py-1 rounded-full bg-sand-50 text-sand-300 text-[11px] font-extrabold border border-sand-100">
                            Шалгалтаар нээнэ
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full bg-paper-100 text-ink-muted text-[11px] font-extrabold border border-paper-100">
                            🔒 Дараа нээгдэнэ
                          </span>
                        )}
                      </div>

                      <p className="text-[14px] text-ink-muted font-semibold mt-2 leading-relaxed">
                        {GRADE_DESC[grade]}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {guestLocked ? (
                        <button
                          onClick={() =>
                            openAuthModal(
                              "6-р ангийн жишээ хичээлээс цааш үзэхийн тулд нэвтэрнэ үү.",
                            )
                          }
                          className="min-w-[160px] px-6 py-3.5 rounded-[18px] bg-paper-50 border-2 border-paper-100 text-[15px] font-extrabold text-ink-muted">
                          Нэвтрэх
                        </button>
                      ) : unlocked ? (
                        <button
                          onClick={() => openGrade(grade)}
                          className={cn(
                            "min-w-[160px] px-6 py-3.5 rounded-[18px] text-[15px] font-extrabold transition-all",
                            grade === selectedGrade
                              ? "bg-paper-50 border-2 border-paper-100 text-ink-muted"
                              : "bg-sky-300 text-white hover:bg-sky-200",
                          )}>
                          {grade === selectedGrade ? "Сонгогдсон" : "Орох"}
                        </button>
                      ) : canUnlockNow ? (
                        <button
                          onClick={() => unlockNextGrade(grade)}
                          className="min-w-[220px] px-6 py-3.5 rounded-[18px] bg-sand-300 text-white text-[15px] font-extrabold hover:opacity-90 transition-all">
                          {grade - 1}-р ангийн шалгалт өгөх
                        </button>
                      ) : (
                        <button
                          disabled
                          className="min-w-[160px] px-6 py-3.5 rounded-[18px] bg-paper-50 border-2 border-paper-100 text-[15px] font-extrabold text-ink-muted cursor-not-allowed">
                          🔒 Түгжээтэй
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => {
                onClose();
                if (!isLoggedIn) {
                  openAuthModal(
                    "Түвшин тогтоох шалгалт өгөхийн тулд нэвтэрнэ үү.",
                  );
                  return;
                }
                router.push("/placement");
              }}
              className="px-5 py-3 rounded-[18px] bg-grass-300 text-white text-[15px] font-extrabold hover:opacity-90 transition-all">
              Түвшин тогтоох шалгалтыг дахин өгөх
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-[18px] bg-white border-2 border-paper-100 text-[15px] font-extrabold text-ink hover:border-sky-100 transition-all">
              Болих
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonsPage() {
  const router = useRouter();
  const {
    selectedGrade,
    setSelectedGrade,
    unlockedGrades,
    currentLesson,
    setLesson,
    completedLessons,
    startQuiz,
    isLoggedIn,
    openAuthModal,
  } = useAppStore();

  const [showLevelModal, setShowLevelModal] = useState(false);

  const gradeLessons = useMemo(
    () => LESSONS.filter((lesson) => lesson.grade === selectedGrade),
    [selectedGrade],
  );

  const previewLessonId = gradeLessons[0]?.id;

  const activeLesson =
    gradeLessons.find((lesson) => lesson.id === currentLesson) ??
    gradeLessons[0];

  useEffect(() => {
    if (!gradeLessons.length) return;

    const exists = gradeLessons.some((lesson) => lesson.id === currentLesson);
    if (!exists) {
      setLesson(gradeLessons[0].id);
    }
  }, [gradeLessons, currentLesson, setLesson]);

  useEffect(() => {
    if (!isLoggedIn && activeLesson && activeLesson.id !== previewLessonId) {
      setLesson(previewLessonId);
    }
  }, [isLoggedIn, activeLesson, previewLessonId, setLesson]);

  if (!gradeLessons.length || !activeLesson) {
    return (
      <div className="app-shell max-w-[1200px] mx-auto px-6 py-10">
        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-8">
          <p className="text-[24px] font-black text-ink mb-2">
            Агуулга олдсонгүй
          </p>
          <p className="text-[15px] text-ink-muted font-semibold">
            Энэ ангид хараахан хичээлийн өгөгдөл ороогүй байна.
          </p>
        </div>
      </div>
    );
  }

  const finishedCount = gradeLessons.filter((l) =>
    completedLessons.includes(l.id),
  ).length;

  function handleLockedAction() {
    openAuthModal("Энэ хичээлүүдийг үргэлжлүүлэн үзэхийн тулд нэвтэрнэ үү.");
  }

  return (
    <>
      <LevelSwitchModal
        open={showLevelModal}
        onClose={() => setShowLevelModal(false)}
      />

      <div className="app-shell max-w-[1280px] mx-auto px-6 py-8 lg:py-10">
        {!isLoggedIn && (
          <div className="mb-6 bg-sand-50 border-2 border-sand-100 rounded-[24px] px-5 py-4">
            <p className="text-[12px] font-extrabold text-sand-300 uppercase tracking-[0.5px] mb-1.5">
              Guest preview
            </p>
            <p className="text-[14px] text-[#7c6435] font-semibold leading-relaxed">
              Та одоогоор жишээ болгон зөвхөн 1 хичээл үзэж байна. Бусад хичээл,
              дасгал, шалгалтыг үзэхийн тулд нэвтэрнэ үү.
            </p>
          </div>
        )}

        <div className="mb-7">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div>
              <p className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] text-ink">
                Хичээл
              </p>
              <p className="text-[15px] lg:text-[17px] text-ink-muted font-semibold mt-2 leading-relaxed max-w-[760px]">
                Ангиа сонгоод тухайн түвшинд тохирсон хичээл, дүрэм, дасгал,
                шалгалтаа дарааллаар нь үзээрэй.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-w-[280px]">
              <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
                <p className="text-[12px] font-bold text-ink-muted">
                  Сонгосон анги
                </p>
                <p className="text-[24px] font-black text-sky-300 mt-1">
                  {selectedGrade}
                </p>
              </div>

              <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
                <p className="text-[12px] font-bold text-ink-muted">
                  Нийт агуулга
                </p>
                <p className="text-[24px] font-black text-grass-300 mt-1">
                  {gradeLessons.length}
                </p>
              </div>

              <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
                <p className="text-[12px] font-bold text-ink-muted">Дууссан</p>
                <p className="text-[24px] font-black text-sand-300 mt-1">
                  {finishedCount}
                </p>
              </div>

              <div className="bg-white border-2 border-paper-100 rounded-[22px] px-4 py-3">
                <p className="text-[12px] font-bold text-ink-muted">Үлдсэн</p>
                <p className="text-[24px] font-black text-ember-300 mt-1">
                  {gradeLessons.length - finishedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowLevelModal(true)}
            className="px-5 py-3 rounded-full bg-sky-300 text-white text-[14px] font-extrabold hover:bg-sky-200 transition-all shadow-[0_8px_18px_rgba(26,107,189,.22)]">
            {selectedGrade}-р анги ▾
          </button>

          {unlockedGrades
            .filter((grade) => grade !== selectedGrade)
            .slice(0, 3)
            .map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  if (!isLoggedIn && grade !== 6) {
                    handleLockedAction();
                    return;
                  }
                  setSelectedGrade(grade);
                }}
                className="px-5 py-3 rounded-full border-2 border-paper-100 bg-white text-ink text-[14px] font-extrabold hover:border-sky-100 transition-all">
                {grade}-р анги
              </button>
            ))}

          <button
            onClick={() => setShowLevelModal(true)}
            className="px-5 py-3 rounded-full border-2 border-paper-100 bg-white text-ink text-[14px] font-extrabold hover:border-sky-100 transition-all">
            Түвшин солих
          </button>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                openAuthModal(
                  "Түвшин тогтоох шалгалт өгөхийн тулд нэвтэрнэ үү.",
                );
                return;
              }
              router.push("/placement");
            }}
            className="px-5 py-3 rounded-full border-2 border-grass-100 bg-grass-50 text-grass-300 text-[14px] font-extrabold hover:bg-grass-100 transition-all">
            Түвшин тогтоох шалгалтыг дахин өгөх
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-6 xl:gap-8 mb-8">
          <div className="space-y-4">
            {gradeLessons.map((lesson, index) => {
              const meta = KIND_META[lesson.kind];
              const active = lesson.id === activeLesson.id;
              const done = completedLessons.includes(lesson.id);
              const locked = !isLoggedIn && lesson.id !== previewLessonId;

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    if (locked) {
                      handleLockedAction();
                      return;
                    }
                    setLesson(lesson.id);
                  }}
                  className={cn(
                    "w-full text-left bg-white border-2 rounded-[28px] p-5 transition-all relative",
                    locked
                      ? "border-paper-100 opacity-75"
                      : active
                        ? "border-sky-300 shadow-[0_10px_28px_rgba(26,107,189,.14)]"
                        : "border-paper-100 hover:border-sky-100 hover:-translate-y-0.5",
                  )}>
                  {locked && (
                    <span className="absolute right-4 top-4 inline-flex px-3 py-1 rounded-full bg-paper-100 text-ink-muted text-[11px] font-extrabold border border-paper-100">
                      🔒 Нэвтэрч үзнэ
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-[22px]",
                        active && !locked ? "bg-sky-50" : "bg-paper-50",
                      )}>
                      {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 rounded-full border text-[11px] font-extrabold",
                            meta.chip,
                          )}>
                          {meta.label}
                        </span>

                        <span className="text-[11px] font-bold text-ink-muted">
                          #{index + 1}
                        </span>

                        {!isLoggedIn && lesson.id === previewLessonId && (
                          <span className="inline-flex px-3 py-1 rounded-full bg-sand-50 text-sand-300 text-[11px] font-extrabold border border-sand-100">
                            Жишээ
                          </span>
                        )}

                        {done && (
                          <span className="inline-flex px-3 py-1 rounded-full bg-grass-50 text-grass-300 text-[11px] font-extrabold border border-grass-100">
                            ✓ Дууссан
                          </span>
                        )}
                      </div>

                      <p className="text-[18px] font-black text-ink leading-snug mb-2">
                        {lesson.title}
                      </p>

                      <p className="text-[13px] text-ink-muted font-semibold leading-relaxed">
                        {lesson.short}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white border-2 border-paper-100 rounded-[32px] p-6 lg:p-8 shadow-[0_10px_28px_rgba(22,28,45,.05)]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={cn(
                      "inline-flex px-3 py-1 rounded-full border text-[12px] font-extrabold",
                      KIND_META[activeLesson.kind].chip,
                    )}>
                    {KIND_META[activeLesson.kind].label}
                  </span>

                  <span className="inline-flex px-3 py-1 rounded-full bg-paper-50 text-ink-muted text-[12px] font-bold border border-paper-100">
                    {selectedGrade}-р анги
                  </span>

                  {!isLoggedIn && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-sand-50 text-sand-300 text-[12px] font-extrabold border border-sand-100">
                      Жишээ хичээл
                    </span>
                  )}

                  {completedLessons.includes(activeLesson.id) && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-grass-50 text-grass-300 text-[12px] font-extrabold border border-grass-100">
                      ✓ Дууссан
                    </span>
                  )}
                </div>

                <h2 className="text-[28px] lg:text-[34px] font-black tracking-[-0.03em] text-ink leading-tight">
                  {activeLesson.title}
                </h2>

                <p className="text-[15px] lg:text-[16px] text-ink-muted font-semibold mt-3 leading-relaxed max-w-[780px]">
                  {activeLesson.short}
                </p>
              </div>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    openAuthModal("Шалгалт өгөхийн тулд нэвтэрнэ үү.");
                    return;
                  }
                  startQuiz(
                    activeLesson.quiz,
                    true,
                    activeLesson.kind === "exam",
                    "normal",
                  );
                  router.push("/quiz");
                }}
                className={cn(
                  "shrink-0 px-6 py-4 rounded-[20px] text-[15px] lg:text-[16px] font-extrabold transition-all",
                  activeLesson.kind === "exam"
                    ? "bg-ember-300 text-white hover:opacity-90"
                    : "bg-sky-300 text-white hover:bg-sky-200",
                )}>
                {isLoggedIn
                  ? KIND_META[activeLesson.kind].button
                  : "Нэвтэрч үргэлжлүүлэх"}
              </button>
            </div>

            <div className="border-t border-paper-50 pt-6">
              <div
                className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:font-semibold prose-p:text-[#5f6787] prose-li:text-[#5f6787] prose-li:font-semibold prose-strong:text-[#1a1a2e]"
                dangerouslySetInnerHTML={{ __html: activeLesson.html }}
              />
            </div>
          </div>
        </div>

        <EmbeddedFlashcards />
      </div>
    </>
  );
}
