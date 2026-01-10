
import React from 'react';

interface TaskbarProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const Taskbar: React.FC<TaskbarProps> = ({ onLogout, children }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/10 px-4 md:px-6 py-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between pointer-events-auto overflow-hidden ring-1 ring-white/5">
        
        {/* المساحة المخصصة للأزرار التفاعلية على اليمين */}
        <div className="flex items-center gap-2 md:gap-4">
          {children}
        </div>

        {/* زر تسجيل الخروج - متكيف */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-all p-3 md:px-4 md:py-2 rounded-2xl hover:bg-red-500/10 group"
          title="تسجيل الخروج"
        >
          <span className="text-sm font-bold hidden sm:inline">تسجيل الخروج</span>
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default Taskbar;
