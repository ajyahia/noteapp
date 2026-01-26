
import React, { useState, useEffect } from 'react';
import { Note, SharedNoteData, Comment } from '../types';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
import CommentViewModal from '../components/CommentViewModal';

interface SharedNotePageProps {
  shareToken: string;
  isLoggedIn: boolean;
  onImportSuccess: (note: Note) => void;
  onBack: () => void;
  onLogin: () => void;
}

const SharedNotePage: React.FC<SharedNotePageProps> = ({ 
  shareToken, 
  isLoggedIn,
  onImportSuccess,
  onBack,
  onLogin
}) => {
  const [sharedData, setSharedData] = useState<SharedNoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [selectedWordKey, setSelectedWordKey] = useState<string | null>(null);
  const [isCommentViewOpen, setIsCommentViewOpen] = useState(false);

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        setLoading(true);
        const data = await api.getSharedNote(shareToken);
        setSharedData(data);
      } catch (err: any) {
        setError(err.message || 'فشل تحميل الملاحظة');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNote();
  }, [shareToken]);

  const handleImport = async () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }

    try {
      setImporting(true);
      const data = await api.importSharedNote(shareToken);
      setImported(true);
      onImportSuccess(data.note);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">جاري تحميل الملاحظة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">خطأ</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (!sharedData) return null;

  const { note, shared_by, shared_at } = sharedData;

  const handleWordClick = (pIndex: number, bIndex: number, wIndex: number) => {
    const key = `${pIndex}-${bIndex}-${wIndex}`;
    const comment = note.comments?.[key];
    if (comment) {
      setSelectedWordKey(key);
      setIsCommentViewOpen(true);
    }
  };

  const currentComment: Comment | null = selectedWordKey ? (note.comments?.[selectedWordKey] || null) : null;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 pb-52">
      <PageHeader
        leftAction={isLoggedIn ? {
          onClick: onBack,
          label: 'العودة'
        } : undefined}
        centerContent={
          <div className="bg-slate-800/50 px-4 py-1.5 rounded-full">
            <span className="text-xs text-slate-400">ملاحظة مشتركة من <span className="text-blue-400 font-medium">{shared_by}</span></span>
          </div>
        }
        className="mb-6"
      />

      <div className="mb-6 text-right">
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-[1.3] mb-2">
          {note.title}
        </h1>
        <div className="flex items-center gap-3 justify-end text-sm text-slate-500">
          <span>تاريخ المشاركة: {shared_at}</span>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6 flex-1">
        {note.blocks.map((blocks, pIndex) => (
          <div 
            key={pIndex} 
            className="bg-slate-900/30 rounded-xl p-5 md:p-7 border border-slate-800/40"
          >
            <div className="space-y-3 md:space-y-4">
              {blocks.map((block, bIndex) => {
                if (block.type === 'quote') {
                  return (
                    <div 
                      key={bIndex}
                      style={{ borderRightColor: block.color }}
                      className="relative p-4 md:p-5 rounded-xl border-r-[4px] bg-slate-900/50 text-right"
                    >
                      <p className="text-base md:text-lg text-slate-100 italic leading-normal font-semibold">
                        {block.content}
                      </p>
                    </div>
                  );
                }

                const words = block.content.split(/(\s+)/).filter(w => w.length > 0);
                return (
                  <div key={bIndex} className="text-base md:text-lg text-slate-300 leading-[1.7] text-right">
                    {words.map((word, wIndex) => {
                      const key = `${pIndex}-${bIndex}-${wIndex}`;
                      const comment = note.comments?.[key];
                      if (/^\s+$/.test(word)) return <span key={key}>{word}</span>;

                      return (
                        <span
                          key={key}
                          onClick={() => handleWordClick(pIndex, bIndex, wIndex)}
                          style={{ 
                            color: comment ? comment.color : undefined,
                          }}
                          className={`
                            rounded-xl px-1 py-0.5 transition-all duration-300 inline-block relative
                            ${comment ? 'font-bold cursor-pointer hover:opacity-80' : ''}
                          `}
                        >
                          {word}
                          {comment && (
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

      {/* Action Bar */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            {imported ? (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-sm">تمت إضافة الملاحظة لحسابك!</span>
              </div>
            ) : (
              <button
                onClick={handleImport}
                disabled={importing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
                title="إضافة لملاحظاتي"
              >
                {importing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Comment View Modal (Read-only) */}
      {isCommentViewOpen && currentComment && (
        <CommentViewModal 
          comment={currentComment}
          onClose={() => {
            setIsCommentViewOpen(false);
            setSelectedWordKey(null);
          }}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default SharedNotePage;
