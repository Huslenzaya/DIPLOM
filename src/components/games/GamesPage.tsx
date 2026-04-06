"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { showToast } from "@/components/ui/Toast";
import {
  BALLOON_COLORS,
  getBalloonQuestionsByGrade,
  getFillBlanksByGrade,
  getMatchPairsByGrade,
  getSortSentencesByGrade,
  getSpeedRoundsByGrade,
  getWriteTargetsByGrade,
} from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

// =====================================================
// Types
// =====================================================

type GameId = "match" | "speed" | "write" | "sort" | "balloon" | "fillblank";

type MatchPair = {
  left: string;
  right: string;
  hint?: string;
};

type SpeedRound = {
  prompt: string;
  correct: string;
  wrong: string[];
  mode: "letter" | "word" | "rule" | "sentence";
  mg?: string | null;
};

type WriteTarget = {
  mg: string;
  r: string;
  guide: string;
  example?: string;
};

type SortSentence = {
  p: string[];
  a: string[];
  tr: string;
};

type BalloonQuestion = {
  q: string;
  correct: string;
  wrong: string[];
};

type FillBlankQuestion = {
  before: string;
  blank: string;
  after: string;
  choices: string[];
  c: number;
  tr: string;
};

type MatchCard = {
  id: string;
  value: string;
  pairKey: string;
};

// =====================================================
// Helpers
// =====================================================

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function recommendedGamesByGrade(grade: number): GameId[] {
  if (grade === 6) return ["match", "speed", "balloon"];
  if (grade === 7) return ["match", "balloon", "fillblank"];
  if (grade === 8) return ["speed", "write", "fillblank"];
  if (grade === 9) return ["sort", "fillblank", "speed"];
  if (grade === 10) return ["sort", "match", "fillblank"];
  if (grade === 11) return ["sort", "balloon", "fillblank"];
  return ["sort", "write", "fillblank"];
}

function gradeGameHint(grade: number) {
  if (grade === 6)
    return "6-р ангид үсэг таних, энгийн үг ялгах тоглоом илүү тохиромжтой.";
  if (grade === 7)
    return "7-р ангид дүрмийн анхан шат, зөв хувилбар сонгох тоглоом илүү тохиромжтой.";
  if (grade === 8)
    return "8-р ангид үйл үг, хэлбэр зүй, богино үг бичих тоглоом тохиромжтой.";
  if (grade === 9)
    return "9-р ангид өгүүлбэрийн ойлголт, уншлагын дараалалтай тоглоом илүү тохиромжтой.";
  if (grade === 10)
    return "10-р ангид уран уншлага, утга тайлбарлах чиглэлийн тоглоом илүү тохиромжтой.";
  if (grade === 11)
    return "11-р ангид соёл, уламжлал, нэр томьёотой холбоотой тоглоом илүү тохиромжтой.";
  return "12-р ангид хөрвүүлэг, найруулга, ахисан түвшний өгүүлбэртэй тоглоом илүү тохиромжтой.";
}

const GAME_META: {
  id: GameId;
  title: string;
  icon: string;
  desc: string;
  chip: string;
  color: string;
}[] = [
  {
    id: "match",
    title: "Тааруулах",
    icon: "🧩",
    desc: "Түвшиндээ тохирсон үг, ойлголт, ангиллыг тааруулна.",
    chip: "СУУРЬ",
    color: "sky",
  },
  {
    id: "speed",
    title: "Хурдны тест",
    icon: "⚡",
    desc: "Хурдан хугацаанд зөв хариултыг сонгоно.",
    chip: "ХУРД",
    color: "grass",
  },
  {
    id: "write",
    title: "Зурлага дагах",
    icon: "✍️",
    desc: "Үсэг, үг, ойлголтын хэлбэрийг дагаж бичнэ.",
    chip: "БИЧИХ",
    color: "sand",
  },
  {
    id: "sort",
    title: "Өгүүлбэр эвлүүлэх",
    icon: "🧠",
    desc: "Үгсийг зөв дараалалд оруулж өгүүлбэр бүтээнэ.",
    chip: "ӨГҮҮЛБЭР",
    color: "ember",
  },
  {
    id: "balloon",
    title: "Шаар хагалах",
    icon: "🎈",
    desc: "Зөв үг, зөв шаарыг сонгоно.",
    chip: "СОНГОХ",
    color: "purple",
  },
  {
    id: "fillblank",
    title: "Хоосон нөхөх",
    icon: "📝",
    desc: "Өгүүлбэрийн хоосон зайг зөвөөр нөхнө.",
    chip: "БАТАТГАХ",
    color: "teal",
  },
];

