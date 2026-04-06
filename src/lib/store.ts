"use client";

import type { DictTab, FlashSetType } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type QuizMode = "normal" | "gate";

interface UserProfileData {
  userName: string;
  userEmail: string;
  hasSeenLevelEntry: boolean;

  lives: number;
  streak: number;
  xp: number;
  level: number;
  learnedLetters: number[];

  selectedGrade: number;
  unlockedGrades: number[];
  passedGradeExams: number[];
  pendingUnlockGrade: number | null;

  currentLesson: string;
  completedLessons: string[];

  quizTopic: string;
  quizFromLesson: boolean;
  quizHideTips: boolean;
  quizMode: QuizMode;

  placementLevel: number;

  flashSetType: FlashSetType;
  dictTab: DictTab;
}

interface AppState extends UserProfileData {
  isLoggedIn: boolean;
  activeUserEmail: string | null;
  profiles: Record<string, UserProfileData>;

  setUser: (
    name: string,
    email: string,
    serverProfile?: Partial<UserProfileData>,
  ) => void;
  logout: () => void;

  authModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;

  completeInitialLevelEntry: () => void;
  resetInitialLevelEntry: () => void;

  loseLife: () => void;
  resetLives: () => void;
  addXp: (amount: number) => void;
  addStreak: () => void;
  resetStreak: () => void;
  markLetterLearned: (idx: number) => void;

  setSelectedGrade: (grade: number) => void;
  unlockGrade: (grade: number) => void;
  unlockAndSelectGrade: (grade: number) => void;
  markGradeExamPassed: (grade: number) => void;
  clearPendingUnlockGrade: () => void;
  completeGateUnlock: (grade: number) => void;

  setLesson: (id: string) => void;
  markLessonCompleted: (id: string) => void;

  startQuiz: (
    topic: string,
    fromLesson?: boolean,
    hideTips?: boolean,
    mode?: QuizMode,
  ) => void;
  startGateQuiz: (topic: string, targetGrade: number) => void;

  setPlacementLevel: (n: number) => void;

  setFlashSetType: (t: FlashSetType) => void;
  setDictTab: (t: DictTab) => void;

  resetProgress: () => void;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function placementToGrade(level: number) {
  switch (level) {
    case 1:
      return 6;
    case 2:
      return 7;
    case 3:
      return 8;
    case 4:
      return 9;
    case 5:
      return 10;
    case 6:
      return 11;
    default:
      return 6;
  }
}

function gradeToFirstLesson(grade: number) {
  switch (grade) {
    case 6:
      return "g6_intro";
    case 7:
      return "g7_harmony";
    case 8:
      return "g8_verb";
    case 9:
      return "g9_sentence";
    case 10:
      return "g10_literature";
    case 11:
      return "g11_culture";
    case 12:
      return "g12_translation";
    default:
      return "g6_intro";
  }
}

function buildUnlockedGrades(maxGrade: number) {
  const arr: number[] = [];
  for (let g = 6; g <= maxGrade; g++) arr.push(g);
  return arr;
}

function buildDefaultProfile(name = "", email = ""): UserProfileData {
  return {
    userName: name,
    userEmail: email,
    hasSeenLevelEntry: false,

    lives: 5,
    streak: 0,
    xp: 0,
    level: 1,
    learnedLetters: [],

    selectedGrade: 6,
    unlockedGrades: [6],
    passedGradeExams: [],
    pendingUnlockGrade: null,

    currentLesson: "g6_intro",
    completedLessons: [],

    quizTopic: "default",
    quizFromLesson: false,
    quizHideTips: false,
    quizMode: "normal",

    placementLevel: 1,

    flashSetType: "all",
    dictTab: "letters",
  };
}

const guestDefaults = buildDefaultProfile();

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...guestDefaults,

      isLoggedIn: false,
      activeUserEmail: null,
      profiles: {},

      authModalOpen: false,
      authModalReason: "",

