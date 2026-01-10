
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onRead: () => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onRead, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="group bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-300 shadow-sm relative overflow-visible flex flex-col h-full">
      {/* رأس البطاقة - العنوان والقائمة */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
          {note.title}
        </h3>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-500 hover:text-white transition-all p-1 hover:scale-110 active:scale-95"
            aria-label="خيارات"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                className="w-full text-right px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-3 transition-colors"
                onClick={() => {
                  onEdit();
                  setIsMenuOpen(false);
                }}
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                تعديل
              </button>
              <button 
                className="w-full text-right px-4 py-3 text-sm text-red-400 hover:bg-red-950/30 flex items-center gap-3 transition-colors"
                onClick={() => {
                  onDelete(note.id);
                  setIsMenuOpen(false);
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                حذف
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* جسم البطاقة - المحتوى */}
      <div className="flex-grow">
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 mb-6">
          {note.content.split('\n\n---\n\n').join(' ')}
        </p>
      </div>

      {/* تذييل البطاقة - التاريخ والإجراء */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/40">
        <span className="text-[10px] uppercase tracking-wider text-slate-600 font-medium">
          {note.date}
        </span>
        <button 
          onClick={onRead}
          className="text-blue-500 hover:text-blue-400 text-sm font-semibold transition-all hover:translate-x-1"
        >
          قراءة
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
