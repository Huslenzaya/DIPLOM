"use client";

import { showToast } from "@/components/ui/Toast";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthModal() {
  const router = useRouter();

  const {
    authModalOpen,
    authModalReason,
    closeAuthModal,
    setUser,
    hasSeenLevelEntry,
  } = useAppStore();

  const [tab, setTab] = useState<"in" | "up">("in");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  if (!authModalOpen) return null;

  function goAfterAuth() {
    if (!hasSeenLevelEntry) {
      router.push("/level-select");
    } else {
      router.push("/lessons");
    }
  }

  async function doLogin() {
    if (!loginEmail || !loginPassword) {
      showToast("И-мэйл болон нууц үг оруулна уу", "bad");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Нэвтрэхэд алдаа гарлаа", "bad");
        return;
      }

      setUser(data.user.name, data.user.email, {
        lives: data.progress?.lives ?? 5,
        streak: data.progress?.streak ?? 0,
        xp: data.progress?.xp ?? 0,
        selectedGrade: data.progress?.selectedGrade ?? 6,
        unlockedGrades: data.unlockedGrades ?? [6],
        completedLessons: data.completedLessons ?? [],
        placementLevel: data.progress?.placementLevel ?? 1,
        hasSeenLevelEntry: data.progress?.hasSeenLevelEntry ?? false,
      });

      showToast("Амжилттай нэвтэрлээ", "ok");
      closeAuthModal();
      goAfterAuth();
    } catch (error) {
      showToast("Сүлжээний алдаа", "bad");
    }
  }

  async function doRegister() {
    if (!regName || !regEmail || !regPassword) {
      showToast("Бүх талбарыг бөглөнө үү", "bad");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || "Бүртгүүлэхэд алдаа гарлаа", "bad");
        return;
      }

      setUser(data.user.name, data.user.email, {
        lives: data.progress?.lives ?? 5,
        streak: data.progress?.streak ?? 0,
        xp: data.progress?.xp ?? 0,
        selectedGrade: data.progress?.selectedGrade ?? 6,
        unlockedGrades: data.unlockedGrades ?? [6],
        completedLessons: data.completedLessons ?? [],
        placementLevel: data.progress?.placementLevel ?? 1,
        hasSeenLevelEntry: data.progress?.hasSeenLevelEntry ?? false,
      });

      showToast("Амжилттай бүртгүүллээ", "ok");
      closeAuthModal();
      goAfterAuth();
    } catch (error) {
      showToast("Сүлжээний алдаа", "bad");
    }
  }

  const inputCls =
    "w-full font-nunito text-[16px] lg:text-[17px] font-bold border-2 border-paper-100 rounded-[20px] px-5 py-4 bg-white text-ink outline-none transition-all duration-200 focus:border-sky-100 focus:shadow-[0_0_0_4px_rgba(26,107,189,.10)]";

  const labelCls =
    "text-[12px] font-extrabold text-ink-muted tracking-[0.4px] uppercase";

  return (
    <div className="fixed inset-0 z-[120] bg-black/35 backdrop-blur-[2px] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] bg-white border-2 border-paper-100 rounded-[32px] p-7 lg:p-10 shadow-[0_18px_48px_rgba(22,28,45,.18)] relative">
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-paper-50 border-2 border-paper-100 text-[20px] font-black text-ink-muted hover:bg-paper-100 transition-all">
          ×
        </button>

        <div className="text-center mb-7">
          <p className="text-[30px] lg:text-[34px] font-black text-ink tracking-[-0.02em]">
            GALIGTAN
          </p>
          <p className="text-[15px] lg:text-[16px] text-ink-muted font-semibold mt-2">
            {authModalReason || "Үргэлжлүүлэхийн тулд нэвтэрнэ үү."}
          </p>
        </div>

        <div className="flex bg-paper-50 rounded-[20px] p-1.5 mb-8">
          {(["in", "up"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-[16px] text-[15px] lg:text-[16px] font-extrabold transition-all duration-200 ${
                tab === t
                  ? "bg-white text-ink shadow-soft"
                  : "text-ink-muted hover:text-ink"
              }`}>
              {t === "in" ? "Нэвтрэх" : "Бүртгүүлэх"}
            </button>
          ))}
        </div>

        {tab === "in" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className={labelCls}>И-мэйл</label>
              <input
                className={inputCls}
                type="email"
                placeholder="name@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelCls}>Нууц үг</label>
              <input
                className={inputCls}
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
              />
            </div>

            <button
              onClick={doLogin}
              className="w-full bg-sky-300 hover:bg-sky-200 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 transition-all duration-200 hover:-translate-y-px mt-1">
              Нэвтрэх →
            </button>

            <p className="text-center text-[14px] lg:text-[15px] text-ink-muted font-semibold pt-1">
              Бүртгэл байхгүй юу?{" "}
              <button
                onClick={() => setTab("up")}
                className="text-sky-300 font-extrabold">
                Бүртгүүлэх
              </button>
            </p>
          </div>
        )}

        {tab === "up" && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className={labelCls}>Нэр</label>
              <input
                className={inputCls}
                type="text"
                placeholder="Таны нэр"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelCls}>И-мэйл</label>
              <input
                className={inputCls}
                type="email"
                placeholder="name@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelCls}>Нууц үг</label>
              <input
                className={inputCls}
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doRegister()}
              />
            </div>

            <button
              onClick={doRegister}
              className="w-full bg-sky-300 hover:bg-sky-200 text-white font-extrabold text-[16px] lg:text-[17px] rounded-[20px] py-4 transition-all duration-200 hover:-translate-y-px mt-1">
              Бүртгүүлэх →
            </button>

            <p className="text-center text-[14px] lg:text-[15px] text-ink-muted font-semibold pt-1">
              Бүртгэлтэй юу?{" "}
              <button
                onClick={() => setTab("in")}
                className="text-sky-300 font-extrabold">
                Нэвтрэх
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
