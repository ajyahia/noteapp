
import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteBlock } from '../types';
import Taskbar from '../components/Taskbar';
import QuoteModal from '../components/QuoteModal';
import PageHeader from '../components/PageHeader';
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
  const [insertPosition, setInsertPosition] = useState<{ pageIndex: number; blockIndex: number; cursorPos: number } | null>(null);
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

  const updateTextBlock = (pageIndex: number, blockIndex: number, content: string, textarea?: HTMLTextAreaElement) => {
    const newPages = [...pages];
    newPages[pageIndex][blockIndex].content = content;
    setPages(newPages);
    
    // حفظ موضع الـ cursor
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      setInsertPosition({ pageIndex, blockIndex, cursorPos });
    }
  };

  const handleAddOrUpdateQuote = (quoteContent: string, color: string) => {
    const newPages = [...pages];
    if (editingQuoteCoords) {
      // تعديل اقتباس موجود
      if (!quoteContent.trim()) {
        // لو النص فاضي، احذف الاقتباس
        newPages[editingQuoteCoords.pIdx].splice(editingQuoteCoords.bIdx, 1);
        showFeedback('info', 'تم حذف الاقتباس', 'تم حذف الاقتباس بنجاح.');
      } else {
        newPages[editingQuoteCoords.pIdx][editingQuoteCoords.bIdx] = {
          ...newPages[editingQuoteCoords.pIdx][editingQuoteCoords.bIdx],
          content: quoteContent,
          color
        };
        showFeedback('success', 'تم تعديل الاقتباس', 'تم حفظ التغييرات على نص الاقتباس بنجاح.');
      }
    } else {
      // إضافة اقتباس جديد
      if (insertPosition) {
        // إضافة في موضع الـ cursor
        const { pageIndex, blockIndex, cursorPos } = insertPosition;
        const currentBlock = newPages[pageIndex][blockIndex];
        
        if (currentBlock.type === 'text') {
          const textBefore = currentBlock.content.substring(0, cursorPos);
          const textAfter = currentBlock.content.substring(cursorPos);
          
          // إنشاء blocks جديدة
          const newBlocks: NoteBlock[] = [];
          
          // دائماً نحافظ على النص حتى لو كان فارغاً أو مسافات فقط
          if (textBefore.length > 0) {
            newBlocks.push({ type: 'text', content: textBefore });
          }
          
          newBlocks.push({ type: 'quote', content: quoteContent, color });
          
          if (textAfter.length > 0) {
            newBlocks.push({ type: 'text', content: textAfter });
          }
          
          // استبدال الـ block الحالي بالـ blocks الجديدة
          newPages[pageIndex].splice(blockIndex, 1, ...newBlocks);
        } else {
          // لو مش text block، ضيف في النهاية
          newPages[pageIndex].push({ type: 'quote', content: quoteContent, color });
        }
      } else {
        // لو مفيش موضع محفوظ، ضيف في آخر الصفحة
        newPages[focusedPageIndex].push({ type: 'quote', content: quoteContent, color });
      }
      showFeedback('success', 'تمت إضافة اقتباس', 'تم إدراج الاقتباس بنجاح.');
    }
    setPages(newPages);
    setShowQuoteModal(false);
    setEditingQuoteCoords(null);
    setInsertPosition(null);
  };

  const openEditQuote = (pIdx: number, bIdx: number) => {
    setEditingQuoteCoords({ pIdx, bIdx });
    setShowQuoteModal(true);
  };

  const handleDeleteQuote = (pIdx: number, bIdx: number) => {
    const newPages = [...pages];
    newPages[pIdx].splice(bIdx, 1);
    setPages(newPages);
    showFeedback('info', 'تم حذف الاقتباس', 'تم حذف الاقتباس بنجاح.');
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
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-2 md:px-4 pb-52">
      <PageHeader
        leftAction={{
          onClick: onCancel,
          label: 'رجوع'
        }}
        rightAction={{
          onClick: handleSave,
          label: initialNote ? 'تحديث الملاحظة' : 'إنشاء الملاحظة',
          variant: 'primary',
          icon: initialNote ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )
        }}
        className="mb-4 md:mb-8"
      >
        <div className="relative group pt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الملاحظة..."
            className="w-full bg-transparent border-none text-2xl font-bold text-white placeholder-slate-800 focus:outline-none focus:ring-0 transition-all text-right"
          />
        </div>
      </PageHeader>

      <div className="space-y-4 md:space-y-8 flex-1">
        <div className="space-y-4 md:space-y-6">
          {pages.map((blocks, pageIndex) => (
            <div 
              key={pageIndex} 
              className={`animate-slide-up bg-slate-900/10 rounded-xl p-3 md:p-6 border transition-all ${focusedPageIndex === pageIndex ? 'border-slate-800' : 'border-transparent'}`}
              onFocus={() => setFocusedPageIndex(pageIndex)}
              onClick={() => setFocusedPageIndex(pageIndex)}
            >
              <div className="mr-4 mb-3 text-blue-500/40 font-bold text-base select-none">
                {pageIndex + 1}
              </div>
              <div className="space-y-2 md:space-y-4">
                {blocks.map((block, bIndex) => (
                  <div key={bIndex}>
                    {block.type === 'text' ? (
                      <textarea
                        ref={(el) => { if (bIndex === 0) textareasRef.current[pageIndex] = el; }}
                        value={block.content}
                        onChange={(e) => updateTextBlock(pageIndex, bIndex, e.target.value, e.target)}
                        onSelect={(e) => {
                          const textarea = e.target as HTMLTextAreaElement;
                          setInsertPosition({ pageIndex, blockIndex: bIndex, cursorPos: textarea.selectionStart });
                        }}
                        onClick={(e) => {
                          const textarea = e.target as HTMLTextAreaElement;
                          setInsertPosition({ pageIndex, blockIndex: bIndex, cursorPos: textarea.selectionStart });
                        }}
                        placeholder="اكتب هنا..."
                        className="w-full min-h-[120px] bg-transparent text-slate-300 placeholder-slate-700 focus:outline-none text-right leading-[1.7] text-base resize-none"
                      />
                    ) : (
                      <div 
                        style={{ borderRightColor: block.color, backgroundColor: `${block.color}10` }}
                        className="p-4 md:p-5 rounded-xl border-r-[4px] text-right mb-4 group/quote relative overflow-hidden"
                      >
                        <div className="absolute -top-1 right-2 text-2xl text-slate-700/20 font-serif select-none">"</div>
                        <p className="text-slate-100 italic text-sm md:text-base leading-normal relative z-10 font-medium pr-12">
                          {block.content}
                        </p>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 opacity-0 group-hover/quote:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditQuote(pageIndex, bIndex);
                            }}
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
                            title="تعديل الاقتباس"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuote(pageIndex, bIndex);
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Taskbar onLogout={onLogout}>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={addNewPage}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3 rounded-xl transition-all shadow-lg"
            title="صفحة جديدة"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <button
            onClick={() => {
              setEditingQuoteCoords(null);
              setShowQuoteModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 p-3 rounded-xl transition-all border border-slate-700"
            title="إضافة اقتباس"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>

          {pages.length > 1 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 p-3 rounded-xl transition-all border border-slate-700 active:scale-95"
              title="حذف الصفحة"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-800/50">
            {/* البار العلوي */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-slate-200 font-medium text-sm">تأكيد الحذف</h3>
              <div className="w-7"></div>
            </div>
            <div className="px-3 py-4 text-center">
              <p className="text-slate-300 text-sm mb-4">هل أنت متأكد من حذف هذه الصفحة؟</p>
            </div>
            <div className="px-3 pb-3 flex gap-2 justify-center">
              <button onClick={() => setShowDeleteConfirm(false)} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors" title="إلغاء">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button onClick={handleDeletePage} className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors" title="حذف">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
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
