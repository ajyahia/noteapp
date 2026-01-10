
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (credentials: any) => void;
  onGoToAdmin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ username, password });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-slate-400 text-sm">مرحباً بك مجدداً في نظام الملاحظات</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block mr-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-right"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block mr-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-right"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            دخول النظام
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center">
          <a 
            href="https://wa.me/201158882871?text=مرحباً، أرجو المساعدة في إعادة تعيين كلمة المرور الخاصة بحسابي في تطبيق الملاحظات."
            target="_blank"
            rel="noopener noreferrer"
            className="block text-slate-500 text-sm hover:text-blue-400 transition-colors"
          >
            نسيت كلمة المرور؟
          </a>
          {onGoToAdmin && (
            <div className="border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={onGoToAdmin}
                className="text-xs text-slate-600 hover:text-blue-400 transition-colors"
              >
                تسجيل دخول المسؤول →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
