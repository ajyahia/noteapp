
import React, { useState } from 'react';

interface PageEditModalProps {
  content: string;
  onSave: (newContent: string) => void;
  onClose: () => void;
}

const PageEditModal: React.FC<PageEditModalProps> = ({ content, onSave, onClose }) => {
  const [editedContent, setEditedContent] = useState(content);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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
          <h2 className="text-slate-200 font-medium text-sm">تعديل الصفحة</h2>
          <div className="w-7"></div>
        </div>

        <div className="px-3 py-2 space-y-2 text-right">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="اكتب محتوى الصفحة هنا..."
            rows={5}
            className="w-full bg-slate-800/50 rounded-lg px-2.5 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right resize-none"
          />
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
            onClick={() => onSave(editedContent)}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            title="حفظ"
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

export default PageEditModal;
