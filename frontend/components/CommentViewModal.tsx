
import React from 'react';
import { Comment } from '../types';

interface CommentViewModalProps {
  comment: Comment;
  onEdit: () => void;
  onClose: () => void;
}

const CommentViewModal: React.FC<CommentViewModalProps> = ({ comment, onEdit, onClose }) => {
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

          {/* أيقونة التعديل على اليسار */}
          <button 
            onClick={onEdit}
            className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-full transition-all active:scale-90 bg-blue-500/10 border border-blue-500/20"
            title="تعديل التعليق"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
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
