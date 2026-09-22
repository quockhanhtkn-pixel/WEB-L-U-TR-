import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ActiveTab,
  Task,
  Quiz,
  Student,
  Announcement,
  ToastMessage,
  TaskStatus,
} from './types';
import {
  ADMIN_INFO,
  INITIAL_TASKS,
  INITIAL_QUIZZES,
  INITIAL_STUDENTS,
  INITIAL_ANNOUNCEMENTS,
} from './data/initialData';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { QuizzesView } from './components/QuizzesView';
import { ProgressView } from './components/ProgressView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';

// Local storage keys
const STORAGE_KEY_TASKS = 'tkn_lms_tasks_2026_2027_v2';
const STORAGE_KEY_QUIZZES = 'tkn_lms_quizzes_2026_2027_v2';
const STORAGE_KEY_STUDENTS = 'tkn_lms_students_2026_2027_v2';
const STORAGE_KEY_ANNOUNCEMENTS = 'tkn_lms_announcements_2026_2027_v2';
const STORAGE_KEY_YEAR = 'tkn_lms_academic_year_v2';
const STORAGE_KEY_ROLE = 'tkn_lms_role_v1';

export default function App() {
  // Navigation & Role
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      return saved === 'student' ? 'student' : 'teacher';
    } catch {
      return 'teacher';
    }
  });

  // Academic Year State
  const [academicYear, setAcademicYear] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_YEAR);
      return saved || ADMIN_INFO.academicYear;
    } catch {
      return ADMIN_INFO.academicYear;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Current selected student for Student view
  const [currentStudent, setCurrentStudent] = useState<Student>(() => {
    return students[0] || INITIAL_STUDENTS[0];
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    } catch {
      // ignore
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch {
      // ignore
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
    } catch {
      // ignore
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_YEAR, academicYear);
    } catch {
      // ignore
    }
  }, [academicYear]);

  const handleAcademicYearChange = (year: string) => {
    setAcademicYear(year);
    soundManager.playAction();
    showToast(
      'info',
      'Đổi năm học',
      `Đang xem dữ liệu học tập: ${year}.`
    );
  };

  // Toast Helper
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Task Handlers ---
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    soundManager.playSuccess();
    showToast(
      'success',
      'Đã giao nhiệm vụ mới',
      `Nhiệm vụ "${newTask.title}" đã được phân bổ cho ${newTask.targetClass}.`
    );
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    soundManager.playSuccess();
    showToast('success', 'Đã cập nhật nhiệm vụ', `Đã lưu thay đổi cho "${updatedTask.title}".`);
  };

  const handleDeleteTaskRequest = (taskId: string, title: string) => {
    soundManager.playClick();
    setConfirmModal({
      isOpen: true,
      title: 'Xóa nhiệm vụ học tập',
      message: `Bạn có chắc chắn muốn xóa nhiệm vụ "${title}" không? Thao tác này sẽ cập nhật lại tiến độ bài học của học sinh.`,
      confirmLabel: 'Xác nhận xóa',
      variant: 'danger',
      onConfirm: () => {
        soundManager.playDelete();
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Đã xóa nhiệm vụ', `Nhiệm vụ "${title}" đã được xóa khỏi hệ thống.`);
      },
    });
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus: TaskStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...t,
          status: nextStatus,
        };
      })
    );

    // Update active student's completion stats
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentStudent.id) return s;
        const nextCompleted = Math.min(
          s.tasksTotal,
          Math.max(0, s.tasksCompleted + 1)
        );
        return {
          ...s,
          tasksCompleted: nextCompleted,
        };
      })
    );

    // Sync currentStudent state
    setCurrentStudent((prev) => ({
      ...prev,
      tasksCompleted: Math.min(prev.tasksTotal, prev.tasksCompleted + 1),
    }));

    showToast('success', 'Cập nhật tiến độ', 'Đã cập nhật trạng thái hoàn thành nhiệm vụ.');
  };

  // --- Quiz Handlers ---
  const handleAddQuiz = (newQuizData: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...newQuizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completed: false,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    soundManager.playSuccess();
    showToast(
      'success',
      'Đã xuất bản bài kiểm tra mới',
      `Đề "${newQuiz.title}" đã sẵn sàng cho ${newQuiz.targetClass}.`
    );
  };

  const handleUpdateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes((prev) => prev.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q)));
    soundManager.playSuccess();
    showToast('success', 'Đã cập nhật đề thi', `Đã lưu thay đổi cho "${updatedQuiz.title}".`);
  };

  const handleDeleteQuizRequest = (quizId: string, title: string) => {
    soundManager.playClick();
    setConfirmModal({
      isOpen: true,
      title: 'Xóa bài kiểm tra',
      message: `Bạn có chắc chắn muốn xóa bài kiểm tra "${title}" không? Thao tác này không thể hoàn tác.`,
      confirmLabel: 'Xác nhận xóa',
      variant: 'danger',
      onConfirm: () => {
        soundManager.playDelete();
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Đã xóa bài kiểm tra', `Bài kiểm tra "${title}" đã được xóa.`);
      },
    });
  };

  const handleSubmitQuizAnswers = (
    quizId: string,
    answers: Record<string, string>,
    score: number
  ) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          completed: true,
          score,
          selectedAnswers: answers,
          submittedAt: new Date().toLocaleString('vi-VN'),
        };
      })
    );

    // Update active student score and completed quiz count
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== currentStudent.id) return s;
        const newAverage = Number(((s.averageScore + score) / 2).toFixed(1));
        return {
          ...s,
          quizzesCompleted: s.quizzesCompleted + 1,
          averageScore: newAverage,
        };
      })
    );

    setCurrentStudent((prev) => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      averageScore: Number(((prev.averageScore + score) / 2).toFixed(1)),
    }));

    showToast(
      'success',
      'Nộp bài thành công!',
      `Hệ thống đã tự động chấm điểm bài làm của em: ${score}/10 điểm.`
    );
  };

  const handleResetQuizAttempt = (quizId: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          completed: false,
          score: undefined,
          selectedAnswers: undefined,
        };
      })
    );
    showToast('info', 'Làm lại bài kiểm tra', 'Đã xóa kết quả cũ để em thực hiện lại bài trắc nghiệm.');
  };

  // --- Announcement Handlers ---
  const handleAddAnnouncement = (newAnnData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...newAnnData,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      readByStudent: false,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    soundManager.playSuccess();
    showToast(
      'success',
      'Đã đăng thông báo mới',
      `Thông báo "${newAnn.title}" đã được gửi tới ${newAnn.targetAudience}.`
    );
  };

  const handleUpdateAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === updatedAnn.id ? updatedAnn : a)));
    soundManager.playSuccess();
    showToast('success', 'Đã cập nhật thông báo', 'Thông báo đã được sửa đổi thành công.');
  };

  const handleDeleteAnnouncementRequest = (id: string, title: string) => {
    soundManager.playClick();
    setConfirmModal({
      isOpen: true,
      title: 'Xóa thông báo',
      message: `Bạn có chắc chắn muốn xóa thông báo "${title}" không?`,
      confirmLabel: 'Xác nhận xóa',
      variant: 'danger',
      onConfirm: () => {
        soundManager.playDelete();
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('info', 'Đã xóa thông báo', 'Thông báo đã được gỡ bỏ khỏi bảng tin.');
      },
    });
  };

  const handleMarkAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, readByStudent: true } : a))
    );
  };

  const handleMarkAllAsRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, readByStudent: true })));
    soundManager.playSuccess();
    showToast('success', 'Đã đánh dấu đã đọc', 'Tất cả thông báo đã được đánh dấu là đã đọc.');
  };

  // --- Reset All Data to Pristine Sample State ---
  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Khôi phục dữ liệu mẫu ban đầu',
      message:
        'Bạn có chắc chắn muốn đặt lại tất cả dữ liệu (nhiệm vụ, bài kiểm tra, thông báo, tiến độ) về trạng thái mẫu ban đầu của trường THPT Chuyên Thủ Khoa Nghĩa không?',
      confirmLabel: 'Khôi phục dữ liệu mẫu',
      variant: 'warning',
      onConfirm: () => {
        soundManager.playAction();
        setTasks(INITIAL_TASKS);
        setQuizzes(INITIAL_QUIZZES);
        setStudents(INITIAL_STUDENTS);
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
        setCurrentStudent(INITIAL_STUDENTS[0]);
        localStorage.removeItem(STORAGE_KEY_TASKS);
        localStorage.removeItem(STORAGE_KEY_QUIZZES);
        localStorage.removeItem(STORAGE_KEY_STUDENTS);
        localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS);
        localStorage.removeItem(STORAGE_KEY_YEAR);
        setAcademicYear(ADMIN_INFO.academicYear);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(
          'success',
          'Khôi phục hoàn tất',
          'Đã đặt lại toàn bộ dữ liệu mẫu ban đầu cho hệ thống.'
        );
      },
    });
  };

  // Counts for sidebar badges
  const unreadAnnouncementsCount = announcements.filter((a) => !a.readByStudent).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const pendingQuizzesCount = quizzes.filter((q) => !q.completed).length;

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        academicYear={academicYear}
        onAcademicYearChange={handleAcademicYearChange}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showToast(
            'info',
            'Đổi chế độ',
            `Đã chuyển sang ${role === 'teacher' ? 'Chế độ Giáo viên' : 'Chế độ Học sinh'}.`
          );
        }}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onResetData={handleResetData}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentRole={currentRole}
          currentStudent={currentStudent}
          students={students}
          onSelectStudent={(s) => {
            setCurrentStudent(s);
            showToast('info', 'Đổi học sinh', `Đang xem góc nhìn của em: ${s.name} (${s.className}).`);
          }}
          unreadAnnouncementsCount={unreadAnnouncementsCount}
          pendingTasksCount={pendingTasksCount}
          pendingQuizzesCount={pendingQuizzesCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary Content Area */}
        <main id="main-content-area" className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <DashboardView
              currentRole={currentRole}
              currentStudent={currentStudent}
              tasks={tasks}
              quizzes={quizzes}
              students={students}
              announcements={announcements}
              academicYear={academicYear}
              onNavigate={setActiveTab}
              onOpenCreateTask={() => setActiveTab('tasks')}
              onOpenCreateQuiz={() => setActiveTab('quizzes')}
              onOpenCreateAnnouncement={() => setActiveTab('announcements')}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              currentRole={currentRole}
              currentClass={currentStudent.className}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTaskRequest={handleDeleteTaskRequest}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizzesView
              quizzes={quizzes}
              currentRole={currentRole}
              onAddQuiz={handleAddQuiz}
              onUpdateQuiz={handleUpdateQuiz}
              onDeleteQuizRequest={handleDeleteQuizRequest}
              onSubmitQuizAnswers={handleSubmitQuizAnswers}
              onResetQuizAttempt={handleResetQuizAttempt}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              students={students}
              currentRole={currentRole}
              currentStudent={currentStudent}
              tasks={tasks}
              quizzes={quizzes}
              academicYear={academicYear}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={announcements}
              currentRole={currentRole}
              onAddAnnouncement={handleAddAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncementRequest={handleDeleteAnnouncementRequest}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
