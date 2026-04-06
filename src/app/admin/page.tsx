"use client";

import { useState, useEffect } from "react";

interface Lesson {
  id: string;
  grade: number;
  kind: string;
  title: string;
  shortDesc?: string;
  htmlContent?: string;
  quizKey?: string;
  order: number;
  createdAt: string;
}

const KIND_OPTIONS = ["lesson", "rule", "practice", "exam"];
const GRADES = [6, 7, 8, 9, 10, 11, 12];

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ grade: "", kind: "" });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    grade: 6,
    kind: "lesson",
    title: "",
    shortDesc: "",
    htmlContent: "",
    quizKey: "",
    order: 0,
  });

  // Fetch lessons
  useEffect(() => {
    fetchLessons();
  }, [filter]);

  async function fetchLessons() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.grade) params.set("grade", filter.grade);
      if (filter.kind) params.set("kind", filter.kind);

      const res = await fetch(`/api/admin/lessons?${params}`);
      const data = await res.json();
      setLessons(data);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const method = selectedLesson ? "PUT" : "POST";
      const url = selectedLesson
        ? `/api/admin/lessons/${selectedLesson.id}`
        : `/api/admin/lessons`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      setShowForm(false);
      setSelectedLesson(null);
      setFormData({
        grade: 6,
        kind: "lesson",
        title: "",
        shortDesc: "",
        htmlContent: "",
        quizKey: "",
        order: 0,
      });
      await fetchLessons();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Хичээл хадгалахад алдаа гарлаа");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Энэ хичээлийг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchLessons();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert("Хичээлийг устгахад алдаа гарлаа");
    }
  }

  function handleEdit(lesson: Lesson) {
    setSelectedLesson(lesson);
    setFormData({
      grade: lesson.grade,
      kind: lesson.kind,
      title: lesson.title,
      shortDesc: lesson.shortDesc || "",
      htmlContent: lesson.htmlContent || "",
      quizKey: lesson.quizKey || "",
      order: lesson.order,
    });
    setShowForm(true);
  }

  function handleNew() {
    setSelectedLesson(null);
    setFormData({
      grade: 6,
      kind: "lesson",
      title: "",
      shortDesc: "",
      htmlContent: "",
      quizKey: "",
      order: 0,
    });
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-paper-50 to-paper p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-ink mb-2">Админ Панель</h1>
        <p className="text-ink-muted mb-8">Хичээлүүдийг удирдах</p>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={filter.grade}
            onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
            className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="">Бүх анги</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g} анги
              </option>
            ))}
          </select>

          <select
            value={filter.kind}
            onChange={(e) => setFilter({ ...filter, kind: e.target.value })}
            className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="">Бүх төрөл</option>
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <button
            onClick={handleNew}
            className="px-6 py-2 bg-gradient-to-br from-sky-300 to-sky-400 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            + Шинэ хичээл
          </button>
        </div>

        {/* Lessons List */}
        {loading ? (
          <p className="text-ink-muted">Уншиж байна...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl p-6 border-2 border-paper-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-sky-300 uppercase">
                      {lesson.grade} анги · {lesson.kind}
                    </p>
                    <h3 className="text-lg font-bold text-ink mt-1">
                      {lesson.title}
                    </h3>
                  </div>
                </div>

                {lesson.shortDesc && (
                  <p className="text-sm text-ink-muted mb-4">{lesson.shortDesc}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="flex-1 px-3 py-2 bg-sky-50 text-sky-300 font-bold rounded-lg hover:bg-sky-100 transition"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="flex-1 px-3 py-2 bg-ember-50 text-ember-300 font-bold rounded-lg hover:bg-ember-100 transition"
                  >
                    Устгах
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-ink mb-6">
                {selectedLesson ? "Хичээл засах" : "Шинэ хичээл"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      Анги
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          grade: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      Төрөл
                    </label>
                    <select
                      value={formData.kind}
                      onChange={(e) =>
                        setFormData({ ...formData, kind: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    >
                      {KIND_OPTIONS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Нэр *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Хичээлийн нэр"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    Богино тайлбар
                  </label>
                  <input
                    type="text"
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDesc: e.target.value })
                    }
                    placeholder="Хичээлийн товч тайлбар"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    HTML Агуулга
                  </label>
                  <textarea
                    value={formData.htmlContent}
                    onChange={(e) =>
                      setFormData({ ...formData, htmlContent: e.target.value })
                    }
                    placeholder="Хичээлийн HTML агуулга"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      Quiz Key
                    </label>
                    <input
                      type="text"
                      value={formData.quizKey}
                      onChange={(e) =>
                        setFormData({ ...formData, quizKey: e.target.value })
                      }
                      placeholder="quiz_key"
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      Дараалал
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-sky-300 to-sky-400 text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    {selectedLesson ? "Шинэчлэх" : "Үүсгэх"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 bg-paper-100 text-ink font-bold rounded-lg hover:bg-paper-200 transition"
                  >
                    Хаах
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