const CHIP_COLORS: Record<string, string> = {
  sky: "bg-sky-50 text-sky-300",
  grass: "bg-grass-50 text-grass-300",
  sand: "bg-sand-50 text-sand-300",
  ember: "bg-ember-50 text-ember-300",
  purple: "bg-[#f4f0ff] text-[#7c5cbf]",
  teal: "bg-[#e8faf7] text-[#1a9e8a]",
};

const BORDER_COLORS: Record<string, string> = {
  sky: "border-t-sky-300",
  grass: "border-t-grass-300",
  sand: "border-t-sand-300",
  ember: "border-t-ember-300",
  purple: "border-t-[#7c5cbf]",
  teal: "border-t-[#1a9e8a]",
};

// =====================================================
// Main page
// =====================================================

export function GamesPage() {
  const { selectedGrade, isLoggedIn, openAuthModal } = useAppStore();
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const recommended = new Set(recommendedGamesByGrade(selectedGrade));
  const guestPreviewGame: GameId = "match";

  if (activeGame === "match") {
    return <MatchGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "speed") {
    return <SpeedGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "write") {
    return <WriteGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "sort") {
    return <SortGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "balloon") {
    return <BalloonGame onBack={() => setActiveGame(null)} />;
  }
  if (activeGame === "fillblank") {
    return <FillBlankGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="app-shell max-w-[1200px] mx-auto px-6 py-8 lg:py-10">
      {!isLoggedIn && (
        <div className="mb-6 bg-sand-50 border-2 border-sand-100 rounded-[24px] px-5 py-4">
          <p className="text-[12px] font-extrabold text-sand-300 uppercase tracking-[0.5px] mb-1.5">
            Guest preview
          </p>
          <p className="text-[14px] text-[#7c6435] font-semibold leading-relaxed">
            Та одоогоор зөвхөн 1 жишээ тоглоом тоглож байна. Бусад тоглоомыг
            нээхийн тулд нэвтэрнэ үү.
          </p>
        </div>
      )}

      <div className="mb-7">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <p className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] text-ink">
              Тоглоом
            </p>
            <p className="text-[15px] lg:text-[17px] text-ink-muted font-semibold mt-2 leading-relaxed max-w-[760px]">
              6 тоглоом бүгд харагдана. Харин тоглоом бүрийн доторх агуулга таны
              сонгосон ангиас хамааран өөрчлөгдөнө.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
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
                Нийт тоглоом
              </p>
              <p className="text-[24px] font-black text-grass-300 mt-1">6</p>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-sky-50 border-2 border-sky-100 rounded-[24px] px-5 py-4">
          <p className="text-[12px] font-extrabold text-sky-300 uppercase tracking-[0.5px] mb-1.5">
            Таны түвшинд тохирох тоглоом
          </p>
          <p className="text-[14px] text-[#5f6787] font-semibold leading-relaxed">
            {gradeGameHint(selectedGrade)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
        {GAME_META.map((g) => {
          const locked = !isLoggedIn && g.id !== guestPreviewGame;

          return (
            <button
              key={g.id}
              onClick={() => {
                if (locked) {
                  openAuthModal("Бусад тоглоомыг тоглохын тулд нэвтэрнэ үү.");
                  return;
                }
                setActiveGame(g.id);
              }}
              className={cn(
                "bg-white border-[2.5px] border-paper-100 border-t-4 rounded-[30px] p-7 lg:p-8 text-left transition-all duration-200 relative",
                BORDER_COLORS[g.color],
                locked
                  ? "opacity-75"
                  : "hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(22,28,45,.08)]",
              )}>
              {locked && (
                <span className="absolute right-5 top-5 inline-flex px-3 py-1.5 rounded-full bg-paper-100 text-ink-muted text-[11px] font-extrabold border border-paper-100">
                  🔒 Нэвтэрч нээнэ
                </span>
              )}

              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[42px] lg:text-[48px] block">
                  {g.icon}
                </span>

                {!locked && recommended.has(g.id) && (
                  <span className="inline-flex px-3 py-1.5 rounded-full bg-grass-50 text-grass-300 text-[11px] font-extrabold border border-grass-100">
                    Санал болгох
                  </span>
                )}

                {!isLoggedIn && g.id === guestPreviewGame && (
                  <span className="inline-flex px-3 py-1.5 rounded-full bg-sand-50 text-sand-300 text-[11px] font-extrabold border border-sand-100">
                    Жишээ
                  </span>
                )}
              </div>

              <p className="text-[22px] lg:text-[26px] font-black mb-2 text-ink">
                {g.title}
              </p>

              <p className="text-[14px] lg:text-[15px] text-ink-muted font-semibold leading-relaxed mb-4">
                {g.desc}
              </p>

              <span
                className={cn(
                  "inline-flex text-[11px] lg:text-[12px] font-extrabold tracking-[0.5px] uppercase px-3.5 py-1.5 rounded-full",
                  CHIP_COLORS[g.color],
                )}>
                {g.chip}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =====================================================
// Shared
// =====================================================

function GameWrapper({
  title,
  sub,
  onBack,
  children,
}: {
  title: string;
  sub?: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell max-w-[980px] mx-auto px-6 py-10 lg:py-14">
      <button
        onClick={onBack}
        className="bg-white border-2 border-paper-100 text-[14px] lg:text-[15px] font-extrabold px-4 py-2.5 rounded-[16px] hover:border-sky-100 hover:bg-sky-50 transition-all mb-4">
        ← Буцах
      </button>

      <p className="text-[30px] lg:text-[36px] font-black tracking-[-0.03em] mb-2 text-ink">
        {title}
      </p>

      {sub && (
        <p className="text-[16px] lg:text-[18px] text-ink-muted font-semibold mb-6 lg:mb-7 leading-relaxed">
          {sub}
        </p>
      )}

      {children}
    </div>
  );
}

function ScoreBar({
  items,
}: {
  items: { label: string; value: string | number; color?: string }[];
}) {
  return (
    <div className="flex justify-between bg-white border-2 border-paper-100 rounded-[26px] px-6 lg:px-8 py-4 lg:py-5 mb-6 lg:mb-7 gap-4">
      {items.map(({ label, value, color }) => (
        <div key={label} className="text-center flex-1">
          <p
            className={cn(
              "text-[24px] lg:text-[30px] font-black",
              color ?? "text-sky-300",
            )}>
            {value}
          </p>
          <p className="text-[12px] lg:text-[13px] font-bold text-ink-muted mt-1">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// Match
// =====================================================

function MatchGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const pairs = useMemo(
    () => getMatchPairsByGrade(selectedGrade) as MatchPair[],
    [selectedGrade],
  );

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  function init() {
    const raw: MatchCard[] = [];

    pairs.forEach((p, i) => {
      raw.push({
        id: `l-${i}`,
        value: p.left,
        pairKey: `p-${i}`,
      });
      raw.push({
        id: `r-${i}`,
        value: p.right,
        pairKey: `p-${i}`,
      });
    });

    setCards(shuffleArray(raw));
    setSelected(null);
    setMatched([]);
    setWrong([]);
    setScore(0);
  }

  useEffect(() => {
    init();
  }, [selectedGrade]);

  function clickCard(card: MatchCard) {
    if (matched.includes(card.id) || wrong.includes(card.id)) return;

    if (!selected) {
      setSelected(card.id);
      return;
    }

    if (selected === card.id) {
      setSelected(null);
      return;
    }

    const selectedCard = cards.find((c) => c.id === selected);
    if (!selectedCard) return;

    if (selectedCard.pairKey === card.pairKey) {
      setMatched((prev) => [...prev, selectedCard.id, card.id]);
      setScore((s) => s + 1);
      showToast("Таарууллаа", "ok");
    } else {
      setWrong([selectedCard.id, card.id]);
      showToast("Буруу тааруулалт", "bad");
      setTimeout(() => setWrong([]), 600);
    }

    setSelected(null);
  }

  const remaining = pairs.length - score;

  return (
    <GameWrapper
      title="Тааруулах тоглоом"
      sub={`${selectedGrade}-р ангид тохирсон ойлголтуудыг хооронд нь зөв тааруулна.`}
      onBack={onBack}>
      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Үлдсэн", value: remaining, color: "text-grass-300" },
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const isMatched = matched.includes(card.id);
          const isSelected = selected === card.id;
          const isWrong = wrong.includes(card.id);

          return (
            <button
              key={card.id}
              onClick={() => clickCard(card)}
              className={cn(
                "min-h-[110px] rounded-[22px] border-[2.5px] p-4 text-center font-extrabold text-[16px] transition-all",
                isMatched && "bg-grass-50 border-grass-300 text-grass-300",
                isSelected && "bg-sky-50 border-sky-300 text-sky-300",
                isWrong &&
                  "bg-ember-50 border-ember-300 text-ember-300 animate-wobble",
                !isMatched &&
                  !isSelected &&
                  !isWrong &&
                  "bg-white border-paper-100 text-ink hover:border-sky-100 hover:bg-sky-50",
              )}>
              {card.value}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={init}
          className="bg-sky-300 text-white font-extrabold text-[15px] lg:text-[16px] px-7 py-3.5 rounded-[18px] hover:bg-sky-200 transition-all">
          Дахин эхлэх
        </button>
      </div>
    </GameWrapper>
  );
}

// =====================================================
// Speed
// =====================================================

function SpeedGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const rounds = useMemo(
    () => getSpeedRoundsByGrade(selectedGrade) as SpeedRound[],
    [selectedGrade],
  );

  const [idx, setIdx] = useState(0);
  const [opts, setOpts] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(100);

  const current = rounds[idx % rounds.length];

  useEffect(() => {
    if (!current) return;
    setOpts(shuffleArray([current.correct, ...current.wrong]));
    setPicked(null);
    setTimeLeft(100);
  }, [idx, current]);

  useEffect(() => {
    if (!current || picked) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 2) {
          clearInterval(t);
          showToast("⏱️ Хугацаа дууслаа", "bad");
          setTimeout(() => setIdx((i) => i + 1), 700);
          return 0;
        }
        return prev - 2;
      });
    }, 80);

    return () => clearInterval(t);
  }, [idx, current, picked]);

  function answer(opt: string) {
    if (picked) return;

    setPicked(opt);

    if (opt === current.correct) {
      setScore((s) => s + 1);
      showToast("Зөв", "ok");
    } else {
      showToast("Буруу", "bad");
    }

    setTimeout(() => setIdx((i) => i + 1), 700);
  }

  if (!current) return null;

  return (
    <GameWrapper
      title="⚡ Хурдны тест"
      sub={`${selectedGrade}-р ангид тохирсон хурдан сонгох дасгал.`}
      onBack={onBack}>
      <div className="h-3 bg-paper-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-[80ms]"
          style={{
            width: `${timeLeft}%`,
            background: "linear-gradient(90deg,#e84848,#f0a030)",
          }}
        />
      </div>

      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Раунд", value: idx + 1, color: "text-grass-300" },
        ]}
      />

      {current.mg && (
        <div className="flex justify-center mb-6">
          <div className="bg-white border-2 border-paper-100 rounded-[26px] px-7 py-6 inline-flex shadow-sm">
            <MongolianText size="xl" color="#c97b2a">
              {current.mg}
            </MongolianText>
          </div>
        </div>
      )}

      <p className="text-[24px] lg:text-[28px] font-extrabold text-center text-ink mb-7">
        {current.prompt}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {opts.map((opt) => {
          const isCorrect = picked && opt === current.correct;
          const isWrong = picked === opt && opt !== current.correct;

          return (
            <button
              key={opt}
              onClick={() => answer(opt)}
              disabled={!!picked}
              className={cn(
                "bg-white border-[2.5px] rounded-[24px] py-7 px-5 min-h-[120px] text-[16px] font-bold transition-all shadow-sm",
                !picked &&
                  "border-paper-100 hover:border-sky-100 hover:bg-sky-50",
                isCorrect && "border-grass-300 bg-grass-50 text-grass-300",
                isWrong && "border-ember-300 bg-ember-50 text-ember-300",
              )}>
              {opt}
            </button>
          );
        })}
      </div>
    </GameWrapper>
  );
}

// =====================================================
// Write
// =====================================================

function WriteGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const targets = useMemo(
    () => getWriteTargetsByGrade(selectedGrade) as WriteTarget[],
    [selectedGrade],
  );

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  const current = targets[idx % targets.length];

  useEffect(() => {
    clearCanvas();
  }, [idx, selectedGrade]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1a6bbd";
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * e.currentTarget.width,
      y: ((e.clientY - rect.top) / rect.height) * e.currentTarget.height,
    };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function onUp() {
    setDrawing(false);
  }

  function doneWriting() {
    setScore((s) => s + 1);
    showToast("Дасгалаа хийлээ", "ok");
    setIdx((i) => i + 1);
  }

  if (!current) return null;

  return (
    <GameWrapper
      title="Зурлага дагах"
      sub={`${selectedGrade}-р ангид тохирсон үсэг, үг, ойлголтыг дагаж бичнэ.`}
      onBack={onBack}>
      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Раунд", value: idx + 1, color: "text-grass-300" },
          {
            label: "Түвшин",
            value: `${selectedGrade}-р анги`,
            color: "text-sand-300",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 items-start">
        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-6 flex flex-col items-center text-center">
          <p className="text-[12px] uppercase tracking-[0.08em] font-extrabold text-ink-muted mb-4">
            Дагах агуулга
          </p>

          <MongolianText size="xl" color="#c97b2a">
            {current.mg}
          </MongolianText>

          <p className="text-[16px] font-extrabold text-ink mt-4">
            {current.r}
          </p>

          {current.example && (
            <p className="text-[13px] text-ink-muted font-semibold mt-2">
              Жишээ: {current.example}
            </p>
          )}

          <div className="mt-4 bg-sand-50 border-2 border-sand-100 rounded-[20px] p-4">
            <p className="text-[13px] text-[#6f5b30] font-semibold leading-relaxed">
              {current.guide}
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-4">
          <canvas
            ref={canvasRef}
            width={820}
            height={420}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className="w-full h-[320px] lg:h-[380px] rounded-[20px] bg-white border-2 border-dashed border-paper-100 touch-none"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-6 flex-wrap">
        <button
          onClick={clearCanvas}
          className="bg-white border-2 border-paper-100 text-[15px] lg:text-[16px] font-extrabold px-6 py-3.5 rounded-[18px] hover:border-sky-100 transition-all">
          Цэвэрлэх
        </button>
        <button
          onClick={doneWriting}
          className="bg-sky-300 text-white font-extrabold text-[15px] lg:text-[16px] px-7 py-3.5 rounded-[18px] hover:bg-sky-200 transition-all">
          Дуусгах
        </button>
      </div>
    </GameWrapper>
  );
}

// =====================================================
// Sort
// =====================================================

function SortGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const source = useMemo(
    () => getSortSentencesByGrade(selectedGrade) as SortSentence[],
    [selectedGrade],
  );

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [placed, setPlaced] = useState<string[]>([]);

  const current = source[idx % source.length];

  useEffect(() => {
    if (!current) return;
    setPool(shuffleArray([...current.p]));
    setPlaced([]);
  }, [idx, current]);

  function moveToPlaced(word: string, i: number) {
    setPool((prev) => prev.filter((_, index) => index !== i));
    setPlaced((prev) => [...prev, word]);
  }

  function moveBack(word: string, i: number) {
    setPlaced((prev) => prev.filter((_, index) => index !== i));
    setPool((prev) => [...prev, word]);
  }

  function checkAnswer() {
    const ok = JSON.stringify(placed) === JSON.stringify(current.a);
    if (ok) {
      setScore((s) => s + 10);
      showToast("Зөв дараалал", "ok");
    } else {
      showToast("Дахин оролдоно уу", "bad");
    }
  }

  if (!current) return null;

  return (
    <GameWrapper
      title="Өгүүлбэр эвлүүлэх"
      sub={`${selectedGrade}-р ангид тохирсон өгүүлбэрийн дасгал.`}
      onBack={onBack}>
      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Раунд", value: idx + 1, color: "text-grass-300" },
        ]}
      />

      <div className="bg-white border-2 border-paper-100 rounded-[28px] p-5 lg:p-6 mb-5">
        <p className="text-[12px] font-extrabold text-ink-muted uppercase tracking-[0.5px] mb-2">
          Зорилго
        </p>
        <p className="text-[15px] lg:text-[16px] font-semibold text-ink">
          {current.tr}
        </p>
      </div>

      <p className="text-[11px] font-extrabold text-ink-muted uppercase tracking-[0.3px] mb-2">
        Дараалал
      </p>
      <div className="min-h-[78px] p-3.5 flex flex-wrap gap-2 justify-center border-[2.5px] border-dashed border-paper-100 bg-paper-50 rounded-2xl mb-5">
        {placed.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => moveBack(word, i)}
            className="px-4 py-2.5 rounded-2xl border-2 bg-sky-50 border-sky-100 hover:bg-sky-100 transition-all">
            <span className="text-[14px] lg:text-[15px] font-extrabold text-ink">
              {word}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[11px] font-extrabold text-ink-muted uppercase tracking-[0.3px] mb-2">
        Үгсийн сан
      </p>
      <div className="min-h-[78px] p-3.5 flex flex-wrap gap-2 justify-center border-[2.5px] border-dashed border-paper-100 bg-paper-50 rounded-2xl mb-5">
        {pool.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => moveToPlaced(word, i)}
            className="px-4 py-2.5 rounded-2xl border-2 bg-white border-paper-100 hover:border-sky-100 transition-all">
            <span className="text-[14px] lg:text-[15px] font-extrabold text-ink">
              {word}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => setIdx((i) => i + 1)}
          className="bg-white border-2 border-paper-100 text-[15px] lg:text-[16px] font-extrabold px-6 py-3.5 rounded-[18px] hover:border-sky-100 transition-all">
          Шинэ өгүүлбэр
        </button>
        <button
          onClick={checkAnswer}
          className="bg-sky-300 text-white font-extrabold text-[15px] lg:text-[16px] px-7 py-3.5 rounded-[18px] hover:bg-sky-200 transition-all">
          Шалгах
        </button>
      </div>
    </GameWrapper>
  );
}

