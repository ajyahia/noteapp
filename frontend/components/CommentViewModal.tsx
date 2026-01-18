
import React from 'react';
import { Comment } from '../types';

interface CommentViewModalProps {
  comment: Comment;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const CommentViewModal: React.FC<CommentViewModalProps> = ({ comment, onEdit, onDelete, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-sm bg-[#111827] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* البار العلوي */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          {/* زر الإغلاق على اليمين */}
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90"
            aria-label="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* العنوان في المنتصف (يظهر فقط إذا وجد) */}
          {comment.title && (
            <h3 className="text-slate-200 font-bold text-base truncate max-w-[150px]">
              {comment.title}
            </h3>
          )}

          {/* أزرار التعديل والحذف على اليسار */}
          <div className="flex items-center gap-2">
            {/* أيقونة التعديل */}
            <button 
              onClick={onEdit}
              className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-full transition-all active:scale-90 bg-blue-500/10 border border-blue-500/20"
              title="تعديل التعليق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            {/* أيقونة الحذف */}
            <button 
              onClick={onDelete}
              className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-full transition-all active:scale-90 bg-red-500/10 border border-red-500/20"
              title="حذف التعليق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* محتوى التعليق */}
        <div className="p-8 text-right">
          <div 
            className="p-6 rounded-3xl border border-white/5 shadow-inner"
            style={{ backgroundColor: `${comment.color}08` }}
          >
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentViewModal;
