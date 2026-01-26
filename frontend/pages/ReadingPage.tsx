
import React, { useState } from 'react';
import { Note, Comment, NoteBlock } from '../types';
import Taskbar from '../components/Taskbar';
import CommentModal from '../components/CommentModal';
import CommentViewModal from '../components/CommentViewModal';
import ShareModal from '../components/ShareModal';
import PageHeader from '../components/PageHeader';

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
  onDeleteComment,
  onUpdatePageBlocks
}) => {
  const [selectedWordKey, setSelectedWordKey] = useState<string | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCommentViewOpen, setIsCommentViewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-2 md:px-6 py-3 md:py-8 pb-52 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <PageHeader
        leftAction={{
          onClick: onBack,
          label: 'العودة للرئيسية'
        }}
        centerContent={
          <div className="bg-slate-900/50 border border-slate-800/50 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-semibold tracking-wide text-blue-400 uppercase">قراءة</span>
          </div>
        }
        className="mb-4 md:mb-6"
      />

      <div className="mb-4 md:mb-6 text-right animate-fade-in relative z-10">
        <h1 className="text-xl md:text-2xl font-bold text-white leading-tight mb-1.5 md:mb-2 tracking-tight">
          {note.title}
        </h1>
        <div className="flex items-center gap-2 md:gap-3 justify-end">
          <span className="text-slate-400 text-xs md:text-sm font-medium">{note.date}</span>
          <div className="h-[1.5px] w-8 md:w-12 bg-gradient-to-l from-blue-600 to-transparent rounded-full"></div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-6 relative z-10">
        {note.blocks.map((blocks, pIndex) => (
          <div 
            key={pIndex} 
            className="group relative bg-slate-900/30 rounded-xl md:rounded-xl p-3 md:p-7 border border-slate-800/40 backdrop-blur-sm shadow-2xl animate-slide-up hover:border-slate-700/50 transition-all duration-500"
            style={{ animationDelay: `${pIndex * 150}ms` }}
          >
            <div className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
               <div className="h-16 md:h-20 w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent"></div>
               <span className="text-slate-700 font-black text-xs vertical-text rotate-180 select-none">صفحة {pIndex + 1}</span>
               <div className="h-16 md:h-20 w-[2px] bg-gradient-to-b from-transparent via-slate-800 to-transparent"></div>
            </div>

            <div className="space-y-2 md:space-y-4">
              {blocks.map((block, bIndex) => {
                if (block.type === 'quote') {
                  return (
                    <div 
                      key={bIndex}
                      style={{ borderRightColor: block.color }}
                      className="relative p-3 md:p-5 rounded-xl md:rounded-lg border-r-[3px] md:border-r-[5px] bg-gradient-to-br from-slate-900/80 to-slate-900/20 text-right shadow-lg overflow-hidden group/quote my-1 md:my-2"
                    >
                      <div className="absolute top-1 right-2 md:right-3 text-2xl md:text-3xl text-slate-700/20 font-serif select-none">"</div>
                      <p className="text-sm md:text-lg text-slate-100 italic leading-relaxed md:leading-normal font-semibold relative z-10 pr-12">
                        {block.content}
                      </p>
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-0 group-hover/quote:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newBlocks = [...note.blocks[pIndex]];
                            newBlocks.splice(bIndex, 1);
                            onUpdatePageBlocks(note.id, pIndex, newBlocks);
                          }}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
                          title="حذف الاقتباس"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                }

                const words = block.content.split(/(\s+)/).filter(w => w.length > 0);
                return (
                  <div key={bIndex} className="text-sm md:text-lg lg:text-xl text-slate-300 leading-relaxed md:leading-[1.8] text-right font-normal">
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
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
              title={currentComment ? 'عرض تفاصيل التعليق' : 'أضف تعليقك الآن'}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </button>
          )}
          <button 
            onClick={onEdit} 
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 p-3 rounded-xl transition-all border border-slate-700 active:scale-95 backdrop-blur-md"
            title="تعديل المسودة"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)} 
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 p-3 rounded-xl transition-all border border-slate-700 active:scale-95 backdrop-blur-md"
            title="مشاركة الملاحظة"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
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

      {isShareModalOpen && (
        <ShareModal
          noteId={note.id}
          noteTitle={note.title}
          onClose={() => setIsShareModalOpen(false)}
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