// =====================================================
// Balloon
// =====================================================

type BalloonItem = {
  id: number;
  text: string;
  correct: boolean;
  left: number;
  dur: number;
  color: string;
};

function BalloonGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const source = useMemo(
    () => getBalloonQuestionsByGrade(selectedGrade) as BalloonQuestion[],
    [selectedGrade],
  );

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [popped, setPopped] = useState<number[]>([]);
  const idRef = useRef(0);

  const current = source[idx % source.length];

  useEffect(() => {
    if (!current) return;
    const items = shuffleArray([current.correct, ...current.wrong.slice(0, 4)]);
    const generated: BalloonItem[] = items.map((text, i) => ({
      id: ++idRef.current,
      text,
      correct: text === current.correct,
      left: 8 + i * 18,
      dur: 3.5 + Math.random() * 2,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    }));
    setBalloons(generated);
    setPopped([]);
  }, [idx, current]);

  function popBalloon(item: BalloonItem) {
    if (popped.includes(item.id)) return;

    setPopped((prev) => [...prev, item.id]);

    if (item.correct) {
      setScore((s) => s + 10);
      showToast("Зөв!", "ok");
      setTimeout(() => setIdx((i) => i + 1), 600);
    } else {
      showToast("Буруу шаар", "bad");
    }
  }

  if (!current) return null;

  return (
    <GameWrapper
      title="Шаар хагалах"
      sub={`${selectedGrade}-р ангид тохирсон зөв хариултыг сонгоно.`}
      onBack={onBack}>
      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Раунд", value: idx + 1, color: "text-grass-300" },
        ]}
      />

      <div className="bg-white border-2 border-paper-100 rounded-[24px] px-5 py-3 mb-4">
        <p className="text-[15px] lg:text-[16px] font-extrabold text-ink text-center">
          {current.q}
        </p>
      </div>

      <div
        className="relative h-[320px] overflow-hidden rounded-2xl border-2 border-paper-100"
        style={{
          background: "linear-gradient(180deg,#e8f3ff 0%,#f5f0e8 100%)",
        }}>
        {balloons.map(
          (b) =>
            !popped.includes(b.id) && (
              <button
                key={b.id}
                onClick={() => popBalloon(b)}
                className="absolute balloon-rise"
                style={{
                  left: `${b.left}%`,
                  animationDuration: `${b.dur}s`,
                }}>
                <div
                  className="w-[66px] h-[84px] rounded-[50%] flex items-center justify-center text-[10px] font-black text-white text-center px-2 shadow-[0_6px_18px_rgba(0,0,0,.16)]"
                  style={{ background: b.color }}>
                  {b.text}
                </div>
                <div className="w-[2px] h-[24px] bg-black/20 mx-auto" />
              </button>
            ),
        )}
      </div>
    </GameWrapper>
  );
}

