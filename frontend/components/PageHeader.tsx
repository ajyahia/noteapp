import React, { useState, useEffect } from 'react';

interface PageHeaderProps {
  leftAction?: {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
  };
  rightAction?: {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary';
  };
  centerContent?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  leftAction,
  rightAction,
  centerContent,
  children,
  className = '',
  sticky = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  const stickyClasses = sticky 
    ? 'sticky top-0 z-40' 
    : '';

  const backgroundClasses = isScrolled && sticky
    ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-900/50 transition-all duration-300'
    : 'transition-all duration-300';

  return (
    <header className={`${stickyClasses} ${backgroundClasses} ${className} animate-fade-in`}>
      <div className="flex items-center justify-between py-3 md:py-4 px-3 md:px-6">
        {/* Left Action */}
        {leftAction ? (
          <button 
            onClick={leftAction.onClick}
            className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-all bg-slate-900/50 hover:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-800/50 backdrop-blur-md"
          >
            {leftAction.icon || (
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <span className="font-medium text-xs hidden sm:inline">{leftAction.label}</span>
          </button>
        ) : (
          <div></div>
        )}

        {/* Center Content */}
        {centerContent && (
          <div className={`flex-1 flex ${rightAction ? 'justify-center' : 'justify-end'}`}>
            {centerContent}
          </div>
        )}

        {/* Right Action */}
        {rightAction ? (
          <button 
            onClick={rightAction.onClick}
            className={`flex items-center gap-1.5 transition-all active:scale-95 ${
              rightAction.variant === 'primary'
                ? 'bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold text-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-semibold text-sm border border-slate-700'
            }`}
          >
            {rightAction.icon && <span className="md:hidden">{rightAction.icon}</span>}
            <span className="hidden md:inline">{rightAction.label}</span>
          </button>
        ) : centerContent ? (
          <div></div>
        ) : null}
      </div>
      
      {/* Additional Children Content */}
      {children && (
        <div className="px-3 md:px-6 pb-3 md:pb-4">
          {children}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
