"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { ARTICLES } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

export function ReadingPage() {
  const { selectedGrade, isLoggedIn, openAuthModal } = useAppStore();
  const [current, setCurrent] = useState(0);

  const filteredArticles = useMemo(() => {
    const byGrade = ARTICLES.filter((a) =>
      a.t.startsWith(`${selectedGrade}-р анги`),
    );

    return byGrade.length ? byGrade : ARTICLES;
  }, [selectedGrade]);

  useEffect(() => {
    setCurrent(0);
  }, [selectedGrade]);

  useEffect(() => {
    if (!isLoggedIn && current !== 0) {
      setCurrent(0);
    }
  }, [isLoggedIn, current]);

  const article = filteredArticles[current];

  if (!article) {
    return (
      <div className="app-shell max-w-[1200px] mx-auto px-6 py-10">
        <div className="bg-white border-2 border-paper-100 rounded-[28px] p-8">
          <p className="text-[24px] font-black text-ink mb-2">
            Уншлагын агуулга олдсонгүй
          </p>
          <p className="text-[15px] text-ink-muted font-semibold">
            Энэ ангид хараахан уншлагын өгөгдөл ороогүй байна.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell max-w-[1280px] mx-auto px-6 py-8 lg:py-10">
      {!isLoggedIn && (
        <div className="mb-6 bg-sand-50 border-2 border-sand-100 rounded-[24px] px-5 py-4">
          <p className="text-[12px] font-extrabold text-sand-300 uppercase tracking-[0.5px] mb-1.5">
            Guest preview
          </p>
          <p className="text-[14px] text-[#7c6435] font-semibold leading-relaxed">
            Та одоогоор зөвхөн 1 жишээ уншлага үзэж байна. Бусад уншлагыг
            харахын тулд нэвтэрнэ үү.
          </p>
        </div>
      )}

      <div className="mb-7">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
          <div>
            <p className="text-[32px] lg:text-[40px] font-black tracking-[-0.03em] text-ink">
              Уншлага
            </p>
            <p className="text-[15px] lg:text-[17px] text-ink-muted font-semibold mt-2 leading-relaxed max-w-[760px]">
              Сонгосон ангийн түвшинд тохирсон эхийг уншиж, утга ойлголтоо
              хөгжүүлээрэй.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
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
                Нийт уншлага
              </p>
              <p className="text-[24px] font-black text-grass-300 mt-1">
                {filteredArticles.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 xl:gap-8">
        <aside className="space-y-4">
          {filteredArticles.map((a, i) => {
            const active = i === current;
            const locked = !isLoggedIn && i > 0;

            return (
              <button
                key={`${a.t}-${i}`}
                onClick={() => {
                  if (locked) {
                    openAuthModal("Бусад уншлагыг үзэхийн тулд нэвтэрнэ үү.");
                    return;
                  }
                  setCurrent(i);
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
                    📘
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex px-3 py-1 rounded-full bg-sand-50 text-sand-300 text-[11px] font-extrabold border border-sand-100">
                        {a.l}
                      </span>

                      <span className="text-[11px] font-bold text-ink-muted">
                        #{i + 1}
                      </span>

                      {!isLoggedIn && i === 0 && (
                        <span className="inline-flex px-3 py-1 rounded-full bg-grass-50 text-grass-300 text-[11px] font-extrabold border border-grass-100">
                          Жишээ
                        </span>
                      )}
                    </div>

                    <p className="text-[18px] font-black text-ink leading-snug mb-2">
                      {a.t}
                    </p>

                    <p className="text-[13px] text-ink-muted font-semibold leading-relaxed">
                      Сонгож нээгээд босоо бичвэр болон кирилл утгыг харна.
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="bg-white border-2 border-paper-100 rounded-[32px] p-6 lg:p-8 shadow-[0_10px_28px_rgba(22,28,45,.05)]">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex px-3 py-1 rounded-full bg-sky-50 text-sky-300 text-[12px] font-extrabold border border-sky-100">
              {selectedGrade}-р анги
            </span>

            <span className="inline-flex px-3 py-1 rounded-full bg-paper-50 text-ink-muted text-[12px] font-bold border border-paper-100">
              {article.l}
            </span>

            {!isLoggedIn && (
              <span className="inline-flex px-3 py-1 rounded-full bg-sand-50 text-sand-300 text-[12px] font-extrabold border border-sand-100">
                Жишээ уншлага
              </span>
            )}
          </div>

          <h2 className="text-[28px] lg:text-[34px] font-black tracking-[-0.03em] text-ink leading-tight mb-3">
            {article.t}
          </h2>

          <p className="text-[15px] lg:text-[16px] text-ink-muted font-semibold leading-relaxed mb-8 max-w-[760px]">
            Эхийг уншаад босоо бичлэгийн хэлбэр, үгийн дараалал, утгыг нь ойлгож
            үзээрэй.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8 items-start">
            <div className="bg-paper-50 border-2 border-paper-100 rounded-[28px] p-5 lg:p-6 flex justify-center min-h-[280px]">
              <MongolianText
                size="lg"
                color="#c97b2a"
                className="leading-[2.2]">
                {article.mg}
              </MongolianText>
            </div>

            <div className="bg-white border-2 border-paper-100 rounded-[28px] p-5 lg:p-6">
              <p className="text-[13px] uppercase tracking-[0.08em] font-extrabold text-ink-muted mb-3">
                Кирилл утга
              </p>

              <p className="text-[16px] lg:text-[18px] text-ink font-semibold leading-[1.9]">
                {article.mn}
              </p>

              <div className="mt-6 bg-sky-50 border-2 border-sky-100 rounded-[22px] p-4">
                <p className="text-[12px] font-extrabold text-sky-300 mb-2 uppercase tracking-wide">
                  Унших зөвлөмж
                </p>
                <ul className="list-disc pl-5 text-[14px] text-[#5f6787] font-semibold leading-relaxed space-y-1.5">
                  <li>Эхлээд босоо бичвэрийг бүхэлд нь ажигла</li>
                  <li>Дараа нь кирилл утгатай нь харьцуул</li>
                  <li>Түлхүүр үгсийг толиос дахин харж бататга</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