// =====================================================
// Fill blank
// =====================================================

function FillBlankGame({ onBack }: { onBack: () => void }) {
  const { selectedGrade } = useAppStore();
  const source = useMemo(
    () => getFillBlanksByGrade(selectedGrade) as FillBlankQuestion[],
    [selectedGrade],
  );

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const current = source[idx % source.length];

  function answer(choiceIdx: number) {
    if (picked !== null) return;
    setPicked(choiceIdx);

    if (choiceIdx === current.c) {
      setScore((s) => s + 10);
      showToast("Зөв", "ok");
    } else {
      showToast("Буруу", "bad");
    }

    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 700);
  }

  if (!current) return null;

  return (
    <GameWrapper
      title="Хоосон нөхөх"
      sub={`${selectedGrade}-р ангид тохирсон өгүүлбэрийн нөхөх дасгал.`}
      onBack={onBack}>
      <ScoreBar
        items={[
          { label: "Оноо", value: score, color: "text-sky-300" },
          { label: "Раунд", value: idx + 1, color: "text-grass-300" },
        ]}
      />

      <div className="bg-white border-2 border-paper-100 rounded-[28px] p-6 lg:p-7 mb-5 text-center">
        <p className="text-[18px] lg:text-[20px] font-bold text-ink leading-[2]">
          {current.before}{" "}
          <span className="inline-flex min-w-[110px] justify-center px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-300 font-black">
            _____
          </span>{" "}
          {current.after}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {current.choices.map((choice, i) => {
          const isCorrect = picked !== null && i === current.c;
          const isWrong = picked === i && i !== current.c;

          return (
            <button
              key={`${choice}-${i}`}
              onClick={() => answer(i)}
              disabled={picked !== null}
              className={cn(
                "bg-white border-[2.5px] rounded-[22px] p-5 min-h-[110px] transition-all",
                picked === null &&
                  "border-paper-100 hover:border-sky-100 hover:bg-sky-50",
                isCorrect && "border-grass-300 bg-grass-50 text-grass-300",
                isWrong && "border-ember-300 bg-ember-50 text-ember-300",
              )}>
              <span className="text-[16px] font-extrabold">{choice}</span>
            </button>
          );
        })}
      </div>
    </GameWrapper>
  );
}
