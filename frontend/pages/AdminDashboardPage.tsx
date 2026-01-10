import React, { useState, useEffect, useMemo } from 'react';
import { UserAccount } from '../types';
import Taskbar from '../components/Taskbar';
import { api } from '../api';

// Add slide-in animation keyframes
const slideInStyle = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-1rem);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

interface AdminDashboardPageProps {
  onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // جلب المستخدمين من API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await api.getAdminUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // يمكنك إضافة رسالة خطأ هنا
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase().trim();

    return users.filter((user) => {
      // Search in username
      if (user.username.toLowerCase().includes(query)) {
        return true;
      }

      // Search in user ID
      if (user.id.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [users, searchQuery]);

  const handleOpenManager = (user: UserAccount) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsModalOpen(true);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && newPassword.trim()) {
      try {
        await api.updateUserPassword(selectedUser.id, newPassword.trim());
        // Refresh users list after update
        const fetchedUsers = await api.getAdminUsers();
        setUsers(fetchedUsers);
        setIsModalOpen(false);
        setSelectedUser(null);
        setNewPassword('');
      } catch (error: any) {
        console.error('Error updating password:', error);
        alert(error.message || 'فشل تحديث كلمة المرور');
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim() && newUserPassword.trim()) {
      try {
        const newUser = await api.createUser(newUsername.trim(), newUserPassword.trim());
        // Refresh users list after creation
        const fetchedUsers = await api.getAdminUsers();
        setUsers(fetchedUsers);
        setIsCreateModalOpen(false);
        setNewUsername('');
        setNewUserPassword('');
        alert('تم إنشاء المستخدم بنجاح!');
      } catch (error: any) {
        console.error('Error creating user:', error);
        alert(error.message || 'فشل إنشاء المستخدم');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await api.deleteUser(userToDelete.id);
      // Refresh users list after deletion
      const fetchedUsers = await api.getAdminUsers();
      setUsers(fetchedUsers);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      alert('تم حذف المستخدم بنجاح!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'فشل حذف المستخدم');
    }
  };

  const openDeleteModal = (user: UserAccount) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <style>{slideInStyle}</style>
      <div className="relative pb-32 pt-8 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <header className="flex items-center justify-between mb-10 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            إدارة النظام
          </h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {searchQuery.trim()
              ? `تم العثور على ${filteredUsers.length} من ${users.length} مستخدم`
              : users.length > 0 
                ? `إجمالي ${users.length} مستخدم ${users.length === 1 ? 'مسجل' : 'مسجلين'} في النظام`
                : 'لا يوجد مستخدمين مسجلين في النظام بعد'}
          </p>
        </div>

        <div className="flex gap-4">
          {/* Search Button/Input */}
          <div className="relative flex items-center">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white p-3 rounded-2xl transition-all shadow-lg"
                title="بحث عن مستخدم"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            ) : (
              <div
                className="relative flex items-center bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 transition-all duration-500 shadow-lg min-w-[200px] md:min-w-[300px]"
                style={{
                  animation: "slideIn 0.5s ease-out",
                }}
              >
                {/* Close Button - Absolute Left */}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute left-3 flex items-center justify-center text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50 z-10"
                  title="إغلاق البحث"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Search Input with padding for icons */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مستخدم..."
                  className="w-full bg-transparent text-slate-300 placeholder-slate-500 outline-none text-sm md:text-base pl-10 pr-10"
                  autoFocus
                  onBlur={() => {
                    // Close search if empty after blur
                    if (!searchQuery.trim()) {
                      setIsSearchOpen(false);
                    }
                  }}
                />

                {/* Search Icon - Absolute Right */}
                <svg
                  className="absolute right-3 w-5 h-5 text-slate-400 flex-shrink-0 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="group relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-600 rounded-2xl blur-md opacity-25 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-600 p-[2.5px] shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95">
              <div className="w-full h-full rounded-[13px] bg-slate-950 flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:bg-transparent">
                <span className="text-xl font-black tracking-tighter bg-gradient-to-tr from-blue-300 to-indigo-200 bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                  أ.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* جدول المستخدمين المتطور */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500">جاري تحميل البيانات...</div>
        </div>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-slate-800">
                  <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">المستخدم</th>
                  <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest">كلمة المرور</th>
                  <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">الملاحظات</th>
                  <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">تاريخ الانضمام</th>
                  <th className="px-8 py-6 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                      لا توجد مستخدمين في النظام
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 && searchQuery.trim() ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                      لا توجد نتائج تطابق بحثك "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                            {u.username[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-lg">{u.username}</span>
                            <span className="text-slate-500 text-[10px] font-mono">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>)}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1 rounded-full text-[11px] font-black border ${u.notesCount > 20 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {u.notesCount} ملاحظة
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center text-slate-400 text-sm font-medium">
                        {u.joinDate}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenManager(u)}
                            className="p-3 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90 border border-slate-700 hover:border-blue-400 shadow-xl group/btn"
                            title="إدارة الحساب"
                          >
                            <svg className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </button>
                          {u.username !== 'admin' && (
                            <button 
                              onClick={() => openDeleteModal(u)}
                              className="p-3 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90 border border-slate-700 hover:border-red-400 shadow-xl group/btn"
                              title="حذف المستخدم"
                            >
                              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Taskbar onLogout={onLogout}>
         <button
           onClick={() => setIsCreateModalOpen(true)}
           className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3 md:px-8 md:py-3 rounded-2xl md:rounded-full transition-all shadow-xl shadow-blue-900/40 overflow-hidden"
           title="إضافة مستخدم جديد"
         >
           <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
           <svg
             className="w-7 h-7 md:w-6 md:h-6"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2.5}
               d="M12 4v16m8-8H4"
             />
           </svg>
           <span className="font-black text-lg hidden sm:inline">
             إضافة مستخدم
           </span>
         </button>
      </Taskbar>

      {/* نافذة إدارة المستخدم (Modal) */}
      {isModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.1)] p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
               <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
               </div>
               <h2 className="text-2xl font-bold text-white tracking-tight">إدارة حساب {selectedUser.username}</h2>
            </div>
            
            <div className="mb-8 space-y-4">
              <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 text-right">
                <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">المستخدم</span>
                <span className="text-xl font-bold text-white tracking-tight">{selectedUser.username}</span>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2 text-right">
                  <label className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">تغيير كلمة المرور</label>
                  <input
                    autoFocus
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة..."
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-right font-mono"
                    required
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl border border-slate-700 transition-all active:scale-95">إلغاء</button>
                   <button type="submit" className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95">تحديث الآن</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة مستخدم جديد (Modal) */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(37,99,235,0.1)] p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">إضافة مستخدم جديد</h2>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-slate-300 block mr-1">اسم المستخدم</label>
                <input
                  autoFocus
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-right"
                  required
                />
              </div>

              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-slate-300 block mr-1">كلمة المرور</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-right"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewUsername('');
                    setNewUserPassword('');
                  }} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl border border-slate-700 transition-all active:scale-[0.98]"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                  إضافة المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف (Delete Confirmation Modal) */}
      {isDeleteModalOpen && userToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] shadow-[0_0_100px_rgba(239,68,68,0.1)] p-10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">تأكيد الحذف</h2>
              <p className="text-slate-400 text-sm">
                هل أنت متأكد من حذف المستخدم <span className="font-bold text-white">{userToDelete.username}</span>؟
              </p>
              <p className="text-red-400 text-xs mt-2">
                سيتم حذف جميع ملاحظات المستخدم أيضاً. لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl border border-slate-700 transition-all active:scale-[0.98]"
              >
                إلغاء
              </button>
              <button 
                type="button"
                onClick={handleDeleteUser}
                className="flex-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-red-900/40 active:scale-[0.98]"
              >
                حذف المستخدم
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
