//src/lib/level-map.ts
import type { LessonId } from "@/types";

export function levelToLesson(level: number): LessonId {
  switch (level) {
    case 1:
      return "l1";
    case 2:
      return "l2";
    case 3:
      return "l3";
    case 4:
      return "l4";
    case 5:
      return "cases";
    case 6:
      return "verbtense";
    default:
      return "vowels";
  }
}

export function levelToLabel(level: number): string {
  switch (level) {
    case 1:
      return "6-р анги";
    case 2:
      return "7-р анги";
    case 3:
      return "8-р анги";
    case 4:
      return "9-р анги";
    case 5:
      return "10–11-р анги";
    case 6:
      return "12-р анги";
    default:
      return "Анхан шат";
  }
}
