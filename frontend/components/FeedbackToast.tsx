
import React from 'react';
import { Feedback } from '../types';

interface FeedbackToastProps {
  feedback: Feedback;
  onRemove: () => void;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({ feedback, onRemove }) => {
  const configs = {
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const config = configs[feedback.type];

  return (
    <div className={`pointer-events-auto flex gap-4 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-toast-in ${config.bg} ${config.border}`}>
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 text-right">
        <h4 className="text-sm font-bold text-white">{feedback.title}</h4>
        {feedback.message && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feedback.message}</p>}
      </div>
      <button 
        onClick={onRemove}
        className="text-slate-300 hover:text-white transition-colors flex-shrink-0"
        aria-label="إغلاق"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-toast-in {
          animation: toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackToast;
