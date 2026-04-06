"use client";

import { Mascot, MascotMode, MascotMood } from "@/components/ui/Mascot";
import { motion } from "framer-motion";

interface MascotGuideCardProps {
  mood?: MascotMood;
  mode?: MascotMode;
  title?: string;
  message: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function MascotGuideCard({
  mood = "neutral",
  mode = "guide",
  title = "Туслах",
  message,
  hint,
  actionLabel,
  onAction,
}: MascotGuideCardProps) {
  const cardTone =
    mood === "happy"
      ? "from-emerald-50 to-white border-emerald-100"
      : mood === "sad"
        ? "from-amber-50 to-white border-amber-100"
        : "from-sky-50 to-white border-sky-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`rounded-[30px] border-2 bg-gradient-to-r ${cardTone} px-5 py-5 shadow-sm`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Mascot mood={mood} mode={mode} message={message} size={118} />
        </div>

        <div className="flex-1 md:pl-2">
          <p className="text-[13px] font-black uppercase tracking-[0.08em] text-ink-muted">
            {title}
          </p>
          <p className="mt-1 text-[17px] font-extrabold leading-relaxed text-ink">
            {message}
          </p>

          {hint && (
            <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink-muted">
              {hint}
            </p>
          )}

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-4 rounded-[16px] bg-sky-300 px-5 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-sky-200">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
