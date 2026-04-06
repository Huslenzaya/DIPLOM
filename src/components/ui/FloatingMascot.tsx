"use client";

import { Mascot, MascotMode, MascotMood } from "@/components/ui/Mascot";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

interface FloatingMascotProps {
  mood?: MascotMood;
  mode?: MascotMode;
  messages?: string[];
}

export function FloatingMascot({
  mood = "neutral",
  mode = "guide",
  messages = [
    "Тусламж хэрэгтэй бол намайг дарна уу.",
    "Алдаа гаргаж байж сурдаг шүү.",
    "Анхаараад уншаарай.",
  ],
}: FloatingMascotProps) {
  const [open, setOpen] = useState(false);

  const randomMessage = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)] ?? "Эхэлье!";
  }, [messages, open]);

  return (
    <div className="fixed bottom-5 right-5 z-50 hidden md:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[320px] rounded-[24px] border border-sky-100 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
            <p className="mb-2 text-[13px] font-black uppercase tracking-[0.08em] text-sky-300">
              Туслах
            </p>
            <p className="text-[15px] font-semibold leading-relaxed text-ink">
              {randomMessage}
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 text-[13px] font-extrabold text-ink-muted hover:text-ink">
              Хаах
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-white/70 bg-white/90 p-2 shadow-[0_14px_32px_rgba(15,23,42,0.18)] backdrop-blur transition-all hover:-translate-y-1">
        <Mascot mood={mood} mode={mode} size={88} showBubble={false} />
      </button>
    </div>
  );
}
