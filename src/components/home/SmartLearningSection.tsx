"use client";

import { Mascot } from "@/components/ui/Mascot";
import { useRouter } from "next/navigation";

const dailyChallenge = {
  letter: "ᠠ",
  word: "ᠭᠡᠷ",
  quiz: "3 асуулттай богино сорил",
  task: "Өнөөдөр 1 минут уншаарай",
};

const mistakeDictionary = {
  letters: ["ᠠ", "ᠡ", "ᠣ"],
  words: ["гэр", "сургууль", "ном"],
  rules: ["Эгшгийн зохицол", "Нөхцөл залгавар"],
};

const recommendedPractice = {
  lesson: "Эгшгийн зохицол",
  quiz: "5 асуулттай мини сорил",
  game: "Зөв залгавар сонгох",
  reading: "Богино уншлага",
};

function SectionCard({
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-[28px] border-2 border-paper-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(22,28,45,.06)] lg:p-6">
      <p className="text-[13px] font-black uppercase tracking-[0.08em] text-sky-300">
        {subtitle}
      </p>
      <h3 className="mt-2 text-[22px] font-black tracking-[-0.02em] text-ink">
        {title}
      </h3>

      <div className="mt-4">{children}</div>

      <button
        onClick={onAction}
        className="mt-5 inline-flex rounded-[16px] bg-sky-300 px-4 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-sky-200">
        {actionLabel}
      </button>
    </div>
  );
}

export function SmartLearningSection() {
  const router = useRouter();

  return (
    <section className="app-shell pb-16 lg:pb-20">
      <div className="mb-6 rounded-[30px] border-2 border-sky-100 bg-gradient-to-r from-sky-50 via-white to-sky-50 p-5 lg:p-6">
        <div className="flex items-center gap-4">
          <Mascot mood="happy" mode="guide" size={82} showBubble={false} />

          <div>
            <p className="text-[13px] font-black uppercase tracking-[0.08em] text-sky-300">
              Ухаалаг суралцах хэсэг
            </p>
            <h2 className="mt-1 text-[24px] font-black tracking-[-0.03em] text-ink lg:text-[30px]">
              Чамд тохирсон давтлага эндээс эхэлнэ
            </h2>
            <p className="mt-2 max-w-[760px] text-[14px] font-semibold leading-6 text-ink-muted lg:text-[15px]">
              Систем чиний алдаа, сул тал, давтах шаардлагатай агуулгыг нэгтгээд
              өдөр тутмын сорил болон тусгай давтлага санал болгоно.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCard
          title="Өдөр тутмын сорил"
          subtitle="Daily"
          actionLabel="Өнөөдрийн сорил эхлэх"
          onAction={() => router.push("/quiz")}>
          <div className="space-y-3">
            <div className="rounded-[18px] bg-sky-50 px-4 py-3">
              <p className="text-[13px] font-black text-sky-300">
                Өнөөдрийн үсэг
              </p>
              <p className="mt-1 text-[24px] font-black text-ink">
                {dailyChallenge.letter}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[13px] font-black text-ink-muted">
                Өнөөдрийн үг
              </p>
              <p className="mt-1 text-[16px] font-extrabold text-ink">
                {dailyChallenge.word}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">
                {dailyChallenge.quiz}
              </p>
              <p className="mt-1 text-[14px] font-semibold text-ink-muted">
                {dailyChallenge.task}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Миний алдааны толь"
          subtitle="Mistakes"
          actionLabel="Дэлгэрэнгүй үзэх"
          onAction={() => router.push("/profile")}>
          <div className="space-y-3">
            <div className="rounded-[18px] bg-amber-50 px-4 py-3">
              <p className="text-[13px] font-black text-amber-700">
                Би андуурдаг үсгүүд
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {mistakeDictionary.letters.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-1 text-[14px] font-extrabold text-ink">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[13px] font-black text-ink-muted">
                Би алддаг үгс
              </p>
              <p className="mt-2 text-[14px] font-semibold leading-6 text-ink">
                {mistakeDictionary.words.join(", ")}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[13px] font-black text-ink-muted">
                Би сул дүрмүүд
              </p>
              <p className="mt-2 text-[14px] font-semibold leading-6 text-ink">
                {mistakeDictionary.rules.join(", ")}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Надад зориулсан давтлага"
          subtitle="Recommended"
          actionLabel="Давтлага эхлэх"
          onAction={() => router.push("/lessons")}>
          <div className="space-y-3">
            <div className="rounded-[18px] bg-grass-50 px-4 py-3">
              <p className="text-[13px] font-black text-grass-300">
                Mini lesson
              </p>
              <p className="mt-1 text-[15px] font-extrabold text-ink">
                {recommendedPractice.lesson}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">
                Mini quiz: {recommendedPractice.quiz}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">
                Game: {recommendedPractice.game}
              </p>
            </div>

            <div className="rounded-[18px] bg-paper-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">
                Reading: {recommendedPractice.reading}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
