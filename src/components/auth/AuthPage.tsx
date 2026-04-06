"use client";

import { showToast } from "@/components/ui/Toast";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"in" | "up">("in");
  const [loginEmail, setLoginEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");

  const { setUser } = useAppStore();

  function doLogin() {
    if (!loginEmail) {
      showToast("И-мэйл оруулна уу", "bad");
      return;
    }

    const normalized = loginEmail.trim().toLowerCase();
    const name = normalized.split("@")[0] || "Хэрэглэгч";

    setUser(name, normalized);
    showToast("Амжилттай нэвтэрлээ", "ok");

    setTimeout(() => {
      const latest = useAppStore.getState();
      if (!latest.hasSeenLevelEntry) {
        router.push("/level-select");
      } else {
        router.push("/lessons");
      }
    }, 50);
  }

  function doRegister() {
    if (!regName || !regEmail) {
      showToast("Бүх талбарыг бөглөнө үү", "bad");
      return;
    }

    const normalized = regEmail.trim().toLowerCase();

    setUser(regName.trim(), normalized);
    showToast("Амжилттай бүртгүүллээ", "ok");

    setTimeout(() => {
      const latest = useAppStore.getState();
      if (!latest.hasSeenLevelEntry) {
        router.push("/level-select");
      } else {
        router.push("/lessons");
      }
    }, 50);
  }

  const inputCls =
    "w-full font-nunito text-[16px] lg:text-[17px] font-bold border-2 border-paper-100 rounded-[20px] px-5 py-4 bg-white text-ink outline-none transition-all duration-200 focus:border-sky-100 focus:shadow-[0_0_0_4px_rgba(26,107,189,.10)]";

  const labelCls =
    "text-[12px] font-extrabold text-ink-muted tracking-[0.4px] uppercase";

  return (
    <div className="min-h-screen bg-paper pt-24 lg:pt-28 pb-10">
      <div className="w-full max-w-[560px] mx-auto px-6">
        <div className="flex flex-col items-center gap-3 mb-9 lg:mb-10">
          <div className="w-[84px] h-[84px] rounded-[24px] bg-white border-2 border-paper-100 shadow-[0_10px_30px_rgba(26,107,189,.10)] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="GALIGTAN"
              width={62}
              height={62}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-center">
            <p className="text-[30px] lg:text-[34px] font-black text-ink tracking-[-0.02em]">
              GALIGTAN
            </p>
            <p className="text-[15px] lg:text-[16px] text-ink-muted font-semibold mt-1">
              Монгол бичиг сурах систем · 6–12-р анги
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-paper-100 rounded-[32px] p-7 lg:p-10 shadow-[0_12px_40px_rgba(22,28,45,.06)]">
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
    </div>
  );
}
