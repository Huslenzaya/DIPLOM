"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PageId } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS: { id: PageId; label: string; icon: string }[] = [
  { id: "lessons", label: "Хичээл", icon: "📘" },
  { id: "games", label: "Тоглоом", icon: "🎮" },
  { id: "reading", label: "Унших", icon: "📖" },
  { id: "dict", label: "Толь бичиг", icon: "🗂" },
];

const HIDDEN_ROUTES = ["/auth"];

export function Navbar() {
  const router = useRouter();
  const { lives, streak, userName, isLoggedIn, openAuthModal } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const hidden = HIDDEN_ROUTES.includes(pathname);

  function closeMenus() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  function handleLogoClick() {
    closeMenus();
    router.push("/");
  }

  function handleNavClick(page: PageId) {
    closeMenus();
    router.push(`/${page === "home" ? "" : page}`);
  }

  function handleProfileClick() {
    if (!isLoggedIn) {
      openAuthModal("Профайл үзэхийн тулд нэвтэрнэ үү.");
      return;
    }

    const isMobile =
      typeof window !== "undefined" ? window.innerWidth < 768 : false;

    if (isMobile) {
      setProfileOpen((current) => !current);
      setMenuOpen(false);
      return;
    }

    goToProfile();
  }

  function goToProfile() {
    closeMenus();
    router.push("/profile");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-paper/95 backdrop-blur-xl border-b-2 border-paper-100">
      <div className="app-shell h-full flex items-center gap-3">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 font-extrabold text-[18px] text-ink mr-4 shrink-0">
          <div className="w-10 h-10 rounded-[11px] overflow-hidden shrink-0 shadow-[0_3px_10px_rgba(26,107,189,.20)] bg-white flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GALIGTAN logo"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          GALIGTAN
        </button>
        {!hidden && (
          <button
            onClick={() => {
              setMenuOpen((current) => !current);
              setProfileOpen(false);
            }}
            className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-paper-50 transition-colors">
            <div className="w-5 h-0.5 bg-ink"></div>
            <div className="w-5 h-0.5 bg-ink"></div>
            <div className="w-5 h-0.5 bg-ink"></div>
          </button>
        )}
        {!hidden &&
          NAV_ITEMS.map((item) => {
            const href = `/${item.id}`;
            const active = pathname === href;

            return (
              <button
                key={item.id}
                id={`nb-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[14px] font-bold transition-all duration-200 whitespace-nowrap",
                  active
                    ? "bg-sky-300 text-white"
                    : "text-ink-muted hover:bg-paper-50 hover:text-ink",
                )}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        {!hidden && (
          <div className="ml-auto flex items-center gap-3 relative">
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "transition-all duration-300",
                        i > lives && "grayscale opacity-30 scale-[0.85]",
                      )}>
                      <Image
                        src="/icons/heart.png"
                        alt="life"
                        width={18}
                        height={18}
                        className="w-[18px] h-[18px] object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-[#ff6b2b] to-[#ffaa44] text-white text-[12px] font-extrabold px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
                  <Image
                    src="/icons/fire.png"
                    alt="streak"
                    width={14}
                    height={14}
                    className="w-[14px] h-[14px] object-contain"
                  />
                  <span>{streak}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProfileClick}
              className="min-w-[40px] h-10 px-3 rounded-full bg-gradient-to-br from-sky-300 to-grass-200 border-[3px] border-white flex items-center justify-center text-[14px] font-black text-white shadow-[0_2px_12px_rgba(26,107,189,.3)] transition-transform hover:scale-110">
              {isLoggedIn ? (userName?.[0]?.toUpperCase() ?? "?") : "Н"}
            </button>

            {profileOpen && isLoggedIn && (
              <div className="absolute right-0 top-full mt-3 w-56 rounded-[26px] bg-white border-2 border-paper-100 shadow-[0_24px_60px_rgba(22,28,45,.12)] p-3 z-50 md:hidden">
                <button
                  onClick={goToProfile}
                  className="w-full text-left text-[14px] font-bold text-ink mb-3 px-3 py-3 rounded-[20px] border border-paper-100 hover:bg-paper-50 transition">
                  Профайл руу явах
                </button>
                <div className="flex items-center justify-between gap-3 rounded-[20px] bg-paper-50 p-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/heart.png"
                      alt="life"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain"
                    />
                    <div>
                      <p className="text-[12px] text-ink-muted">Амьдрал</p>
                      <p className="text-[14px] font-bold">{lives}/5</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-[20px] bg-paper-50 p-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/fire.png"
                      alt="streak"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain"
                    />
                    <div>
                      <p className="text-[12px] text-ink-muted">Streak</p>
                      <p className="text-[14px] font-bold">{streak}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {menuOpen && !hidden && (
          <div className="absolute top-full left-0 right-0 bg-paper/95 backdrop-blur-xl border-b-2 border-paper-100 shadow-lg md:hidden">
            <div className="app-shell py-4 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const href = `/${item.id}`;
                const active = pathname === href;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-bold transition-all duration-200",
                      active
                        ? "bg-sky-300 text-white"
                        : "text-ink-muted hover:bg-paper-50 hover:text-ink",
                    )}>
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}{" "}
      </div>
    </nav>
  );
}
