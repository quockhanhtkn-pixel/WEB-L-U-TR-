import React, { useState } from 'react';
import { Task, TaskStatus, UserRole } from '../types';
import { CLASS_OPTIONS, SUBJECT_OPTIONS, ADMIN_INFO } from '../data/initialData';
import { soundManager } from '../utils/audio';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  UserCheck,
  ChevronDown,
  X,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  currentRole: UserRole;
  currentClass: string;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTaskRequest: (taskId: string, title: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  currentRole,
  currentClass,
  onAddTask,
  onUpdateTask,
  onDeleteTaskRequest,
  onToggleTaskStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | TaskStatus>('all');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formClass, setFormClass] = useState('11A1 (Chuyên Tin)');
  const [formSubject, setFormSubject] = useState('Toán học');
  const [formDueDate, setFormDueDate] = useState('');
  const [formStatus, setFormStatus] = useState<TaskStatus>('not_started');

  // Open Create Modal
  const handleOpenCreate = () => {
    soundManager.playClick();
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormClass(CLASS_OPTIONS[1] || '11A1 (Chuyên Tin)');
    setFormSubject('Toán học');
    // Default due date: 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setFormDueDate(nextWeek.toISOString().split('T')[0]);
    setFormStatus('not_started');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    soundManager.playClick();
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormClass(task.targetClass);
    setFormSubject(task.subject);
    setFormDueDate(task.dueDate);
    setFormStatus(task.status);
    setIsModalOpen(true);
  };

  // Submit Modal Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formTitle.trim(),
        description: formDesc.trim(),
        targetClass: formClass,
        subject: formSubject,
        dueDate: formDueDate,
        status: formStatus,
      });
    } else {
      onAddTask({
        title: formTitle.trim(),
        description: formDesc.trim(),
        targetClass: formClass,
        subject: formSubject,
        dueDate: formDueDate,
        status: formStatus,
        assignedBy: ADMIN_INFO.teacherName,
      });
    }
    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClassFilter === 'all' ||
      task.targetClass === selectedClassFilter ||
      task.targetClass === 'Tất cả các lớp';

    const matchesStatus =
      selectedStatusFilter === 'all' || task.status === selectedStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã hoàn thành
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Đang thực hiện
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Chưa bắt đầu
          </span>
        );
    }
  };

  return (
    <div id="tasks-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar: Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Quản Lý Nhiệm Vụ Học Tập
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                {currentRole === 'teacher'
                  ? 'Giao bài tập, chuyên đề thực hành và theo dõi tình trạng thực hiện của các lớp'
                  : 'Danh sách các nhiệm vụ được giao. Bấm nút để đánh dấu hoàn thành'}
              </p>
            </div>
          </div>
        </div>

        {currentRole === 'teacher' && (
          <button
            id="btn-add-new-task"
            onClick={handleOpenCreate}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Thêm Nhiệm Vụ Mới
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-tasks"
              type="text"
              placeholder="Tìm kiếm theo tên nhiệm vụ, môn học, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Class Filter */}
          <div className="w-full md:w-60">
            <select
              id="select-filter-task-class"
              value={selectedClassFilter}
              onChange={(e) => {
                soundManager.playClick();
                setSelectedClassFilter(e.target.value);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả lớp học</option>
              {CLASS_OPTIONS.filter((c) => c !== 'Tất cả các lớp').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 text-xs font-semibold">
          <span className="text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc trạng thái:
          </span>
          {[
            { id: 'all', label: `Tất cả (${tasks.length})` },
            {
              id: 'not_started',
              label: `Chưa bắt đầu (${tasks.filter((t) => t.status === 'not_started').length})`,
            },
            {
              id: 'in_progress',
              label: `Đang thực hiện (${tasks.filter((t) => t.status === 'in_progress').length})`,
            },
            {
              id: 'completed',
              label: `Đã hoàn thành (${tasks.filter((t) => t.status === 'completed').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedStatusFilter(tab.id as 'all' | TaskStatus);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy nhiệm vụ nào</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc lớp / trạng thái.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              id={`task-card-${task.id}`}
              className={`bg-white rounded-3xl p-5 md:p-6 border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                task.status === 'completed'
                  ? 'border-emerald-200/80 bg-emerald-50/15'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {task.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                      {task.targetClass}
                    </span>
                  </div>
                  <div>{getStatusBadge(task.status)}</div>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Footer info & Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Hạn nộp: <strong className="text-slate-900">{task.dueDate}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Giao bởi: GV {task.assignedBy}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {/* Student toggle completion button */}
                  <button
                    id={`btn-toggle-task-status-${task.id}`}
                    onClick={() => {
                      soundManager.playSuccess();
                      onToggleTaskStatus(task.id);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all cursor-pointer active:scale-95 ${
                      task.status === 'completed'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-800 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {task.status === 'completed'
                      ? 'Đã hoàn thành (Bấm để mở lại)'
                      : 'Đánh dấu hoàn thành'}
                  </button>

                  {/* Teacher Edit & Delete buttons */}
                  {currentRole === 'teacher' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        id={`btn-edit-task-${task.id}`}
                        onClick={() => handleOpenEdit(task)}
                        className="p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                        title="Chỉnh sửa nhiệm vụ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-task-${task.id}`}
                        onClick={() => onDeleteTaskRequest(task.id, task.title)}
                        className="p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                        title="Xóa nhiệm vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Thêm / Chỉnh sửa nhiệm vụ */}
      {isModalOpen && (
        <div
          id="modal-task-form"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                {editingTask ? 'Chỉnh Sửa Nhiệm Vụ Học Tập' : 'Tạo Nhiệm Vụ Học Tập Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Tên nhiệm vụ học tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập chuyên đề Giải tích & Giới hạn..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Subject & Target Class */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Lớp áp dụng
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date & Initial Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Thời hạn hoàn thành <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Trạng thái khởi tạo
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="not_started">Chưa bắt đầu</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Mô tả chi tiết yêu cầu nhiệm vụ
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú cụ thể các bài tập cần làm, hướng dẫn nộp bài, chỉ tiêu đánh giá..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 active:scale-95 transition-all"
                >
                  {editingTask ? 'Lưu Thay Đổi' : 'Tạo Nhiệm Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
