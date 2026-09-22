import React from 'react';
import { UserRole, Task, Quiz, Student, Announcement, ActiveTab } from '../types';
import { soundManager } from '../utils/audio';
import {
  Users,
  CheckCircle,
  FileQuestion,
  TrendingUp,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  AlertCircle,
  CheckSquare,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  currentRole: UserRole;
  currentStudent: Student;
  tasks: Task[];
  quizzes: Quiz[];
  students: Student[];
  announcements: Announcement[];
  academicYear?: string;
  onNavigate: (tab: ActiveTab) => void;
  onOpenCreateTask?: () => void;
  onOpenCreateQuiz?: () => void;
  onOpenCreateAnnouncement?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  currentStudent,
  tasks,
  quizzes,
  students,
  announcements,
  academicYear = 'Năm học 2026 - 2027',
  onNavigate,
  onOpenCreateTask,
  onOpenCreateQuiz,
  onOpenCreateAnnouncement,
}) => {
  // Statistics calculations
  const totalStudents = students.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingQuizzes = quizzes.filter((q) => !q.completed).length;

  const totalPossible = students.reduce((acc, s) => acc + s.tasksTotal, 0);
  const totalDone = students.reduce((acc, s) => acc + s.tasksCompleted, 0);
  const avgCompletionRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

  const avgScore = (
    students.reduce((acc, s) => acc + s.averageScore, 0) / (students.length || 1)
  ).toFixed(1);

  // Group students by class for class comparison
  const classesSummary = [
    { name: '11A1 (Chuyên Tin)', students: students.filter((s) => s.className.includes('11A1')) },
    { name: '10A2 (Chuyên Lý)', students: students.filter((s) => s.className.includes('10A2')) },
    { name: '11A2 (Chuyên Hóa)', students: students.filter((s) => s.className.includes('11A2')) },
    { name: '12A1 (Chuyên Sinh)', students: students.filter((s) => s.className.includes('12A1')) },
  ].map((c) => {
    const classTotal = c.students.reduce((acc, s) => acc + s.tasksTotal, 0);
    const classDone = c.students.reduce((acc, s) => acc + s.tasksCompleted, 0);
    const rate = classTotal > 0 ? Math.round((classDone / classTotal) * 100) : 0;
    const avgScoreClass = (
      c.students.reduce((acc, s) => acc + s.averageScore, 0) / (c.students.length || 1)
    ).toFixed(1);
    return {
      ...c,
      rate,
      avgScoreClass,
      count: c.students.length,
    };
  });

  // Recent tasks
  const recentTasks = tasks.slice(0, 4);

  // Student mode personalized stats
  const studentCompletionPercent =
    currentStudent.tasksTotal > 0
      ? Math.round((currentStudent.tasksCompleted / currentStudent.tasksTotal) * 100)
      : 0;

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Banner / Welcome */}
      {currentRole === 'teacher' ? (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-700/15 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-blue-100 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Bảng điều khiển Giảng dạy & Đánh giá
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-slate-900" />
                {academicYear}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Xin chào, Cô Nguyễn Thị Quốc Khánh!
            </h2>
            <p className="mt-2 text-blue-100 text-sm md:text-base leading-relaxed">
              Hệ thống ghi nhận <strong className="text-white">{totalStudents} học sinh</strong>{' '}
              thuộc các lớp chuyên đang hoạt động tích cực. Tỷ lệ hoàn thành nhiệm vụ trung bình toàn trường đạt{' '}
              <strong className="text-amber-300 font-bold">{avgCompletionRate}%</strong>.
            </p>

            {/* Quick Actions for Teacher */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {onOpenCreateTask && (
                <button
                  id="btn-quick-create-task"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenCreateTask();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-sm hover:bg-blue-50 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  + Giao nhiệm vụ mới
                </button>
              )}
              {onOpenCreateQuiz && (
                <button
                  id="btn-quick-create-quiz"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenCreateQuiz();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all backdrop-blur-xs active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <FileQuestion className="w-4 h-4 text-amber-300" />
                  + Tạo bài kiểm tra
                </button>
              )}
              {onOpenCreateAnnouncement && (
                <button
                  id="btn-quick-create-announcement"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenCreateAnnouncement();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all backdrop-blur-xs active:scale-95 cursor-pointer"
                >
                  + Đăng thông báo
                </button>
              )}
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>
      ) : (
        /* Student Welcome Card */
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-indigo-700/15 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Không gian Học tập Cá nhân
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-slate-900" />
                {academicYear}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Chào em, {currentStudent.name}!
            </h2>
            <p className="mt-2 text-indigo-100 text-sm md:text-base leading-relaxed">
              Lớp: <strong className="text-white">{currentStudent.className}</strong> • Điểm trung bình hiện tại: <strong className="text-amber-300 font-bold">{currentStudent.averageScore}/10</strong>.
              Em đã hoàn thành <strong className="text-white">{currentStudent.tasksCompleted}/{currentStudent.tasksTotal}</strong> nhiệm vụ học tập.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                id="btn-student-view-tasks"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('tasks');
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-800 font-bold text-sm hover:bg-indigo-50 transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Xem nhiệm vụ cần làm
              </button>
              <button
                id="btn-student-do-quiz"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('quizzes');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition-all backdrop-blur-xs active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <FileQuestion className="w-4 h-4 text-amber-300" />
                Làm bài tập & kiểm tra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Học sinh */}
        <div
          id="stat-card-students"
          onClick={() => {
            soundManager.playClick();
            onNavigate('progress');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">
              {currentRole === 'teacher' ? 'Tổng số học sinh' : 'Lớp học của em'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentRole === 'teacher' ? `${totalStudents} em` : currentStudent.className}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100% chuyên ban</span>
            <span>• Dữ liệu mẫu</span>
          </p>
        </div>

        {/* Card 2: Nhiệm vụ đang giao */}
        <div
          id="stat-card-tasks"
          onClick={() => {
            soundManager.playClick();
            onNavigate('tasks');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">
              {currentRole === 'teacher' ? 'Nhiệm vụ đang giao' : 'Nhiệm vụ của em'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentRole === 'teacher'
              ? `${tasks.length} nhiệm vụ`
              : `${currentStudent.tasksCompleted}/${currentStudent.tasksTotal} hoàn thành`}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{inProgressTasks} đang thực hiện tuần này</span>
          </p>
        </div>

        {/* Card 3: Bài tập cần hoàn thành */}
        <div
          id="stat-card-quizzes"
          onClick={() => {
            soundManager.playClick();
            onNavigate('quizzes');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">Bài tập & Kiểm tra</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {quizzes.length} đề bài
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-blue-600 font-semibold">
              {pendingQuizzes} đề mở kiểm tra
            </span>
            <span>trắc nghiệm</span>
          </p>
        </div>

        {/* Card 4: Tỷ lệ hoàn thành */}
        <div
          id="stat-card-rate"
          onClick={() => {
            soundManager.playClick();
            onNavigate('progress');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-500">
              {currentRole === 'teacher' ? 'Tỷ lệ hoàn thành' : 'Tiến độ học tập'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {currentRole === 'teacher' ? `${avgCompletionRate}%` : `${studentCompletionPercent}%`}
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${currentRole === 'teacher' ? avgCompletionRate : studentCompletionPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Class Progress Breakdown & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tiến độ theo từng lớp (Trực quan & Dễ chiếu máy chiếu) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Tiến độ Hoàn thành theo Lớp học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thống kê tỷ lệ nộp bài và điểm trung bình từng lớp chuyên (Dữ liệu mẫu)
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('progress');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {classesSummary.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/40 transition-colors"
              >
                <div className="flex items-center justify-between text-sm font-semibold mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.count} học sinh mẫu
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Điểm TB: <strong className="text-slate-800">{item.avgScoreClass}</strong>
                    </span>
                    <span className="font-bold text-blue-700">{item.rate}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.rate >= 80
                        ? 'bg-emerald-500'
                        : item.rate >= 60
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice for Projector / Teachers */}
          <div className="mt-5 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center gap-3 text-xs text-blue-900">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Ghi chú sư phạm:</strong> Lớp 11A1 và 12A1 duy trì tỷ lệ hoàn thành trên 85%. Lớp 11A2 có 2 học sinh cần giáo viên đôn đốc trước hạn chót.
            </span>
          </div>
        </div>

        {/* Right Column: Nhiệm vụ & Thông báo gần đây */}
        <div className="space-y-6">
          {/* Recent Tasks Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Nhiệm vụ gần đây
              </h3>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('tasks');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-3">
              {recentTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate('tasks');
                  }}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {t.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                        t.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status === 'completed'
                        ? 'Hoàn thành'
                        : t.status === 'in_progress'
                        ? 'Đang làm'
                        : 'Chưa làm'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="text-indigo-600 font-medium">{t.targetClass}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Hạn: {t.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Thông báo mới nhất
              </h3>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('announcements');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Xem hết
              </button>
            </div>
            {announcements[0] && (
              <div
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('announcements');
                }}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide mb-1">
                  <span>{announcements[0].author}</span>
                  <span>•</span>
                  <span>{announcements[0].createdAt.split(' ')[0]}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {announcements[0].title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {announcements[0].content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
