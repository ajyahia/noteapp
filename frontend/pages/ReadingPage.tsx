
import React, { useState, useMemo } from 'react';
import { Note, Comment, NoteBlock } from '../types';
import Taskbar from '../components/Taskbar';
import CommentModal from '../components/CommentModal';
import CommentViewModal from '../components/CommentViewModal';

interface ReadingPageProps {
  note: Note;
  onEdit: () => void;
  onBack: () => void;
  onLogout: () => void;
  onSaveComment: (noteId: string, key: string, comment: Comment) => void;
  onDeleteComment: (noteId: string, key: string) => void;
  onUpdatePageBlocks: (noteId: string, pageIndex: number, newBlocks: NoteBlock[]) => void;
}

const ReadingPage: React.FC<ReadingPageProps> = ({ 
  note, 
  onEdit, 
  onBack, 
  onLogout, 
  onSaveComment,
  onDeleteComment
}) => {
  const [selectedWordKey, setSelectedWordKey] = useState<string | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentViewOpen, setIsCommentViewOpen] = useState(false);

  const handleWordClick = (pIndex: number, bIndex: number, wIndex: number) => {
    const key = `${pIndex}-${bIndex}-${wIndex}`;
    setSelectedWordKey(prev => prev === key ? null : key);
  };

  const currentComment = selectedWordKey ? (note.comments?.[selectedWordKey] || null) : null;

  const handleToolbarCommentAction = () => {
    if (currentComment) {
      setIsCommentViewOpen(true);
    } else {
      setIsCommentModalOpen(true);
    }
  };

  const switchToEditComment = () => {
    setIsCommentViewOpen(false);
    setIsCommentModalOpen(true);
  };

  const handleDeleteComment = () => {
    if (selectedWordKey) {
      onDeleteComment(note.id, selectedWordKey);
      setIsCommentViewOpen(false);
      setSelectedWordKey(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-6 py-12 pb-32 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="flex items-center justify-between mb-16 animate-fade-in relative z-10">
        <button 
          onClick={onBack} 
          className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all bg-slate-900/50 hover:bg-slate-800/80 px-5 py-2.5 rounded-2xl border border-slate-800/50 backdrop-blur-md"
        >
          <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-bold text-sm hidden sm:inline">العودة للرئيسية</span>
        </button>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-slate-900 border border-slate-800/80 px-6 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-black tracking-widest text-blue-400 uppercase">وضع القراءة</span>
          </div>
        </div>
      </header>

      <div className="mb-14 text-right animate-fade-in relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.2] mb-6 tracking-tight">
          {note.title}
        </h1>
        <div className="flex items-center gap-4 justify-end">
          <span className="text-slate-500 text-sm font-medium">{note.date}</span>
          <div className="h-[2px] w-16 bg-gradient-to-l from-blue-600 to-transparent rounded-full"></div>
        </div>
      </div>

      <div className="space-y-20 relative z-10">
        {note.blocks.map((blocks, pIndex) => (
          <div 
            key={pIndex} 
            className="group relative bg-slate-900/30 rounded-[3rem] p-10 md:p-16 border border-slate-800/40 backdrop-blur-sm shadow-2xl animate-slide-up hover:border-slate-700/50 transition-all duration-500"
            style={{ animationDelay: `${pIndex * 150}ms` }}
          >
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
               <div className="h-20 w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent"></div>
               <span className="text-slate-700 font-black text-xs vertical-text rotate-180 select-none">PAGE {pIndex + 1}</span>
               <div className="h-20 w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent"></div>
            </div>

            <div className="space-y-10">
              {blocks.map((block, bIndex) => {
                if (block.type === 'quote') {
                  return (
                    <div 
                      key={bIndex}
                      style={{ borderRightColor: block.color }}
                      className="relative p-7 md:p-9 rounded-[1.5rem] border-r-[5px] bg-gradient-to-br from-slate-900/80 to-slate-900/20 text-right shadow-lg overflow-hidden group/quote my-4"
                    >
                      <div className="absolute top-2 right-4 text-4xl text-slate-700/20 font-serif select-none">"</div>
                      <p className="text-xl md:text-2xl text-slate-100 italic leading-relaxed font-bold relative z-10">
                        {block.content}
                      </p>
                    </div>
                  );
                }

                const words = block.content.split(/(\s+)/).filter(w => w.length > 0);
                return (
                  <div key={bIndex} className="text-2xl md:text-3xl text-slate-300 leading-[2.1] text-right font-medium">
                    {words.map((word, wIndex) => {
                      const key = `${pIndex}-${bIndex}-${wIndex}`;
                      const isSelected = selectedWordKey === key;
                      const comment = note.comments?.[key];
                      if (/^\s+$/.test(word)) return <span key={key}>{word}</span>;

                      return (
                        <span
                          key={key}
                          onClick={() => handleWordClick(pIndex, bIndex, wIndex)}
                          style={{ 
                            color: comment ? comment.color : (isSelected ? '#fff' : undefined),
                          }}
                          className={`
                            cursor-pointer rounded-xl px-1.5 py-0.5 transition-all duration-300 inline-block relative
                            ${isSelected ? 'bg-blue-600/30 scale-110 shadow-lg shadow-blue-900/20 z-20' : 'bg-transparent'}
                            ${comment ? 'font-black' : 'hover:text-white hover:bg-slate-800/40'}
                          `}
                        >
                          {word}
                          {comment && !isSelected && (
                            <span 
                              className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                              style={{ backgroundColor: comment.color }}
                            ></span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Taskbar onLogout={onLogout}>
        <div className="flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {selectedWordKey && (
            <button
              onClick={handleToolbarCommentAction}
              className="relative group bg-blue-600 hover:bg-blue-500 text-white p-3 md:px-10 md:py-3.5 rounded-2xl md:rounded-full font-black transition-all shadow-xl shadow-blue-900/40 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg className="w-7 h-7 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span className="relative hidden md:inline">{currentComment ? 'عرض تفاصيل التعليق' : 'أضف تعليقك الآن'}</span>
            </button>
          )}
          <button 
            onClick={onEdit} 
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 p-3 md:px-8 md:py-3.5 rounded-2xl md:rounded-full font-bold transition-all border border-slate-700 active:scale-95 backdrop-blur-md"
          >
            <svg className="w-7 h-7 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden md:inline">تعديل المسودة</span>
          </button>
        </div>
      </Taskbar>

      {isCommentViewOpen && currentComment && (
        <CommentViewModal 
          comment={currentComment}
          onEdit={switchToEditComment}
          onDelete={handleDeleteComment}
          onClose={() => setIsCommentViewOpen(false)}
        />
      )}

      {isCommentModalOpen && selectedWordKey && (
        <CommentModal 
          comment={currentComment}
          onSave={(comment) => {
            onSaveComment(note.id, selectedWordKey, comment);
            setIsCommentModalOpen(false);
          }}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .vertical-text { writing-mode: vertical-rl; }
      `}</style>
    </div>
  );
};

export default ReadingPage;