      setUser: (name, email, serverProfile) =>
        set((s) => {
          const normalizedEmail = normalizeEmail(email);
          const existing = s.profiles[normalizedEmail];
          const fallbackName =
            name?.trim() || normalizedEmail.split("@")[0] || "Хэрэглэгч";

          const baseProfile: UserProfileData = existing
            ? {
                ...existing,
                userName: existing.userName || fallbackName,
                userEmail: normalizedEmail,
              }
            : buildDefaultProfile(fallbackName, normalizedEmail);

          const profile: UserProfileData = {
            ...baseProfile,
            userName: fallbackName,
            userEmail: normalizedEmail,
            ...serverProfile,
          };

          return {
            ...profile,
            isLoggedIn: true,
            activeUserEmail: normalizedEmail,
            authModalOpen: false,
            authModalReason: "",
            profiles: {
              ...s.profiles,
              [normalizedEmail]: profile,
            },
          };
        }),

      logout: () =>
        set((s) => ({
          ...guestDefaults,
          isLoggedIn: false,
          activeUserEmail: null,
          profiles: s.profiles,
          authModalOpen: false,
          authModalReason: "",
        })),

      openAuthModal: (
        reason = "Энэ хэсгийг үргэлжлүүлэн ашиглахын тулд нэвтэрнэ үү.",
      ) =>
        set({
          authModalOpen: true,
          authModalReason: reason,
        }),

      closeAuthModal: () =>
        set({
          authModalOpen: false,
          authModalReason: "",
        }),

