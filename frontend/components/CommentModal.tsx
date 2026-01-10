
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-right">
          {comment ? 'عرض التعليق' : 'إضافة تعليق جديد'}
        </h2>

        <div className="space-y-6 text-right">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 mr-2">عنوان التعليق</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ملاحظة لغوية..."
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-right"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 mr-2">محتوى التعليق</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تعليقك هنا بالتفصيل..."
              rows={4}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-right resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 mr-2 block">لون التمييز</label>
            <div className="flex flex-row-reverse gap-4 justify-start px-2 py-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`
                    w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95
                    ${selectedColor === color ? 'ring-4 ring-white/20 scale-110 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-2 border-transparent'}
                  `}
                  aria-label={`اللون ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 flex-row-reverse">
          <button
            onClick={() => onSave({ title, content, color: selectedColor })}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
          >
            {comment ? 'تعديل' : 'حفظ'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl transition-all border border-slate-700 active:scale-95"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
