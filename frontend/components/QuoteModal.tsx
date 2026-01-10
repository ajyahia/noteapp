
import React, { useState, useEffect } from 'react';

interface QuoteModalProps {
  initialContent?: string;
  initialColor?: string;
  onSave: (content: string, color: string) => void;
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

const QuoteModal: React.FC<QuoteModalProps> = ({ initialContent = '', initialColor = COLORS[0], onSave, onClose }) => {
  const [content, setContent] = useState(initialContent);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const isEditing = initialContent !== '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-right">
          {isEditing ? 'تعديل الاقتباس' : 'إضافة اقتباس'}
        </h2>

        <div className="space-y-6 text-right">
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب نص الاقتباس هنا..."
              rows={4}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-right resize-none text-lg"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 mr-2 block">اختر لونا للاقتباس</label>
            <div className="flex flex-row-reverse gap-4 justify-start px-2 py-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`
                    w-10 h-10 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95
                    ${selectedColor === color ? 'ring-4 ring-white/20 scale-110 border-2 border-white' : 'border-2 border-transparent'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 flex-row-reverse">
          <button
            onClick={() => onSave(content, selectedColor)}
            disabled={!content.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            {isEditing ? 'حفظ التعديلات' : 'إضافة'}
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

export default QuoteModal;
