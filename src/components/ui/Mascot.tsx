"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export type MascotMood = "neutral" | "happy" | "sad";
export type MascotMode =
  | "welcome"
  | "guide"
  | "encourage"
  | "celebrate"
  | "comfort"
  | "hint";

const mascotMap: Record<MascotMood, string> = {
  neutral: "/mascot/neutral.png",
  happy: "/mascot/happy.png",
  sad: "/mascot/sad.png",
};

interface MascotProps {
  mood?: MascotMood;
  mode?: MascotMode;
  size?: number;
  message?: string;
  showBubble?: boolean;
  className?: string;
}

function getDefaultMessage(mode: MascotMode, mood: MascotMood) {
  if (mode === "welcome") return "Сайн уу? Өнөөдрийн хичээлээ эхэлье.";
  if (mode === "guide") return "Энэ хэсгийг анхаараад дагаарай.";
  if (mode === "encourage") return "Сайн бодоод зөв хариулаарай.";
  if (mode === "celebrate") return "Маш сайн! Чи амжилттай хийлээ.";
  if (mode === "comfort") return "Зүгээр ээ, дахин оролдоод үзье.";
  if (mode === "hint") return "Жаахан анхаараад ажиглаарай.";

  if (mood === "happy") return "Маш сайн!";
  if (mood === "sad") return "Зүгээр ээ.";
  return "Эхэлье!";
}

export function Mascot({
  mood = "neutral",
  mode = "guide",
  size = 144,
  message,
  showBubble = true,
  className = "",
}: MascotProps) {
  const text = message ?? getDefaultMessage(mode, mood);

  const characterAnimation =
    mood === "happy"
      ? {
          y: [0, -8, 0],
          scale: [1, 1.04, 1],
          rotate: [0, -1.5, 1.5, 0],
        }
      : mood === "sad"
        ? {
            y: [0, 2, 0],
            rotate: [0, -1, 1, 0],
            scale: [1, 0.985, 1],
          }
        : {
            y: [0, -4, 0],
            scale: [1, 1.015, 1],
          };

  const characterTransition =
    mood === "happy"
      ? { duration: 1.05, repeat: Infinity, ease: "easeInOut" as const }
      : mood === "sad"
        ? { duration: 1.7, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 2.1, repeat: Infinity, ease: "easeInOut" as const };

  const bubbleClasses =
    mood === "happy"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : mood === "sad"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div
        animate={characterAnimation}
        transition={characterTransition}
        className="relative shrink-0">
        <Image
          src={mascotMap[mood]}
          alt={`mascot-${mood}`}
          width={size}
          height={size}
          priority
          className="pointer-events-none select-none object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
        />

        <motion.div
          animate={{
            scaleX: mood === "happy" ? [1, 1.12, 1] : [1, 1.05, 1],
            opacity: mood === "sad" ? [0.18, 0.12, 0.18] : [0.22, 0.3, 0.22],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[92%] h-4 w-20 -translate-x-1/2 rounded-full bg-slate-900/20 blur-md"
        />

        {mood === "happy" && (
          <>
            <motion.span
              animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1 top-3 text-lg">
              ✦
            </motion.span>
            <motion.span
              animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.15,
              }}
              className="absolute right-1 top-1 text-base">
              ✦
            </motion.span>
          </>
        )}

        {mood === "sad" && (
          <motion.span
            animate={{ y: [0, 6, 0], opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-1 top-7 text-base">
            💧
          </motion.span>
        )}
      </motion.div>

      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mood}-${mode}-${text}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={`relative max-w-[320px] rounded-[22px] border px-4 py-3 text-sm font-extrabold shadow-sm ${bubbleClasses}`}>
            <span className="absolute left-[-8px] top-8 h-4 w-4 rotate-45 border-l border-b bg-inherit"></span>
            {text}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
