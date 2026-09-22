/**
 * Types & Interfaces for Cổng Quản Trị Học Tập THPT Chuyên Thủ Khoa Nghĩa
 */

export type UserRole = 'teacher' | 'student';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  targetClass: string; // e.g. "11A1", "10A1", "Tất cả"
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  subject: string;
  assignedBy: string;
  createdAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  targetClass: string;
  subject: string;
  durationMinutes: number;
  dueDate: string;
  questions: QuizQuestion[];
  createdAt: string;
  // Student submission state (in client storage)
  completed?: boolean;
  score?: number; // e.g. 9.5
  totalQuestions?: number;
  submittedAt?: string;
  selectedAnswers?: Record<string, string>; // questionId -> optionId
}

export interface Student {
  id: string;
  name: string;
  studentCode: string;
  className: string;
  avatarBg: string;
  tasksCompleted: number;
  tasksTotal: number;
  quizzesCompleted: number;
  averageScore: number;
  conduct: 'Tốt' | 'Khá';
  status: 'active' | 'warning' | 'excellent';
  note?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string; // "Toàn trường", "Khối 10", "Khối 11", "Khối 12", "Lớp 11A1"...
  author: string;
  createdAt: string;
  priority: 'high' | 'normal';
  readByStudent?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export type ActiveTab = 'overview' | 'tasks' | 'quizzes' | 'progress' | 'announcements';
