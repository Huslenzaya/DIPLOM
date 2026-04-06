"use client";

import { MongolianText } from "@/components/ui/MongolianText";
import { usePathname, useRouter } from "next/navigation";

const HIDDEN_PATHS = ["/auth", "/", "/onboard", "/level-select", "/placement"];

const NAV_LINKS: { label: string; href: string }[][] = [
  [
    { label: "Хичээлүүд", href: "/lessons" },
    { label: "Дүрэм", href: "/lessons" },
    { label: "Түвшин тогтоох", href: "/placement" },
    { label: "Унших", href: "/reading" },
    { label: "Толь бичиг", href: "/dict" },
  ],
  [
    { label: "Тааруулах", href: "/games" },
    { label: "Хурдны тест", href: "/games" },
    { label: "Зурах", href: "/games" },
    { label: "Нийлүүлэх", href: "/games" },
    { label: "Шаар", href: "/games" },
    { label: "Хоосон нөхөх", href: "/games" },
  ],
];

const COL_TITLES = ["Сурах", "Тоглоом"];

const FLOATERS = [
  {
    mg: "ᠮᠣᠩᠭᠣᠯ",
    label: "монгол",
    color: "#4a9ede",
    bg: "rgba(26,107,189,.12)",
  },
  {
    mg: "ᠪᠢᠴᠢᠭ",
    label: "бичиг",
    color: "#f0a030",
    bg: "rgba(201,123,42,.12)",
  },
];

const PILLS = [
  { label: "🔵 Анхан", color: "rgba(26,107,189,.18)", text: "#b8d9ff" },
  { label: "🟢 Дунд", color: "rgba(42,154,82,.18)", text: "#a8ecc0" },
  { label: "🟠 Дэвшилтэт", color: "rgba(201,123,42,.18)", text: "#ffe4b0" },
  { label: "🔴 Ахисан", color: "rgba(200,48,48,.18)", text: "#ffb8b8" },
];

const BOTTOM_STATS = [
  { n: "35", label: "үсэг", color: "#b8d9ff" },
  { n: "6", label: "түвшин", color: "#a8ecc0" },
  { n: "6", label: "тоглоом", color: "#ffe4b0" },
  { n: "12", label: "медаль", color: "#ffb8b8" },
];

const LOGO_SRC = "/logo.png";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <footer className="bg-[#1a1a2e] text-white/70 relative z-10">
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#1a6bbd]" />
        <div className="flex-1 bg-[#2a9a52]" />
        <div className="flex-1 bg-[#c97b2a]" />
        <div className="flex-1 bg-[#c83030]" />
      </div>

      <div className="max-w-[960px] mx-auto px-6 pt-11 pb-7">
        <div className="grid grid-cols-[1fr_1fr_1fr_140px] gap-9 mb-8 max-sm:grid-cols-1 max-sm:gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[12px] overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <img
                  src={LOGO_SRC}
                  alt="Галигтан лого"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-[16px] font-black text-white leading-none">
                  Монгол Бичиг
                </p>
                <p className="text-[11px] text-white/40 font-semibold mt-0.5">
                  Сурах систем · 6–12-р анги
                </p>
              </div>
            </div>

            <p className="text-[12px] leading-[1.75] text-white/45 font-semibold mb-4">
              Үндэсний бичгээ,
              <br />
              хөгжилтэй аргаар эзэмшээрэй!
            </p>

            <div className="flex flex-wrap gap-1.5">
              {PILLS.map((p) => (
                <span
                  key={p.label}
                  className="text-[10px] font-extrabold px-2.5 py-1 rounded-2xl"
                  style={{ background: p.color, color: p.text }}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {NAV_LINKS.map((links, ci) => (
            <div key={ci}>
              <p className="text-[11px] font-black text-white tracking-[0.6px] uppercase mb-3 pb-2.5 border-b border-white/8">
                {COL_TITLES[ci]}
              </p>

              <div className="flex flex-col gap-0.5">
                {links.map(({ label, href }) => (
                  <button
                    key={label}
                    onClick={() => router.push(href)}
                    className="text-[13px] font-semibold text-white/45 text-left py-1.5 transition-all duration-150 hover:text-white hover:pl-1">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center gap-3 max-sm:hidden">
            <p className="text-[9px] font-extrabold tracking-[0.8px] uppercase text-white/30">
              Монгол бичиг
            </p>

            <div className="flex gap-2">
              {FLOATERS.map((f) => (
                <div
                  key={f.mg}
                  className="flex flex-col items-center gap-1.5 px-2.5 py-3 rounded-xl"
                  style={{ background: f.bg }}>
                  <MongolianText size="sm" color={f.color}>
                    {f.mg}
                  </MongolianText>
                  <span className="text-[9px] font-bold text-white/30">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/7 py-4 flex justify-center overflow-hidden"></div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-[11px] font-semibold text-white/25">
            © 2026 Галигтан Сурах Систем ·
          </p>

          <div className="flex items-center gap-2.5">
            {BOTTOM_STATS.map(({ n, label, color }, i) => (
              <div key={label} className="flex items-baseline gap-1">
                <span className="text-[17px] font-black" style={{ color }}>
                  {n}
                </span>
                <span className="text-[11px] font-semibold text-white/30">
                  {label}
                </span>
                {i < BOTTOM_STATS.length - 1 && (
                  <span className="ml-1.5 text-white/15 text-[14px]">·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
