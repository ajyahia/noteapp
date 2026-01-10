
import React, { useState } from 'react';

interface PageEditModalProps {
  content: string;
  onSave: (newContent: string) => void;
  onClose: () => void;
}

const PageEditModal: React.FC<PageEditModalProps> = ({ content, onSave, onClose }) => {
  const [editedContent, setEditedContent] = useState(content);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-8 text-right">
          تعديل الصفحة
        </h2>

        <div className="space-y-6 text-right">
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="اكتب محتوى الصفحة هنا..."
              rows={8}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-right resize-none text-lg leading-relaxed shadow-inner"
            />
          </div>
        </div>

        <div className="mt-10 flex gap-4 flex-row-reverse">
          <button
            onClick={() => onSave(editedContent)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
          >
            حفظ
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

export default PageEditModal;
