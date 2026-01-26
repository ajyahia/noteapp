
import React from 'react';
import { Comment } from '../types';

interface CommentViewModalProps {
  comment: Comment;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  readOnly?: boolean;
}

const CommentViewModal: React.FC<CommentViewModalProps> = ({ comment, onEdit, onDelete, onClose, readOnly = false }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-800/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* البار العلوي */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {comment.title && (
            <h3 className="text-slate-200 font-medium text-sm">
              {comment.title}
            </h3>
          )}

          {!readOnly && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onEdit}
                className="p-1.5 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={onDelete}
                className="p-1.5 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
          {readOnly && <div className="w-8"></div>}
        </div>

        {/* محتوى التعليق */}
        <div className="px-1.5 py-2 text-right">
          <div 
            className="px-2.5 py-2 rounded-lg bg-slate-800/40"
          >
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentViewModal;
