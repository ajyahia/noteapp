
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface ShareModalProps {
  noteId: string;
  noteTitle: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ noteId, noteTitle, onClose }) => {
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createShareLink = async () => {
      try {
        setLoading(true);
        const data = await api.createShareLink(noteId);
        setShareToken(data.share_token);
      } catch (err: any) {
        setError(err.message || 'فشل إنشاء رابط المشاركة');
      } finally {
        setLoading(false);
      }
    };

    createShareLink();
  }, [noteId]);

  const shareUrl = shareToken 
    ? `${window.location.origin}${window.location.pathname}#share/${shareToken}`
    : '';

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
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
          <h2 className="text-slate-200 font-medium text-sm">مشاركة الملاحظة</h2>
          <div className="w-7"></div>
        </div>

        {loading ? (
          <div className="py-6 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">جاري إنشاء رابط المشاركة...</p>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="px-3 py-3 space-y-3">
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-1">عنوان الملاحظة</p>
              <p className="text-white text-sm font-medium truncate">{noteTitle}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-2 text-right">رابط المشاركة</p>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2">
                <button
                  onClick={handleCopy}
                  className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {copied ? 'تم النسخ!' : 'نسخ'}
                </button>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-slate-300 text-xs text-left dir-ltr focus:outline-none truncate"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-3 text-right">
              <p className="text-slate-400 text-xs leading-relaxed">
                <span className="text-blue-400">•</span> إذا كان المستلم لديه حساب، يمكنه إضافة الملاحظة لحسابه.
                <br />
                <span className="text-blue-400">•</span> إذا لم يكن لديه حساب، يمكنه قراءتها كضيف.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
