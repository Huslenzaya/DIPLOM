"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STEPS = [
  {
    icon: "🏹",
    title: "Монгол Бичигт тавтай морил!",
    sub: "Эртний тэнгэрлэг бичгийг орчин үеийн, хөгжилтэй аргаар эзэмш.\n6–12-р ангийн хүүхэд бүрт зориулсан.",
    content: (
      <div className="flex flex-col gap-4 mb-8">
        {[
          {
            icon: "",
            t: "Хичээл",
            s: "Дүрэм, түвшин, шалгалт — бүгд нэг дор",
          },
          {
            icon: "",
            t: "6 хөгжилтэй тоглоом",
            s: "Тааруулах, хурд, шаар, дүүргэх...",
          },
          { icon: "", t: "Толь бичиг", s: "Үсэг болон үгийн сан нэг дор" },
          {
            icon: "",
            t: "Түвшин тогтоох шалгалт",
            s: "Автоматаар таны түвшинг тодорхойлно",
          },
        ].map(({ icon, t, s }) => (
          <div
            key={t}
            className="flex items-center gap-4 bg-white border-2 border-paper-100 rounded-[24px] p-5 lg:p-6 shadow-sm">
            <span className="text-[26px] w-10 text-center shrink-0">
              {icon}
            </span>
            <div>
              <p className="text-[16px] lg:text-[17px] font-extrabold text-ink">
                {t}
              </p>
              <p className="text-[14px] lg:text-[15px] text-ink-muted font-semibold mt-1 leading-relaxed">
                {s}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "",
    title: "Тоглоомын дүрэм",
    sub: "Оноо хэрхэн тооцогдох, алдвал яах талаар мэд",
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: "",
            t: "5 амь",
            d: "Буруу хариулт бүр нэг амь хасна. 0 болвол тухайн тоглоом дуусна.",
            c: "border-t-sky-300",
          },
          {
            icon: "",
            t: "Streak",
            d: "Өдөр бүр суралцвал streak нэмэгдэнэ. Тасарвал дахин эхлэнэ.",
            c: "border-t-grass-300",
          },
          {
            icon: "",
            t: "Оноо",
            d: "Зөв хариулт бүр +10 оноо. Хурдан хариулвал бонус нэмэгдэнэ.",
            c: "border-t-sand-300",
          },
          {
            icon: "",
            t: "Зөвлөмж",
            d: "Шалгалтын үед 💡 дарж дүрмийн хуудас харж болно.",
            c: "border-t-ember-300",
          },
        ].map(({ icon, t, d, c }) => (
          <div
            key={t}
            className={`bg-white border-2 border-paper-100 border-t-4 rounded-[24px] p-5 lg:p-6 shadow-sm ${c}`}>
            <p className="text-[24px] lg:text-[28px] mb-3">{icon}</p>
            <p className="text-[15px] lg:text-[16px] font-extrabold mb-2 text-ink">
              {t}
            </p>
            <p className="text-[13px] lg:text-[14px] text-ink-muted font-semibold leading-relaxed">
              {d}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "",
    title: "Алдаа дутагдлаа ойлго",
    sub: "Ямар тоглоомд ямар алдаа хийвэл юу болохыг мэд",
    content: (
      <div className="flex flex-col gap-4 mb-8">
        {[
          {
            icon: "",
            t: "Тааруулах — буруу тааруулбал",
            s: "Алдааны тоо +1, картнууд улаан болно",
          },
          {
            icon: "⚡",
            t: "Хурдны тест — хугацаа дуусвал",
            s: "Дараагийн үсэг рүү шилжинэ, оноо нэмэгдэхгүй",
          },
          {
            icon: "🎈",
            t: "Шаар — буруу шаар хагалбал",
            s: "Амь хасагдана — зөв хариулттайг сонго!",
          },
          {
            icon: "",
            t: "Шалгалтад буруу хариулвал",
            s: "Зөв хариулт харагдана + зөвлөмж нэвтэрнэ",
          },
        ].map(({ icon, t, s }) => (
          <div
            key={t}
            className="flex items-center gap-4 bg-white border-2 border-paper-100 rounded-[24px] p-5 lg:p-6 shadow-sm">
            <span className="text-[26px] w-10 text-center shrink-0">
              {icon}
            </span>
            <div>
              <p className="text-[16px] lg:text-[17px] font-extrabold text-ink">
                {t}
              </p>
              <p className="text-[14px] lg:text-[15px] text-ink-muted font-semibold mt-1 leading-relaxed">
                {s}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: "",
    title: "Түвшингоо тогтоо!",
    sub: "12 асуулт хариулж таны одоогийн мэдлэгийг шалгана.",
    content: (
      <div className="flex flex-col gap-4 mb-8">
        {[
          {
            icon: "⏱",
            t: "~3 минут",
            s: "Үсэг таних → Үгийн утга → Нөхцөл → Өгүүлбэр",
          },
          {
            icon: "",
            t: "Дүн шинжилгээ",
            s: "Ангилал бүрийн мэдлэгийг тусад нь харуулна",
          },
        ].map(({ icon, t, s }) => (
          <div
            key={t}
            className="flex items-center gap-4 bg-white border-2 border-paper-100 rounded-[24px] p-5 lg:p-6 shadow-sm">
            <span className="text-[26px] w-10 text-center shrink-0">
              {icon}
            </span>
            <div>
              <p className="text-[16px] lg:text-[17px] font-extrabold text-ink">
                {t}
              </p>
              <p className="text-[14px] lg:text-[15px] text-ink-muted font-semibold mt-1 leading-relaxed">
                {s}
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="app-shell max-w-[760px] mx-auto px-6 py-10 lg:py-14 animate-fade-up">
      <div className="flex justify-center gap-2.5 mb-8 lg:mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === step
                ? "w-8 bg-sky-300"
                : i < step
                  ? "w-3 bg-sky-200"
                  : "w-3 bg-paper-100"
            }`}
          />
        ))}
      </div>

      <div className="text-[62px] lg:text-[72px] text-center mb-4 lg:mb-5">
        {s.icon}
      </div>

      <h2 className="text-[32px] lg:text-[38px] font-black text-center tracking-[-0.03em] mb-3 text-ink">
        {s.title}
      </h2>

      <p className="text-[16px] lg:text-[18px] text-ink-muted text-center font-semibold leading-[1.8] mb-8 whitespace-pre-line max-w-[640px] mx-auto">
        {s.sub}
      </p>

      {s.content}

      <div className="flex gap-3 lg:gap-4">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="bg-white border-2 border-paper-100 text-ink font-extrabold text-[15px] lg:text-[16px] px-6 lg:px-7 py-4 rounded-[20px] hover:border-sky-100 transition-all">
            ← Буцах
          </button>
        )}

        {isLast ? (
          <div className="flex flex-col gap-3 flex-1">
            <button
              onClick={() => router.push("/placement")}
              className="w-full bg-sky-300 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 hover:bg-sky-200 transition-all shadow-sm">
              Шалгалт өгч эхлэх
            </button>
            <button
              onClick={() => router.push("/lessons")}
              className="w-full bg-white border-2 border-paper-100 text-ink font-extrabold text-[15px] lg:text-[16px] rounded-[20px] py-4 hover:border-sky-100 transition-all text-center">
              Шалгалтгүйгээр эхлэх
            </button>
          </div>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 bg-sky-300 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 hover:bg-sky-200 transition-all shadow-sm">
            Үргэлжлүүлэх →
          </button>
        )}
      </div>
    </div>
  );
}
