import React, { useState } from 'react';
import { UserRole } from '../types';
import { ADMIN_INFO } from '../data/initialData';
import { soundManager } from '../utils/audio';
import {
  GraduationCap,
  UserCheck,
  Music,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Menu,
  RotateCcw,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleSidebar: () => void;
  onResetData: () => void;
  academicYear?: string;
  onAcademicYearChange?: (year: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onToggleSidebar,
  onResetData,
  academicYear = ADMIN_INFO.academicYear,
  onAcademicYearChange,
}) => {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isSfxOn, setIsSfxOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleMusic = () => {
    soundManager.playClick();
    const nextState = soundManager.toggleMusic();
    setIsMusicOn(nextState);
  };

  const handleToggleSfx = () => {
    soundManager.playClick();
    const nextState = soundManager.toggleSfx();
    setIsSfxOn(nextState);
  };

  const handleToggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 lg:px-8 py-3.5"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Branding & Teacher info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              id="btn-toggle-mobile-sidebar"
              onClick={() => {
                soundManager.playClick();
                onToggleSidebar();
              }}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-600/25 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {ADMIN_INFO.systemName}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {ADMIN_INFO.schoolName}
                </span>
                <div
                  id="academic-year-badge"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  {onAcademicYearChange ? (
                    <select
                      id="select-academic-year"
                      value={academicYear}
                      onChange={(e) => {
                        soundManager.playClick();
                        onAcademicYearChange(e.target.value);
                      }}
                      className="bg-transparent font-bold text-amber-950 focus:outline-hidden cursor-pointer"
                      title="Chọn năm học"
                    >
                      <option value="Năm học 2026 - 2027">Năm học 2026 - 2027 (Hiện tại)</option>
                      <option value="Năm học 2025 - 2026">Năm học 2025 - 2026</option>
                      <option value="Năm học 2027 - 2028">Năm học 2027 - 2028</option>
                    </select>
                  ) : (
                    <span>{academicYear}</span>
                  )}
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-600 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-800">
                  Quản trị: GV {ADMIN_INFO.teacherName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-blue-700 font-medium">Học kỳ 1</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2.5 justify-end">
          {/* Audio Controls */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {/* Ambient Background Music */}
            <button
              id="btn-toggle-ambient-music"
              onClick={handleToggleMusic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isMusicOn
                  ? 'bg-blue-600 text-white shadow-xs animate-pulse'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title={isMusicOn ? 'Tắt nhạc nền tập trung' : 'Bật nhạc nền học tập nhẹ nhàng (Web Audio)'}
            >
              <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Nhạc tập trung</span>
              <span className="sm:hidden">Nhạc</span>
              {isMusicOn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            {/* Sound FX Toggle */}
            <button
              id="btn-toggle-sound-effects"
              onClick={handleToggleSfx}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                isSfxOn
                  ? 'text-slate-700 hover:bg-white/80'
                  : 'text-slate-400 hover:bg-white/60'
              }`}
              title={isSfxOn ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh thao tác'}
            >
              {isSfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Fullscreen Button for Projectors / Smartboards */}
          <button
            id="btn-toggle-fullscreen"
            onClick={handleToggleFullscreen}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-2xs transition-all active:scale-95"
            title={isFullscreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình (Thích hợp cho Máy chiếu / Bảng tương tác)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-sample-data"
            onClick={() => {
              soundManager.playClick();
              onResetData();
            }}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-700 shadow-2xs transition-all active:scale-95"
            title="Khôi phục dữ liệu mẫu ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dual Role Switcher */}
          <div
            id="role-switch-container"
            className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner"
          >
            <button
              id="btn-role-teacher"
              onClick={() => {
                soundManager.playClick();
                onRoleChange('teacher');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                currentRole === 'teacher'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Chế độ Giáo viên</span>
            </button>

            <button
              id="btn-role-student"
              onClick={() => {
                soundManager.playClick();
                onRoleChange('student');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Chế độ Học sinh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
