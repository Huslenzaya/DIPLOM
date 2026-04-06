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
  const [success, setSuccess] = useState("");

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

      setSuccess(selectedLesson ? "Хичээл шинэчлэгдсэн" : "Хичээл үүсгэгдсэн");
      setTimeout(() => setSuccess(""), 3000);

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
      setSuccess("Хичээл устгалаа");
      setTimeout(() => setSuccess(""), 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-paper via-paper-50 to-paper pt-28 pb-16">
      <div className="app-shell max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-ink mb-3">📚 Администратор Панель</h1>
          <p className="text-lg text-ink-muted font-semibold max-w-2xl">
            Монголын үсгээр лемонх хичээлүүдийг үүсгэх, засах, устгах. Бүх хичээлийн агуулгыг HTML форматаар оруулах боломжтой.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-grass-50 border-2 border-grass-100 rounded-xl">
            <p className="text-grass-300 font-bold">✓ {success}</p>
          </div>
        )}

        {/* Filters & Add Button */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <select
            value={filter.grade}
            onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
            className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
          >
            <option value="">📊 Бүх анги</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g} анги
              </option>
            ))}
          </select>

          <select
            value={filter.kind}
            onChange={(e) => setFilter({ ...filter, kind: e.target.value })}
            className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
          >
            <option value="">📖 Бүх төрөл</option>
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <button
            onClick={handleNew}
            className="px-6 py-2 bg-gradient-to-br from-grass-300 to-grass-400 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
          >
            ✨ Шинэ хичээл
          </button>
        </div>

        {/* Lessons List */}
        {loading ? (
          <p className="text-ink-muted font-semibold text-center py-12">⏳ Уншиж байна...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl p-6 border-2 border-paper-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="text-sm font-bold text-sky-300 uppercase bg-sky-50 px-2 py-1 rounded">
                        {lesson.grade} анги
                      </span>
                      <span className="text-sm font-bold text-sand-300 uppercase bg-sand-50 px-2 py-1 rounded">
                        {lesson.kind}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-ink">{lesson.title}</h3>
                  </div>
                </div>

                {lesson.shortDesc && (
                  <p className="text-sm text-ink-muted mb-4 line-clamp-2">{lesson.shortDesc}</p>
                )}

                <div className="text-xs text-ink-muted mb-4">
                  {lesson.htmlContent && (
                    <p>📄 HTML агуулга: {lesson.htmlContent.length} өгөгдөл</p>
                  )}
                  {lesson.quizKey && <p>🎯 Quiz Key: {lesson.quizKey}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="flex-1 px-3 py-2 bg-sky-50 text-sky-300 font-bold rounded-lg hover:bg-sky-100 transition"
                  >
                    ✏️ Засах
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="flex-1 px-3 py-2 bg-ember-50 text-ember-300 font-bold rounded-lg hover:bg-ember-100 transition"
                  >
                    🗑️ Устгах
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
                {selectedLesson ? "🖊️ Хичээл засах" : "✨ Шинэ хичээл үүсгэх"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      📊 Анги
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          grade: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g} анги
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      📖 Төрөл
                    </label>
                    <select
                      value={formData.kind}
                      onChange={(e) =>
                        setFormData({ ...formData, kind: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
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
                    📝 Хичээлийн нэр *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="жишээ: Үсэг таних үндэс"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    💬 Богино тайлбар
                  </label>
                  <input
                    type="text"
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDesc: e.target.value })
                    }
                    placeholder="жишээ: Монгол үсгийн суурь элементүүдийг сурах"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">
                    📄 HTML Агуулга (хичээлийн үндсэн материал)
                  </label>
                  <textarea
                    value={formData.htmlContent}
                    onChange={(e) =>
                      setFormData({ ...formData, htmlContent: e.target.value })
                    }
                    placeholder="<h2>Үзүүлэх заголовок</h2><p>Энэ нь хичээлийн агуулга юм...</p>"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 h-32 font-mono text-sm"
                  />
                  <p className="text-xs text-ink-muted mt-2">
                    💡 Зөвлөмж: HTML теги ашиглан формат хийж болно
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      🎯 Quiz ID
                    </label>
                    <input
                      type="text"
                      value={formData.quizKey}
                      onChange={(e) =>
                        setFormData({ ...formData, quizKey: e.target.value })
                      }
                      placeholder="quiz_g6_lesson1"
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">
                      📍 Дараалал (эрэмб)
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
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mt-6">
                  <p className="text-sm text-sky-300 font-semibold">
                    💡 Заалт: HTML агуулгад заалтайг ашиглан эхлүүлэх, эргүүлэх үйлдлүүд, текст форматыг стандартайн дагуу сайтар жүүлэх ёстой.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-paper-100">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-grass-300 to-grass-400 text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    {selectedLesson ? "🔄 Шинэчлэх" : "✅ Үүсгэх"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 bg-paper-100 text-ink font-bold rounded-lg hover:bg-paper-200 transition"
                  >
                    ✕ Хаах
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
