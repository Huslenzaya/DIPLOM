"use client";

import { Mascot } from "@/components/ui/Mascot";

const twin = {
  type: "Үсэг андуурагч",
  description:
    "Чи үсэг таних хэсэгт ижил дүрстэй үсгүүдийг андуурах хандлагатай байна. Тиймээс үсгийн давтлага чамд хамгийн их тохирно.",
  strengths: [
    "Уншлагын даалгаварт тогтвортой",
    "Үгийг таних чадвар сайжирч байна",
  ],
  focus: ["Үсэг ялгах дасгал", "Андуурдаг үсгийн карт", "Богино сорил"],
};

export function WritingTwinCard() {
  return (
    <div className="rounded-[28px] border-2 border-paper-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center gap-4">
        <Mascot mood="neutral" mode="guide" size={78} showBubble={false} />

        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.08em] text-sky-300">
            Миний бичгийн ихэр
          </p>
          <h3 className="mt-1 text-[24px] font-black tracking-[-0.02em] text-ink">
            {twin.type}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-[15px] font-semibold leading-7 text-ink-muted">
        {twin.description}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[20px] bg-sky-50 px-4 py-4">
          <p className="text-[13px] font-black uppercase tracking-[0.06em] text-sky-300">
            Давуу тал
          </p>
          <div className="mt-3 space-y-2">
            {twin.strengths.map((item) => (
              <p key={item} className="text-[14px] font-semibold text-ink">
                • {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] bg-amber-50 px-4 py-4">
          <p className="text-[13px] font-black uppercase tracking-[0.06em] text-amber-700">
            Анхаарах хэсэг
          </p>
          <div className="mt-3 space-y-2">
            {twin.focus.map((item) => (
              <p key={item} className="text-[14px] font-semibold text-ink">
                • {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
