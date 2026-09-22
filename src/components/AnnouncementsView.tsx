import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { ADMIN_INFO, CLASS_OPTIONS } from '../data/initialData';
import { soundManager } from '../utils/audio';
import {
  Bell,
  Plus,
  AlertTriangle,
  Calendar,
  User,
  Edit2,
  Trash2,
  CheckCheck,
  CheckCircle2,
  X,
  Megaphone,
} from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  currentRole: UserRole;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onUpdateAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncementRequest: (id: string, title: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  currentRole,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncementRequest,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAudience, setFormAudience] = useState('Toàn trường');
  const [formPriority, setFormPriority] = useState<'high' | 'normal'>('normal');

  // Filter Audience
  const [audienceFilter, setAudienceFilter] = useState('all');

  // Open Create
  const handleOpenCreate = () => {
    soundManager.playClick();
    setEditingItem(null);
    setFormTitle('');
    setFormContent('');
    setFormAudience('Toàn trường');
    setFormPriority('normal');
    setIsModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (ann: Announcement) => {
    soundManager.playClick();
    setEditingItem(ann);
    setFormTitle(ann.title);
    setFormContent(ann.content);
    setFormAudience(ann.targetAudience);
    setFormPriority(ann.priority);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      onUpdateAnnouncement({
        ...editingItem,
        title: formTitle.trim(),
        content: formContent.trim(),
        targetAudience: formAudience,
        priority: formPriority,
      });
    } else {
      onAddAnnouncement({
        title: formTitle.trim(),
        content: formContent.trim(),
        targetAudience: formAudience,
        author: `GV ${ADMIN_INFO.teacherName}`,
        priority: formPriority,
      });
    }
    setIsModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (audienceFilter === 'all') return true;
    return a.targetAudience === audienceFilter || a.targetAudience === 'Toàn trường';
  });

  const unreadCount = announcements.filter((a) => !a.readByStudent).length;

  return (
    <div id="announcements-view-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Thông Báo Học Tập & Lịch Trình
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {currentRole === 'teacher'
                ? 'Đăng thông báo dặn dò, lịch kiểm tra, hoạt động ngoại khóa đến từng lớp học'
                : 'Cập nhật kịp thời các tin tức, chỉ đạo và hướng dẫn từ thầy cô giáo'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {currentRole === 'student' && unreadCount > 0 && (
            <button
              id="btn-mark-all-read"
              onClick={() => {
                soundManager.playClick();
                onMarkAllAsRead();
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Đánh dấu tất cả đã đọc
            </button>
          )}

          {currentRole === 'teacher' && (
            <button
              id="btn-open-create-announcement"
              onClick={handleOpenCreate}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Tạo Thông Báo Mới
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-slate-400 mr-1">Đối tượng:</span>
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'Toàn trường', label: 'Toàn trường' },
          { id: '11A1 (Chuyên Tin)', label: '11A1 (Chuyên Tin)' },
          { id: '10A2 (Chuyên Lý)', label: '10A2 (Chuyên Lý)' },
          { id: '11A2 (Chuyên Hóa)', label: '11A2 (Chuyên Hóa)' },
          { id: '12A1 (Chuyên Sinh)', label: '12A1 (Chuyên Sinh)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundManager.playClick();
              setAudienceFilter(item.id);
            }}
            className={`px-3 py-1.5 rounded-xl cursor-pointer whitespace-nowrap transition-all ${
              audienceFilter === item.id
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => {
          const isUnread = !ann.readByStudent;

          return (
            <div
              key={ann.id}
              id={`announcement-card-${ann.id}`}
              onClick={() => {
                if (isUnread) {
                  soundManager.playClick();
                  onMarkAsRead(ann.id);
                }
              }}
              className={`p-6 rounded-3xl border transition-all duration-200 ${
                isUnread && currentRole === 'student'
                  ? 'bg-blue-50/40 border-blue-300 shadow-md ring-1 ring-blue-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Priority badge */}
                  {ann.priority === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> Quan trọng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      Thông thường
                    </span>
                  )}

                  {/* Target audience */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Gửi tới: {ann.targetAudience}
                  </span>

                  {/* Unread indicator for student */}
                  {currentRole === 'student' && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isUnread
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isUnread ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-300" />
                          Chưa đọc (Mới)
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã xem
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {ann.createdAt}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{ann.author}</span>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-2">
                {ann.title}
              </h3>

              <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              {currentRole === 'teacher' && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    id={`btn-edit-announcement-${ann.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(ann);
                    }}
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Sửa
                  </button>
                  <button
                    id={`btn-delete-announcement-${ann.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnnouncementRequest(ann.id, ann.title);
                    }}
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Create / Edit Announcement */}
      {isModalOpen && (
        <div
          id="modal-announcement-form"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Chỉnh Sửa Thông Báo' : 'Tạo Thông Báo Học Tập Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lịch kiểm tra giữa kỳ 1 năm học 2026-2027..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Đối tượng nhận
                  </label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Toàn trường">Toàn trường</option>
                    <option value="Khối 10">Khối 10</option>
                    <option value="Khối 11">Khối 11</option>
                    <option value="Khối 12">Khối 12</option>
                    {CLASS_OPTIONS.filter((c) => c !== 'Tất cả các lớp').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Mức độ ưu tiên
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as 'high' | 'normal')}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Thông thường</option>
                    <option value="high">Quan trọng (Ghim đầu)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Nội dung chi tiết thông báo <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung dặn dò học sinh, thông tin phòng thi, lịch học..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

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
                  {editingItem ? 'Lưu Thay Đổi' : 'Đăng Thông Báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
