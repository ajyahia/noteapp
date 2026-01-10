
import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteBlock } from '../types';
import Taskbar from '../components/Taskbar';
import QuoteModal from '../components/QuoteModal';
import { useFeedback } from '../context/FeedbackContext';

interface AddNotePageProps {
  initialNote?: Note;
  onSave: (title: string, pages: NoteBlock[][]) => void;
  onCancel: () => void;
  onLogout: () => void;
}

const AddNotePage: React.FC<AddNotePageProps> = ({ initialNote, onSave, onCancel, onLogout }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [pages, setPages] = useState<NoteBlock[][]>([[{ type: 'text', content: '' }]]);
  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [editingQuoteCoords, setEditingQuoteCoords] = useState<{ pIdx: number; bIdx: number } | null>(null);
  const textareasRef = useRef<(HTMLTextAreaElement | null)[]>([]);
  const { showFeedback } = useFeedback();

  useEffect(() => {
    if (initialNote && initialNote.blocks) {
      setPages(initialNote.blocks);
    }
  }, [initialNote]);

  const addNewPage = () => {
    const newPage: NoteBlock[] = [{ type: 'text', content: '' }];
    const newPages = [...pages, newPage];
    setPages(newPages);
    setFocusedPageIndex(newPages.length - 1);
    showFeedback('info', 'تمت إضافة صفحة', 'يمكنك الآن البدء في كتابة محتوى جديد في الصفحة التالية.');
  };

  const updateTextBlock = (pageIndex: number, blockIndex: number, content: string) => {
    const newPages = [...pages];
    newPages[pageIndex][blockIndex].content = content;
    setPages(newPages);
  };

  const handleAddOrUpdateQuote = (quoteContent: string, color: string) => {
    const newPages = [...pages];
    if (editingQuoteCoords) {
      newPages[editingQuoteCoords.pIdx][editingQuoteCoords.bIdx] = {
        ...newPages[editingQuoteCoords.pIdx][editingQuoteCoords.bIdx],
        content: quoteContent,
        color
      };
      showFeedback('success', 'تم تعديل الاقتباس', 'تم حفظ التغييرات على نص الاقتباس بنجاح.');
    } else {
      newPages[focusedPageIndex].push({ type: 'quote', content: quoteContent, color });
      showFeedback('success', 'تمت إضافة اقتباس', 'تم إدراج الاقتباس بنجاح في الصفحة الحالية.');
    }
    setPages(newPages);
    setShowQuoteModal(false);
    setEditingQuoteCoords(null);
  };

  const openEditQuote = (pIdx: number, bIdx: number) => {
    setEditingQuoteCoords({ pIdx, bIdx });
    setShowQuoteModal(true);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== focusedPageIndex);
    setPages(newPages);
    setFocusedPageIndex(Math.max(0, focusedPageIndex - 1));
    setShowDeleteConfirm(false);
    showFeedback('warning', 'تم حذف الصفحة', 'تم حذف محتوى الصفحة المحددة من الملاحظة.');
  };

  const handleSave = () => {
    onSave(title, pages);
  };

  const quoteToEdit = editingQuoteCoords 
    ? pages[editingQuoteCoords.pIdx][editingQuoteCoords.bIdx] 
    : undefined;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 pb-32">
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl pt-8 pb-6 border-b border-slate-900/50 mb-8">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>رجوع</span>
          </button>
          
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-full font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {initialNote ? 'تحديث الملاحظة' : 'إنشاء الملاحظة'}
          </button>
        </header>

        <div className="relative group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الملاحظة..."
            className="w-full bg-transparent border-none text-4xl font-bold text-white placeholder-slate-800 focus:outline-none focus:ring-0 transition-all text-right"
          />
        </div>
      </div>

      <div className="space-y-12 flex-1">
        <div className="space-y-10">
          {pages.map((blocks, pageIndex) => (
            <div 
              key={pageIndex} 
              className={`animate-slide-up bg-slate-900/10 rounded-[2.5rem] p-6 border transition-all ${focusedPageIndex === pageIndex ? 'border-slate-800' : 'border-transparent'}`}
              onFocus={() => setFocusedPageIndex(pageIndex)}
              onClick={() => setFocusedPageIndex(pageIndex)}
            >
              <div className="mr-4 mb-4 text-blue-500/40 font-bold text-xl select-none">
                {pageIndex + 1}
              </div>
              <div className="space-y-4">
                {blocks.map((block, bIndex) => (
                  <div key={bIndex}>
                    {block.type === 'text' ? (
                      <textarea
                        ref={(el) => { if (bIndex === 0) textareasRef.current[pageIndex] = el; }}
                        value={block.content}
                        onChange={(e) => updateTextBlock(pageIndex, bIndex, e.target.value)}
                        placeholder="اكتب هنا..."
                        className="w-full min-h-[150px] bg-transparent text-slate-300 placeholder-slate-700 focus:outline-none text-right leading-[1.8] text-lg resize-none"
                      />
                    ) : (
                      <div 
                        onClick={() => openEditQuote(pageIndex, bIndex)}
                        style={{ borderRightColor: block.color, backgroundColor: `${block.color}10` }}
                        className="p-5 px-7 rounded-xl border-r-[4px] text-right mb-4 cursor-pointer hover:bg-slate-800/30 transition-all group/quote relative overflow-hidden"
                      >
                        <div className="absolute -top-1 right-2 text-2xl text-slate-700/20 font-serif select-none">"</div>
                        <p className="text-slate-100 italic text-lg leading-relaxed relative z-10 font-semibold">{block.content}</p>
                        <div className="absolute top-2 left-4 opacity-0 group-hover/quote:opacity-100 transition-opacity text-[10px] text-slate-500 font-bold uppercase">
                          تعديل الاقتباس
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Taskbar onLogout={onLogout}>
        <div className="flex items-center gap-3">
          <button
            onClick={addNewPage}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-6 py-2.5 rounded-full transition-all shadow-lg"
          >
            <span className="font-bold">صفحة جديدة</span>
          </button>
          
          <button
            onClick={() => {
              setEditingQuoteCoords(null);
              setShowQuoteModal(true);
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 px-6 py-2.5 rounded-full transition-all border border-slate-700"
          >
            <span className="font-bold">إضافة اقتباس</span>
          </button>

          {pages.length > 1 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 px-6 py-2.5 rounded-full transition-all border border-slate-700 active:scale-95"
            >
              <span className="font-bold">حذف الصفحة</span>
            </button>
          )}
        </div>
      </Taskbar>

      {showQuoteModal && (
        <QuoteModal 
          initialContent={quoteToEdit?.content}
          initialColor={quoteToEdit?.color}
          onSave={handleAddOrUpdateQuote}
          onClose={() => {
            setShowQuoteModal(false);
            setEditingQuoteCoords(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-6">هل أنت متأكد من حذف هذه الصفحة؟</h3>
            <div className="flex gap-4">
              <button onClick={handleDeletePage} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl">حذف</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AddNotePage;
