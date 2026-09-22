import React, { useState } from 'react';
import { Student, UserRole, Task, Quiz } from '../types';
import { CLASS_OPTIONS } from '../data/initialData';
import { soundManager } from '../utils/audio';
import {
  TrendingUp,
  Search,
  Filter,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Star,
  Eye,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ProgressViewProps {
  students: Student[];
  currentRole: UserRole;
  currentStudent: Student;
  tasks: Task[];
  quizzes: Quiz[];
  academicYear?: string;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  students,
  currentRole,
  currentStudent,
  tasks,
  quizzes,
  academicYear = 'Năm học 2026 - 2027',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClassFilter === 'all' || s.className.includes(selectedClassFilter);

    const matchesStatus =
      selectedStatusFilter === 'all' || s.status === selectedStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'excellent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Xuất sắc
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            Cần cố gắng
          </span>
        );
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            Đạt yêu cầu
          </span>
        );
    }
  };

  return (
    <div id="progress-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Theo Dõi Tiến Độ Học Tập
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                Dữ liệu mẫu
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {currentRole === 'teacher'
                ? 'Tổng hợp mức độ hoàn thành nhiệm vụ, điểm kiểm tra và xếp loại rèn luyện của học sinh'
                : 'Hồ sơ tiến độ học tập cá nhân và các thành tích đã đạt được'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            {academicYear}
          </span>
        </div>
      </div>

      {/* Student Mode: Personalized Progress Card */}
      {currentRole === 'student' && (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ${currentStudent.avatarBg}`}
                >
                  {currentStudent.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black">{currentStudent.name}</h3>
                    {getStatusBadge(currentStudent.status)}
                  </div>
                  <p className="text-sm text-blue-200 mt-1">
                    Lớp: {currentStudent.className} • Mã HS: {currentStudent.studentCode} • Hạnh kiểm: {currentStudent.conduct}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <Award className="w-8 h-8 text-amber-300 shrink-0" />
                <div>
                  <span className="text-xs text-blue-200 block">Điểm trung bình kiểm tra</span>
                  <span className="text-2xl font-black text-amber-300">
                    {currentStudent.averageScore} / 10.0
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-blue-200 font-semibold block mb-1">
                  Nhiệm vụ đã hoàn thành
                </span>
                <div className="text-xl font-black">
                  {currentStudent.tasksCompleted} / {currentStudent.tasksTotal} nhiệm vụ
                </div>
                <div className="w-full bg-white/20 h-2.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (currentStudent.tasksCompleted / (currentStudent.tasksTotal || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-emerald-300 font-semibold mt-1.5 block">
                  Đạt{' '}
                  {Math.round(
                    (currentStudent.tasksCompleted / (currentStudent.tasksTotal || 1)) * 100
                  )}
                  % mục tiêu học tập
                </span>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-blue-200 font-semibold block mb-1">
                  Nhiệm vụ còn lại cần làm
                </span>
                <div className="text-xl font-black text-amber-300">
                  {Math.max(0, currentStudent.tasksTotal - currentStudent.tasksCompleted)} nhiệm vụ
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Vui lòng kiểm tra hạn nộp trong mục "Quản lý nhiệm vụ" để nộp đúng hạn.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-blue-200 font-semibold block mb-1">
                  Nhận xét của Giáo viên
                </span>
                <p className="text-xs text-blue-100 italic leading-relaxed">
                  "{currentStudent.note || 'Học sinh có ý thức học tập tốt và tích cực tham gia các hoạt động chuyên môn.'}"
                </p>
                <span className="text-[10px] text-blue-300 font-semibold mt-2 block">
                  — Cô Nguyễn Thị Quốc Khánh
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Table View */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {currentRole === 'teacher'
              ? 'Bảng Thống Kê Học Sinh Toàn Bộ Các Lớp'
              : 'Danh Sách Học Sinh Trong Khối (Tham Khảo Dữ Liệu Mẫu)'}
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Hiển thị {filteredStudents.length} / {students.length} học sinh
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh hoặc mã số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedClassFilter}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedClassFilter(e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer"
            >
              <option value="all">Tất cả các lớp</option>
              <option value="11A1">11A1 (Chuyên Tin)</option>
              <option value="10A2">10A2 (Chuyên Lý)</option>
              <option value="11A2">11A2 (Chuyên Hóa)</option>
              <option value="12A1">12A1 (Chuyên Sinh)</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedStatusFilter}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedStatusFilter(e.target.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer"
            >
              <option value="all">Tất cả xếp loại</option>
              <option value="excellent">Xuất sắc</option>
              <option value="active">Đạt yêu cầu</option>
              <option value="warning">Cần cố gắng</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Học sinh</th>
                <th className="p-4">Lớp</th>
                <th className="p-4 text-center">Nhiệm vụ xong</th>
                <th className="p-4 text-center">Chưa xong</th>
                <th className="p-4">Tỷ lệ hoàn thành</th>
                <th className="p-4 text-center">Điểm TB</th>
                <th className="p-4 text-center">Đánh giá</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((s) => {
                const pendingCount = Math.max(0, s.tasksTotal - s.tasksCompleted);
                const percent =
                  s.tasksTotal > 0 ? Math.round((s.tasksCompleted / s.tasksTotal) * 100) : 0;

                return (
                  <tr
                    key={s.id}
                    id={`student-row-${s.id}`}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${s.avatarBg}`}
                        >
                          {s.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-xs text-slate-400">{s.studentCode}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">{s.className}</td>

                    <td className="p-4 text-center font-bold text-emerald-600">
                      {s.tasksCompleted} / {s.tasksTotal}
                    </td>

                    <td className="p-4 text-center">
                      {pendingCount > 0 ? (
                        <span className="font-bold text-rose-600">{pendingCount} bài</span>
                      ) : (
                        <span className="text-xs text-slate-400">0</span>
                      )}
                    </td>

                    <td className="p-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent >= 80
                                ? 'bg-emerald-500'
                                : percent >= 60
                                ? 'bg-blue-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-9 text-right">
                          {percent}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center font-extrabold text-blue-700 text-base">
                      {s.averageScore}
                    </td>

                    <td className="p-4 text-center">{getStatusBadge(s.status)}</td>

                    <td className="p-4 text-center">
                      <button
                        id={`btn-view-student-${s.id}`}
                        onClick={() => {
                          soundManager.playClick();
                          setDetailStudent(s);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-semibold text-xs text-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Student Detail View */}
      {detailStudent && (
        <div
          id="modal-student-detail"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl text-white font-extrabold text-base flex items-center justify-center ${detailStudent.avatarBg}`}
                >
                  {detailStudent.name.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{detailStudent.name}</h3>
                  <p className="text-xs text-slate-500">
                    Mã: {detailStudent.studentCode} • {detailStudent.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block">Nhiệm vụ hoàn thành</span>
                  <span className="text-xl font-black text-emerald-600">
                    {detailStudent.tasksCompleted} / {detailStudent.tasksTotal}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block">Điểm trung bình</span>
                  <span className="text-xl font-black text-blue-700">
                    {detailStudent.averageScore} / 10.0
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-xs font-bold text-blue-900 block mb-1">
                  Nhận xét sư phạm của giáo viên:
                </span>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{detailStudent.note || 'Học sinh chuyên cần, tuân thủ nội quy học tập.'}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  Trạng thái rèn luyện:
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span>Hạnh kiểm: <strong>{detailStudent.conduct}</strong></span>
                  <div>{getStatusBadge(detailStudent.status)}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailStudent(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
