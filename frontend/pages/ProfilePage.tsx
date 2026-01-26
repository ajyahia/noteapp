
import React, { useState } from 'react';
import Taskbar from '../components/Taskbar';
import PageHeader from '../components/PageHeader';

interface ProfilePageProps {
  user: {
    username: string;
  };
  onSave: (username: string, password: string) => void;
  onCancel: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSave, onCancel, onLogout }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    if (password !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    onSave(username, password);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 py-8 pb-52">
      <PageHeader
        leftAction={{
          onClick: onCancel,
          label: 'رجوع'
        }}
        className="mb-6 md:mb-8"
      />

      {/* محتوى الصفحة */}
      <div className="flex-1 space-y-12 text-right">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">الملف الشخصي</h1>
          <p className="text-slate-500 font-medium">تعديل بيانات الحساب الشخصية</p>
        </div>

        <div className="grid gap-10 max-w-2xl">
          {/* حقل اسم المستخدم */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-400 mr-1 block">اسم المستخدم</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-right text-lg shadow-inner"
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-400 mr-1 block text-right">كلمة المرور الجديدة</label>
            <div className="relative group/input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-right text-lg shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-2"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-600 mr-1 italic">اترك الحقل فارغاً إذا كنت لا ترغب في تغيير كلمة المرور</p>
          </div>

          {/* حقل تأكيد كلمة المرور */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-400 mr-1 block text-right">تأكيد كلمة المرور</label>
            <div className="relative group/input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all text-right text-lg shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-2"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* شريط المهام في صفحة الملف الشخصي */}
      <Taskbar onLogout={onLogout}>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3 rounded-xl transition-all shadow-lg"
          title="حفظ التعديلات"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </Taskbar>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        input:focus {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
