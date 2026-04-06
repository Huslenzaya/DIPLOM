//src/components/ui/ProgressBar.tsx
"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  color?: string;
}

export function ProgressBar({ value, className, color }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-3 lg:h-[14px] bg-paper-100 rounded-full overflow-hidden shadow-inner",
        className,
      )}>
      <div
        className="h-full rounded-full progress-fill"
        style={{
          width: `${value}%`,
          background: color ?? "linear-gradient(90deg, #3dba68, #4a9ede)",
        }}
      />
    </div>
  );
}
