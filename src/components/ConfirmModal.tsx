import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Xác nhận xóa',
  cancelLabel = 'Hủy bỏ',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="confirm-modal-box"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  variant === 'danger'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {variant === 'danger' ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <button
              id="btn-close-modal"
              onClick={onCancel}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-600 text-base leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="btn-cancel-modal"
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-colors active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              id="btn-confirm-modal"
              type="button"
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl font-medium text-white shadow-sm transition-all active:scale-95 flex items-center gap-2 ${
                variant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
              }`}
            >
              {variant === 'danger' && <Trash2 className="w-4 h-4" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
