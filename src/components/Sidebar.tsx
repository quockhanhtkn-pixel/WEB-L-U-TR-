import React from 'react';
import { ActiveTab, UserRole, Student } from '../types';
import { soundManager } from '../utils/audio';
import {
  LayoutDashboard,
  CheckSquare,
  FileQuestion,
  TrendingUp,
  Bell,
  User,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentRole: UserRole;
  currentStudent: Student;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  unreadAnnouncementsCount: number;
  pendingTasksCount: number;
  pendingQuizzesCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  currentStudent,
  students,
  onSelectStudent,
  unreadAnnouncementsCount,
  pendingTasksCount,
  pendingQuizzesCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Tổng quan học tập',
      shortLabel: 'Trang chủ',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Quản lý nhiệm vụ',
      shortLabel: 'Nhiệm vụ',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'quizzes' as ActiveTab,
      label: 'Bài tập & Kiểm tra',
      shortLabel: 'Bài tập',
      icon: FileQuestion,
      badge: currentRole === 'student' && pendingQuizzesCount > 0 ? pendingQuizzesCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'progress' as ActiveTab,
      label: 'Theo dõi tiến độ',
      shortLabel: 'Tiến độ',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'announcements' as ActiveTab,
      label: 'Thông báo học tập',
      shortLabel: 'Thông báo',
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    soundManager.playClick();
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <aside
      id="main-sidebar-container"
      className="flex flex-col h-full bg-white border-r border-slate-200/80 p-4 select-none"
    >
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <span className="font-bold text-slate-800 text-base">Menu Điều Hướng</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Đóng menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Profile Badge */}
      <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
        {currentRole === 'teacher' ? (
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                QK
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Giáo viên Quản trị
                </span>
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  Cô Nguyễn Thị Quốc Khánh
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Chuyên môn: Tin học & Tổ chức học tập</span>
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Giao diện Học sinh
              </span>
              <span className="text-[11px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-medium">
                {currentStudent.className}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm ${currentStudent.avatarBg}`}
              >
                {currentStudent.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {currentStudent.name}
                </h3>
                <p className="text-xs text-slate-500">Mã: {currentStudent.studentCode}</p>
              </div>
            </div>

            {/* Quick Demo Student Switcher */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60">
              <label
                htmlFor="select-demo-student"
                className="text-[11px] font-medium text-slate-500 block mb-1"
              >
                Đổi học sinh mẫu xem thử:
              </label>
              <select
                id="select-demo-student"
                value={currentStudent.id}
                onChange={(e) => {
                  soundManager.playClick();
                  const found = students.find((s) => s.id === e.target.value);
                  if (found) onSelectStudent(found);
                }}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="space-y-1.5 flex-1" aria-label="Thanh điều hướng">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 translate-x-1'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-left font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white text-blue-700' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Educational Notice Footer */}
      <div className="mt-auto pt-4 border-t border-slate-200/80 text-[11px] text-slate-400 text-center leading-normal">
        <p className="font-semibold text-slate-700">THPT Chuyên Thủ Khoa Nghĩa</p>
        <p className="text-[11px] font-bold text-blue-700 mt-0.5">Năm học 2026 - 2027</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Tối ưu cho Máy chiếu • Màn hình cảm ứng
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 h-[calc(100vh-5.5rem)]">{sidebarContent}</div>
      </div>

      {/* Mobile / Tablet Slide-over Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
