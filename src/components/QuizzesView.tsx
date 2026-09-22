import React, { useState } from 'react';
import { Quiz, QuizQuestion, UserRole } from '../types';
import { CLASS_OPTIONS, SUBJECT_OPTIONS } from '../data/initialData';
import { soundManager } from '../utils/audio';
import {
  FileQuestion,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Award,
  ChevronRight,
  Trash2,
  Edit2,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
  X,
} from 'lucide-react';

interface QuizzesViewProps {
  quizzes: Quiz[];
  currentRole: UserRole;
  onAddQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  onUpdateQuiz: (quiz: Quiz) => void;
  onDeleteQuizRequest: (quizId: string, title: string) => void;
  onSubmitQuizAnswers: (quizId: string, answers: Record<string, string>, score: number) => void;
  onResetQuizAttempt: (quizId: string) => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  quizzes,
  currentRole,
  onAddQuiz,
  onUpdateQuiz,
  onDeleteQuizRequest,
  onSubmitQuizAnswers,
  onResetQuizAttempt,
}) => {
  // Active test taking state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [resultScore, setResultScore] = useState<number | null>(null);

  // Tab filter: 'all' | 'pending' | 'completed'
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');

  // Teacher Create Quiz Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newClass, setNewClass] = useState('11A1 (Chuyên Tin)');
  const [newSubject, setNewSubject] = useState('Tin học');
  const [newDuration, setNewDuration] = useState(15);
  const [newDueDate, setNewDueDate] = useState('');
  const [newQuestions, setNewQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-demo-1',
      question: 'Phần tử đầu tiên trong mảng index-0 có chỉ số là gì?',
      options: [
        { id: 'opt-a', text: '0' },
        { id: 'opt-b', text: '1' },
        { id: 'opt-c', text: '-1' },
        { id: 'opt-d', text: 'Tùy theo ngôn ngữ lập trình' },
      ],
      correctOptionId: 'opt-a',
      explanation: 'Trong đa số ngôn ngữ lập trình như C++, Java, Python, mảng có chỉ số bắt đầu từ 0.',
    },
  ]);

  // Open Quiz for Taking / Reviewing
  const handleStartQuiz = (quiz: Quiz) => {
    soundManager.playClick();
    setActiveQuiz(quiz);
    if (quiz.completed && quiz.selectedAnswers) {
      setSelectedAnswers(quiz.selectedAnswers);
      setIsSubmitted(true);
      setResultScore(quiz.score || 0);
    } else {
      setSelectedAnswers({});
      setIsSubmitted(false);
      setResultScore(null);
    }
  };

  // Student selects an option
  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    soundManager.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit test answers
  const handleSubmitTest = () => {
    if (!activeQuiz) return;
    soundManager.playSuccess();

    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    const calculatedScore = Number(
      ((correctCount / (activeQuiz.questions.length || 1)) * 10).toFixed(1)
    );

    setResultScore(calculatedScore);
    setIsSubmitted(true);

    onSubmitQuizAnswers(activeQuiz.id, selectedAnswers, calculatedScore);
  };

  // Retake test
  const handleRetakeTest = () => {
    if (!activeQuiz) return;
    soundManager.playClick();
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResultScore(null);
    onResetQuizAttempt(activeQuiz.id);
  };

  // Open Create Quiz Modal
  const handleOpenCreateQuiz = () => {
    soundManager.playClick();
    setNewTitle('');
    setNewDesc('');
    setNewClass(CLASS_OPTIONS[1] || '11A1 (Chuyên Tin)');
    setNewSubject('Tin học');
    setNewDuration(15);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setNewDueDate(nextWeek.toISOString().split('T')[0]);
    setIsCreateModalOpen(true);
  };

  // Add question to builder
  const handleAddQuestionToBuilder = () => {
    soundManager.playClick();
    const newQId = `q-${Date.now()}`;
    setNewQuestions((prev) => [
      ...prev,
      {
        id: newQId,
        question: `Câu hỏi trắc nghiệm số ${prev.length + 1}:`,
        options: [
          { id: 'opt-a', text: 'Phương án A' },
          { id: 'opt-b', text: 'Phương án B' },
          { id: 'opt-c', text: 'Phương án C' },
          { id: 'opt-d', text: 'Phương án D' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Giải thích lý do phương án này chính xác theo kiến thức SGK.',
      },
    ]);
  };

  // Submit new Quiz
  const handleSaveNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddQuiz({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Bài tập trắc nghiệm củng cố kiến thức.',
      targetClass: newClass,
      subject: newSubject,
      durationMinutes: Number(newDuration) || 15,
      dueDate: newDueDate,
      questions: newQuestions,
    });

    setIsCreateModalOpen(false);
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (filterTab === 'pending') return !q.completed;
    if (filterTab === 'completed') return q.completed;
    return true;
  });

  return (
    <div id="quizzes-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Test Taking / Reviewing View */}
      {activeQuiz ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <button
                id="btn-back-to-quiz-list"
                onClick={() => {
                  soundManager.playClick();
                  setActiveQuiz(null);
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Trở lại danh sách</span>
              </button>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                  {activeQuiz.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-blue-700">{activeQuiz.subject}</span>
                  <span>•</span>
                  <span>{activeQuiz.targetClass}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeQuiz.durationMinutes} phút
                  </span>
                </p>
              </div>
            </div>

            {/* Score pill if submitted */}
            {isSubmitted && resultScore !== null && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-2xl shadow-xs">
                <Award className="w-7 h-7 text-emerald-600" />
                <div>
                  <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                    Điểm kết quả
                  </span>
                  <div className="text-xl font-black text-emerald-800">
                    {resultScore} / 10 điểm
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {activeQuiz.description}
          </p>

          {/* Questions List */}
          <div className="space-y-8">
            {activeQuiz.questions.map((q, index) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-blue-100 text-blue-800 text-xs font-black mr-2.5">
                        {index + 1}
                      </span>
                      {q.question}
                    </h4>

                    {isSubmitted && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Chưa chính xác
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* 4 Multiple Choice Options (A, B, C, D) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {q.options.map((opt, optIndex) => {
                      const letter = ['A', 'B', 'C', 'D'][optIndex] || `${optIndex + 1}`;
                      const isSelected = selectedOpt === opt.id;
                      const isTheCorrectOne = opt.id === q.correctOptionId;

                      let btnStyle =
                        'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/30';

                      if (!isSubmitted) {
                        if (isSelected) {
                          btnStyle =
                            'bg-blue-600 border-blue-600 text-white font-bold shadow-sm shadow-blue-600/25';
                        }
                      } else {
                        if (isTheCorrectOne) {
                          btnStyle =
                            'bg-emerald-600 border-emerald-600 text-white font-bold shadow-sm';
                        } else if (isSelected && !isTheCorrectOne) {
                          btnStyle =
                            'bg-rose-500 border-rose-500 text-white font-bold shadow-sm';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-sm md:text-base transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected || (isSubmitted && isTheCorrectOne)
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1 leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs md:text-sm text-slate-700 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">Giải thích chi tiết: </strong>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Đã trả lời:{' '}
              <strong className="text-slate-900">
                {Object.keys(selectedAnswers).length} / {activeQuiz.questions.length} câu
              </strong>
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <button
                  id="btn-submit-quiz-answers"
                  onClick={handleSubmitTest}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm md:text-base shadow-lg shadow-blue-600/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Nộp Bài Kiểm Tra
                </button>
              ) : (
                <button
                  id="btn-retake-quiz"
                  onClick={handleRetakeTest}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm md:text-base shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm Lại Để Rèn Luyện
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quizzes List View */
        <>
          {/* Top banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    Bài Tập & Đề Kiểm Tra Trắc Nghiệm
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                    {currentRole === 'teacher'
                      ? 'Xây dựng ngân hàng đề kiểm tra 15 phút, 1 tiết, chấm điểm tự động tức thì'
                      : 'Học sinh chọn bài tập để làm, xem kết quả chấm điểm và lời giải thích'}
                  </p>
                </div>
              </div>
            </div>

            {currentRole === 'teacher' && (
              <button
                id="btn-open-create-quiz"
                onClick={handleOpenCreateQuiz}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Tạo Đề Kiểm Tra Mới
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'all', label: `Tất cả bài tập (${quizzes.length})` },
              {
                id: 'pending',
                label: `Chưa hoàn thành (${quizzes.filter((q) => !q.completed).length})`,
              },
              {
                id: 'completed',
                label: `Đã hoàn thành (${quizzes.filter((q) => q.completed).length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setFilterTab(tab.id as 'all' | 'pending' | 'completed');
                }}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                id={`quiz-card-${quiz.id}`}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {quiz.subject}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {quiz.targetClass}
                      </span>
                    </div>

                    {quiz.completed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã nộp • {quiz.score}/10đ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        Chưa làm
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {quiz.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                    <span className="flex items-center gap-1">
                      <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                      {quiz.questions.length} câu trắc nghiệm
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {quiz.durationMinutes} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      Hạn: {quiz.dueDate}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    id={`btn-open-quiz-${quiz.id}`}
                    onClick={() => handleStartQuiz(quiz)}
                    className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-95 ${
                      quiz.completed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                    }`}
                  >
                    {quiz.completed ? (
                      <>
                        <Award className="w-4 h-4 text-emerald-600" />
                        Xem Lại Kết Quả & Lời Giải
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Bắt Đầu Làm Bài
                      </>
                    )}
                  </button>

                  {currentRole === 'teacher' && (
                    <button
                      id={`btn-delete-quiz-${quiz.id}`}
                      onClick={() => onDeleteQuizRequest(quiz.id, quiz.title)}
                      className="p-3 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Xóa bài kiểm tra"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal: Teacher creates new quiz */}
      {isCreateModalOpen && (
        <div
          id="modal-create-quiz"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                Tạo Đề Kiểm Tra & Bài Tập Trắc Nghiệm Mới
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Tên bài tập / bài kiểm tra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kiểm tra 15 phút - Cấu trúc dữ liệu..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Lớp áp dụng
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Mô tả / Hướng dẫn làm bài
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú quy chế tính điểm, hình thức trắc nghiệm..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Questions Builder Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Danh sách câu hỏi trắc nghiệm ({newQuestions.length} câu)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionToBuilder}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {newQuestions.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">
                          Câu hỏi {qIndex + 1}
                        </span>
                        {newQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setNewQuestions((prev) => prev.filter((item) => item.id !== q.id))
                            }
                            className="text-xs text-rose-500 hover:text-rose-700"
                          >
                            Xóa câu này
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Nội dung câu hỏi..."
                        value={q.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewQuestions((prev) =>
                            prev.map((item) =>
                              item.id === q.id ? { ...item, question: val } : item
                            )
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIdx) => (
                          <div key={opt.id} className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-500 w-4">
                              {['A', 'B', 'C', 'D'][optIdx]}:
                            </span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const newTxt = e.target.value;
                                setNewQuestions((prev) =>
                                  prev.map((item) => {
                                    if (item.id !== q.id) return item;
                                    return {
                                      ...item,
                                      options: item.options.map((o) =>
                                        o.id === opt.id ? { ...o, text: newTxt } : o
                                      ),
                                    };
                                  })
                                );
                              }}
                              className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded-md"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-xs pt-1">
                        <label className="font-semibold text-slate-700">Đáp án đúng:</label>
                        <select
                          value={q.correctOptionId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id ? { ...item, correctOptionId: val } : item
                              )
                            );
                          }}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-md font-bold text-blue-700"
                        >
                          <option value="opt-a">Phương án A</option>
                          <option value="opt-b">Phương án B</option>
                          <option value="opt-c">Phương án C</option>
                          <option value="opt-d">Phương án D</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-95 transition-all"
                >
                  Lưu & Xuất Bản Đề Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
