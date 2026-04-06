"use client";

import { useState, useEffect } from "react";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  grade: number;
  type: string;
  totalPoints: number;
  questions: any[];
  createdAt: string;
}

interface Lesson {
  id: string;
  grade: number;
  kind: string;
  title: string;
  shortDesc?: string;
  htmlContent?: string;
  quizId?: string;
  order: number;
  createdAt: string;
  quiz?: any;
}

const KIND_OPTIONS = ["lesson", "rule", "practice", "exam"];
const GRADES = [6, 7, 8, 9, 10, 11, 12];
const QUIZ_TYPES = ["assignment", "homework", "exam"];

export default function AdminPage() {
  const [tab, setTab] = useState<"lessons" | "quizzes">("lessons");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [lessonFilter, setLessonFilter] = useState({ grade: "", kind: "" });
  const [quizFilter, setQuizFilter] = useState({ grade: "" });

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    grade: 6,
    kind: "lesson",
    title: "",
    shortDesc: "",
    htmlContent: "",
    quizId: "",
    order: 0,
  });

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    grade: 6,
    type: "assignment",
    totalPoints: 100,
  });

  // Fetch lessons
  useEffect(() => {
    if (tab === "lessons") fetchLessons();
  }, [lessonFilter, tab]);

  async function fetchLessons() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lessonFilter.grade) params.set("grade", lessonFilter.grade);
      if (lessonFilter.kind) params.set("kind", lessonFilter.kind);

      const res = await fetch(`/api/admin/lessons?${params}`);
      if (!res.ok) {
        console.error("Failed to fetch lessons:", res.statusText);
        setLessons([]);
        return;
      }
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch quizzes
  useEffect(() => {
    if (tab === "quizzes") fetchQuizzes();
  }, [quizFilter, tab]);

  async function fetchQuizzes() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (quizFilter.grade) params.set("grade", quizFilter.grade);

      const res = await fetch(`/api/admin/quizzes?${params}`);
      if (!res.ok) {
        console.error("Failed to fetch quizzes:", res.statusText);
        setQuizzes([]);
        return;
      }
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLessonSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = selectedLesson ? "PUT" : "POST";
      const url = selectedLesson
        ? `/api/admin/lessons/${selectedLesson.id}`
        : `/api/admin/lessons`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess(selectedLesson ? "✓ Хичээл шинэчлэгдсэн" : "✓ Хичээл үүсгэгдсэн");
      setTimeout(() => setSuccess(""), 3000);

      setShowLessonForm(false);
      setSelectedLesson(null);
      setLessonForm({
        grade: 6,
        kind: "lesson",
        title: "",
        shortDesc: "",
        htmlContent: "",
        quizId: "",
        order: 0,
      });
      await fetchLessons();
    } catch (error) {
      console.error("Failed to save lesson:", error);
      alert("Хичээл хадгалахад алдаа гарлаа");
    }
  }

  async function handleLessonDelete(id: string) {
    if (!confirm("Энэ хичээлийг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuccess("✓ Хичээл устгалаа");
      setTimeout(() => setSuccess(""), 3000);
      await fetchLessons();
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      alert("Хичээлийг устгахад алдаа гарлаа");
    }
  }

  function handleEditLesson(lesson: Lesson) {
    setSelectedLesson(lesson);
    setLessonForm({
      grade: lesson.grade,
      kind: lesson.kind,
      title: lesson.title,
      shortDesc: lesson.shortDesc || "",
      htmlContent: lesson.htmlContent || "",
      quizId: lesson.quizId || "",
      order: lesson.order,
    });
    setShowLessonForm(true);
  }

  async function handleQuizSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = selectedQuiz ? "PUT" : "POST";
      const url = selectedQuiz
        ? `/api/admin/quizzes/${selectedQuiz.id}`
        : `/api/admin/quizzes`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizForm),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccess(selectedQuiz ? "✓ Шалгалт шинэчлэгдсэн" : "✓ Шалгалт үүсгэгдсэн");
      setTimeout(() => setSuccess(""), 3000);

      setShowQuizForm(false);
      setSelectedQuiz(null);
      setQuizForm({
        title: "",
        description: "",
        grade: 6,
        type: "assignment",
        totalPoints: 100,
      });
      await fetchQuizzes();
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Шалгалт хадгалахад алдаа гарлаа");
    }
  }

  async function handleQuizDelete(id: string) {
    if (!confirm("Энэ шалгалтыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSuccess("✓ Шалгалт устгалаа");
      setTimeout(() => setSuccess(""), 3000);
      await fetchQuizzes();
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      alert("Шалгалтыг устгахад алдаа гарлаа");
    }
  }

  function handleEditQuiz(quiz: Quiz) {
    setSelectedQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description || "",
      grade: quiz.grade,
      type: quiz.type,
      totalPoints: quiz.totalPoints,
    });
    setShowQuizForm(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-paper-50 to-paper pt-28 pb-16">
      <div className="app-shell max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-ink mb-3">📚 Администратор Панель</h1>
          <p className="text-lg text-ink-muted font-semibold">
            Хичээл, шалгалт, даалгавар үүсгэх, засах, устгах
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-grass-50 border-2 border-grass-100 rounded-xl">
            <p className="text-grass-300 font-bold">{success}</p>
          </div>
        )}

        <div className="mb-8 flex gap-4 border-b-2 border-paper-100">
          <button
            onClick={() => setTab("lessons")}
            className={`px-6 py-3 font-bold text-lg transition-all ${
              tab === "lessons"
                ? "border-b-4 border-sky-300 text-sky-300"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            📖 Хичээлүүд
          </button>
          <button
            onClick={() => setTab("quizzes")}
            className={`px-6 py-3 font-bold text-lg transition-all ${
              tab === "quizzes"
                ? "border-b-4 border-grass-300 text-grass-300"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            ✏️ Шалгалт & Даалгавар
          </button>
        </div>

        {tab === "lessons" && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={lessonFilter.grade}
                onChange={(e) => setLessonFilter({ ...lessonFilter, grade: e.target.value })}
                className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
              >
                <option value="">📊 Бүх анги</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g} анги</option>
                ))}
              </select>

              <select
                value={lessonFilter.kind}
                onChange={(e) => setLessonFilter({ ...lessonFilter, kind: e.target.value })}
                className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
              >
                <option value="">📖 Бүх төрөл</option>
                {KIND_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSelectedLesson(null);
                  setLessonForm({
                    grade: 6,
                    kind: "lesson",
                    title: "",
                    shortDesc: "",
                    htmlContent: "",
                    quizId: "",
                    order: 0,
                  });
                  setShowLessonForm(true);
                }}
                className="px-6 py-2 bg-gradient-to-br from-sky-300 to-sky-400 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
              >
                ✨ Шинэ хичээл
              </button>
            </div>

            {loading ? (
              <p className="text-ink-muted font-semibold text-center py-12">⏳ Уншиж байна...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white rounded-2xl p-6 border-2 border-paper-100 hover:shadow-lg transition-all">
                      <div className="flex gap-2 mb-3">
                        <span className="text-sm font-bold text-sky-300 uppercase bg-sky-50 px-2 py-1 rounded">
                          {lesson.grade} анги
                        </span>
                        <span className="text-sm font-bold text-sand-300 uppercase bg-sand-50 px-2 py-1 rounded">
                          {lesson.kind}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-ink mb-2">{lesson.title}</h3>
                      {lesson.shortDesc && (
                        <p className="text-sm text-ink-muted mb-3 line-clamp-2">{lesson.shortDesc}</p>
                      )}
                      <div className="text-xs text-ink-muted mb-4">
                        {lesson.htmlContent && <p>📄 HTML: {lesson.htmlContent.length} тэмдэгт</p>}
                        {lesson.quiz && <p>🎯 Шалгалт: {lesson.quiz.title}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="flex-1 px-3 py-2 bg-sky-50 text-sky-300 font-bold rounded-lg hover:bg-sky-100 transition"
                        >
                          ✏️ Засах
                        </button>
                        <button
                          onClick={() => handleLessonDelete(lesson.id)}
                          className="flex-1 px-3 py-2 bg-ember-50 text-ember-300 font-bold rounded-lg hover:bg-ember-100 transition"
                        >
                          🗑️ Устгах
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ink-muted text-center col-span-3 py-8">Хичээл байхгүй байна</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "quizzes" && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={quizFilter.grade}
                onChange={(e) => setQuizFilter({ ...quizFilter, grade: e.target.value })}
                className="px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 font-semibold"
              >
                <option value="">📊 Бүх анги</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g} анги</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizForm({
                    title: "",
                    description: "",
                    grade: 6,
                    type: "assignment",
                    totalPoints: 100,
                  });
                  setShowQuizForm(true);
                }}
                className="px-6 py-2 bg-gradient-to-br from-grass-300 to-grass-400 text-white font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
              >
                ✨ Шинэ шалгалт
              </button>
            </div>

            {loading ? (
              <p className="text-ink-muted font-semibold text-center py-12">⏳ Уншиж байна...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-2xl p-6 border-2 border-paper-100 hover:shadow-lg transition-all">
                      <div className="flex gap-2 mb-3">
                        <span className="text-sm font-bold text-grass-300 uppercase bg-grass-50 px-2 py-1 rounded">
                          {quiz.grade} анги
                        </span>
                        <span className="text-sm font-bold text-sand-300 uppercase bg-sand-50 px-2 py-1 rounded">
                          {quiz.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-ink mb-2">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-sm text-ink-muted mb-3 line-clamp-2">{quiz.description}</p>
                      )}
                      <div className="text-xs text-ink-muted mb-4">
                        <p>❓ Асуулт: {quiz.questions?.length || 0}</p>
                        <p>📊 Оноо: {quiz.totalPoints}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditQuiz(quiz)}
                          className="flex-1 px-3 py-2 bg-grass-50 text-grass-300 font-bold rounded-lg hover:bg-grass-100 transition"
                        >
                          ✏️ Засах
                        </button>
                        <button
                          onClick={() => handleQuizDelete(quiz.id)}
                          className="flex-1 px-3 py-2 bg-ember-50 text-ember-300 font-bold rounded-lg hover:bg-ember-100 transition"
                        >
                          🗑️ Устгах
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ink-muted text-center col-span-3 py-8">Шалгалт байхгүй байна</p>
                )}
              </div>
            )}
          </div>
        )}

        {showLessonForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-ink mb-6">
                {selectedLesson ? "🖊️ Хичээл засах" : "✨ Шинэ хичээл үүсгэх"}
              </h2>

              <form onSubmit={handleLessonSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">📊 Анги</label>
                    <select
                      value={lessonForm.grade}
                      onChange={(e) => setLessonForm({ ...lessonForm, grade: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g} анги</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">📖 Төрөл</label>
                    <select
                      value={lessonForm.kind}
                      onChange={(e) => setLessonForm({ ...lessonForm, kind: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    >
                      {KIND_OPTIONS.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">📝 Хичээлийн нэр *</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="жишээ: Үсэг таних үндэс"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">💬 Богино тайлбар</label>
                  <input
                    type="text"
                    value={lessonForm.shortDesc}
                    onChange={(e) => setLessonForm({ ...lessonForm, shortDesc: e.target.value })}
                    placeholder="жишээ: Монгол үсгийн суурь элементүүдийг сурах"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">📄 HTML Агуулга</label>
                  <textarea
                    value={lessonForm.htmlContent}
                    onChange={(e) => setLessonForm({ ...lessonForm, htmlContent: e.target.value })}
                    placeholder="<h2>Үзүүлэх заголовок</h2><p>Энэ нь хичээлийн агуулга юм...</p>"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 h-32 font-mono text-sm"
                  />
                  <p className="text-xs text-ink-muted mt-2">💡 HTML теги ашиглан формат хийж болно</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">🎯 Шалгалт сонгох</label>
                  <select
                    value={lessonForm.quizId}
                    onChange={(e) => setLessonForm({ ...lessonForm, quizId: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-sky-300 font-semibold"
                  >
                    <option value="">--- Шалгалт сонголгүй ---</option>
                    {quizzes.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-sky-300 to-sky-400 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    {selectedLesson ? "✓ Өөрчлөх" : "✓ Үүсгэх"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLessonForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-ink font-bold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    ✕ Цуцлах
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showQuizForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-ink mb-6">
                {selectedQuiz ? "🖊️ Шалгалт засах" : "✨ Шинэ шалгалт үүсгэх"}
              </h2>

              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">📊 Анги</label>
                    <select
                      value={quizForm.grade}
                      onChange={(e) => setQuizForm({ ...quizForm, grade: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 font-semibold"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g} анги</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">📝 Төрөл</label>
                    <select
                      value={quizForm.type}
                      onChange={(e) => setQuizForm({ ...quizForm, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 font-semibold"
                    >
                      {QUIZ_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">🎯 Шалгалтын нэр *</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="жишээ: 6-р ангийн үсэг таних шалгалт"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">💬 Тайлбар</label>
                  <textarea
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    placeholder="энэ шалгалтыг ямар зүйлийн үндсэн дээр хийлээ гэдэг"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 h-24 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-ink mb-2">📊 Нийт оноо</label>
                  <input
                    type="number"
                    value={quizForm.totalPoints}
                    onChange={(e) => setQuizForm({ ...quizForm, totalPoints: parseInt(e.target.value) })}
                    placeholder="100"
                    className="w-full px-4 py-2 rounded-lg border border-paper-100 focus:outline-none focus:ring-2 focus:ring-grass-300 font-semibold"
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-grass-300 to-grass-400 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    {selectedQuiz ? "✓ Өөрчлөх" : "✓ Үүсгэх"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuizForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-ink font-bold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    ✕ Цуцлах
                  </button>
                </div>
              </form>

              {selectedQuiz && (
                <div className="mt-8 pt-8 border-t-2 border-paper-100">
                  <h3 className="text-xl font-bold text-ink mb-4">❓ Асуултууд ({selectedQuiz.questions?.length || 0})</h3>
                  {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
                    selectedQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="mb-3 p-3 bg-paper-50 rounded-lg border border-paper-100">
                        <p className="text-sm font-bold text-ink">{idx + 1}. {q.question}</p>
                        <p className="text-xs text-ink-muted mt-1">{q.points} оноо</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-ink-muted">Асуулт байхгүй байна</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
