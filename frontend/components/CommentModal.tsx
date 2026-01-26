
import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentModalProps {
  comment: Comment | null;
  onSave: (comment: Comment) => void;
  onClose: () => void;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const CommentModal: React.FC<CommentModalProps> = ({ comment, onSave, onClose }) => {
  const [title, setTitle] = useState(comment?.title || '');
  const [content, setContent] = useState(comment?.content || '');
  const [selectedColor, setSelectedColor] = useState(comment?.color || COLORS[0]);

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
          <h2 className="text-slate-200 font-medium text-sm">
            {comment ? 'تعديل التعليق' : 'إضافة تعليق'}
          </h2>
          <div className="w-7"></div>
        </div>

        <div className="px-3 py-3 space-y-3 text-right">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">عنوان التعليق</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ملاحظة..."
              className="w-full bg-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">محتوى التعليق</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              rows={3}
              className="w-full bg-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-2 block">لون التمييز</label>
            <div className="flex justify-center gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 pb-3 flex gap-2 justify-center">
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="إلغاء"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => onSave({ title, content, color: selectedColor })}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            title={comment ? 'تعديل' : 'حفظ'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