      completeInitialLevelEntry: () =>
        set((s) => {
          if (!s.activeUserEmail) return { hasSeenLevelEntry: true };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            hasSeenLevelEntry: true,
          };

          return {
            hasSeenLevelEntry: true,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      resetInitialLevelEntry: () =>
        set((s) => {
          if (!s.activeUserEmail) return { hasSeenLevelEntry: false };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            hasSeenLevelEntry: false,
          };

          return {
            hasSeenLevelEntry: false,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      loseLife: () =>
        set((s) => {
          const lives = Math.max(0, s.lives - 1);
          if (!s.activeUserEmail) return { lives };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            lives,
          };

          return {
            lives,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      resetLives: () =>
        set((s) => {
          if (!s.activeUserEmail) return { lives: 5 };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            lives: 5,
          };

          return {
            lives: 5,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      addXp: (amount) =>
        set((s) => {
          const xp = s.xp + amount;
          if (!s.activeUserEmail) return { xp };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            xp,
          };

          return {
            xp,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      addStreak: () =>
        set((s) => {
          const streak = s.streak + 1;
          if (!s.activeUserEmail) return { streak };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            streak,
          };

          return {
            streak,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      resetStreak: () =>
        set((s) => {
          if (!s.activeUserEmail) return { streak: 0 };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            streak: 0,
          };

          return {
            streak: 0,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      markLetterLearned: (idx) =>
        set((s) => {
          if (s.learnedLetters.includes(idx)) return s;

          const learnedLetters = [...s.learnedLetters, idx];
          const xp = s.xp + 5;

          if (!s.activeUserEmail) return { ...s, learnedLetters, xp };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            learnedLetters,
            xp,
          };

          return {
            learnedLetters,
            xp,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      setSelectedGrade: (grade) =>
        set((s) => {
          if (!s.unlockedGrades.includes(grade)) return s;

          const next = {
            selectedGrade: grade,
            currentLesson: gradeToFirstLesson(grade),
            hasSeenLevelEntry: true,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      unlockGrade: (grade) =>
        set((s) => {
          if (s.unlockedGrades.includes(grade)) return s;

          const unlockedGrades = [...s.unlockedGrades, grade].sort(
            (a, b) => a - b,
          );

          if (!s.activeUserEmail) return { unlockedGrades };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            unlockedGrades,
          };

          return {
            unlockedGrades,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      unlockAndSelectGrade: (grade) =>
        set((s) => {
          const unlockedGrades = s.unlockedGrades.includes(grade)
            ? s.unlockedGrades
            : [...s.unlockedGrades, grade].sort((a, b) => a - b);

          const next = {
            unlockedGrades,
            selectedGrade: grade,
            currentLesson: gradeToFirstLesson(grade),
            hasSeenLevelEntry: true,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      markGradeExamPassed: (grade) =>
        set((s) => {
          if (s.passedGradeExams.includes(grade)) return s;

          const passedGradeExams = [...s.passedGradeExams, grade].sort(
            (a, b) => a - b,
          );

          if (!s.activeUserEmail) return { passedGradeExams };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            passedGradeExams,
          };

          return {
            passedGradeExams,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      clearPendingUnlockGrade: () =>
        set((s) => {
          const next = {
            pendingUnlockGrade: null,
            quizMode: "normal" as QuizMode,
            quizHideTips: false,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      completeGateUnlock: (grade) =>
        set((s) => {
          const unlockedGrades = s.unlockedGrades.includes(grade)
            ? s.unlockedGrades
            : [...s.unlockedGrades, grade].sort((a, b) => a - b);

          const prevGrade = grade - 1;
          const passedGradeExams = s.passedGradeExams.includes(prevGrade)
            ? s.passedGradeExams
            : [...s.passedGradeExams, prevGrade].sort((a, b) => a - b);

          const next = {
            unlockedGrades,
            passedGradeExams,
            selectedGrade: grade,
            currentLesson: gradeToFirstLesson(grade),
            pendingUnlockGrade: null,
            quizMode: "normal" as QuizMode,
            quizHideTips: false,
            xp: s.xp + 40,
            hasSeenLevelEntry: true,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      setLesson: (id) =>
        set((s) => {
          if (!s.activeUserEmail) return { currentLesson: id };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            currentLesson: id,
          };

          return {
            currentLesson: id,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      markLessonCompleted: (id) =>
        set((s) => {
          if (s.completedLessons.includes(id)) return s;

          const completedLessons = [...s.completedLessons, id];
          const xp = s.xp + 20;

          if (!s.activeUserEmail) return { completedLessons, xp };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            completedLessons,
            xp,
          };

          return {
            completedLessons,
            xp,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      startQuiz: (
        topic,
        fromLesson = false,
        hideTips = false,
        mode: QuizMode = "normal",
      ) =>
        set((s) => {
          const next = {
            quizTopic: topic,
            quizFromLesson: fromLesson,
            quizHideTips: hideTips,
            quizMode: mode,
            pendingUnlockGrade: null,
            lives: 5,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      startGateQuiz: (topic, targetGrade) =>
        set((s) => {
          const next = {
            quizTopic: topic,
            quizFromLesson: false,
            quizHideTips: true,
            quizMode: "gate" as QuizMode,
            pendingUnlockGrade: targetGrade,
            lives: 5,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      setPlacementLevel: (n) =>
        set((s) => {
          const grade = placementToGrade(n);

          const next = {
            placementLevel: n,
            level: n,
            selectedGrade: grade,
            unlockedGrades: buildUnlockedGrades(grade),
            currentLesson: gradeToFirstLesson(grade),
            hasSeenLevelEntry: true,
          };

          if (!s.activeUserEmail) return next;

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            ...next,
          };

          return {
            ...next,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      setFlashSetType: (t) =>
        set((s) => {
          if (!s.activeUserEmail) return { flashSetType: t };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            flashSetType: t,
          };

          return {
            flashSetType: t,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      setDictTab: (t) =>
        set((s) => {
          if (!s.activeUserEmail) return { dictTab: t };

          const updatedProfile: UserProfileData = {
            ...s.profiles[s.activeUserEmail],
            dictTab: t,
          };

          return {
            dictTab: t,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: updatedProfile,
            },
          };
        }),

      resetProgress: () =>
        set((s) => {
          if (!s.activeUserEmail) return s;

          const freshProfile = buildDefaultProfile(s.userName, s.userEmail);

          return {
            ...freshProfile,
            isLoggedIn: true,
            activeUserEmail: s.activeUserEmail,
            profiles: {
              ...s.profiles,
              [s.activeUserEmail]: freshProfile,
            },
          };
        }),
    }),
    {
      name: "galigtan-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        activeUserEmail: s.activeUserEmail,
        profiles: s.profiles,

        userName: s.userName,
        userEmail: s.userEmail,
        hasSeenLevelEntry: s.hasSeenLevelEntry,

        lives: s.lives,
        streak: s.streak,
        xp: s.xp,
        level: s.level,
        learnedLetters: s.learnedLetters,

        selectedGrade: s.selectedGrade,
        unlockedGrades: s.unlockedGrades,
        passedGradeExams: s.passedGradeExams,
        pendingUnlockGrade: s.pendingUnlockGrade,

        currentLesson: s.currentLesson,
        completedLessons: s.completedLessons,

        quizTopic: s.quizTopic,
        quizFromLesson: s.quizFromLesson,
        quizHideTips: s.quizHideTips,
        quizMode: s.quizMode,

        placementLevel: s.placementLevel,
        flashSetType: s.flashSetType,
        dictTab: s.dictTab,
      }),
    },
  ),
);
