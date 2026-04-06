import { useEffect, useState } from "react";

export interface LessonData {
  id: string;
  grade: number;
  kind: string;
  title: string;
  shortDesc?: string;
  htmlContent?: string;
  quizKey?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function useLessons(grade?: number, kind?: string) {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (grade) params.set("grade", grade.toString());
        if (kind) params.set("kind", kind);

        const res = await fetch(`/api/lessons?${params}`);
        if (!res.ok) throw new Error("Failed to fetch lessons");

        const data = await res.json();
        setLessons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [grade, kind]);

  return { lessons, loading, error };
}
