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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

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
      <div className="relative pb-52 pt-8 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <header className="flex items-center justify-between mb-4 md:mb-6 border-b border-slate-800 pb-3 md:pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
              إدارة النظام
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm font-medium truncate">
            {searchQuery.trim()
              ? `${filteredUsers.length} من ${users.length}`
              : users.length > 0 
                ? `${users.length} مستخدم`
                : 'لا يوجد مستخدمين'}
          </p>
        </div>

        <button
          className="group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 transition-all shrink-0"
          title="لوحة الأدمن"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </button>
      </header>

      {/* جدول المستخدمين المتطور */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500">جاري تحميل البيانات...</div>
        </div>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-slate-800">
                  <th className="px-3 md:px-5 py-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">المستخدم</th>
                  <th className="px-3 md:px-5 py-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider hidden sm:table-cell">كلمة المرور</th>
                  <th className="px-3 md:px-5 py-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider text-center">الملاحظات</th>
                  <th className="px-3 md:px-5 py-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider text-center hidden md:table-cell">تاريخ الانضمام</th>
                  <th className="px-3 md:px-5 py-3 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500 text-sm">
                      لا توجد مستخدمين في النظام
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 && searchQuery.trim() ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500 text-sm">
                      لا توجد نتائج تطابق بحثك "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-3 md:px-5 py-3">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-semibold text-sm md:text-base truncate">{u.username}</span>
                            <span className="text-slate-500 text-[9px] md:text-[10px] font-mono">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-slate-700"></div>)}
                        </div>
                      </td>
                      <td className="px-3 md:px-5 py-3 text-center">
                        <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-bold border ${u.notesCount > 20 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {u.notesCount}
                        </span>
                      </td>
                      <td className="px-3 md:px-5 py-3 text-center text-slate-400 text-xs font-medium hidden md:table-cell">
                        {u.joinDate}
                      </td>
                      <td className="px-3 md:px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleOpenManager(u)}
                            className="p-2 md:p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg md:rounded-xl transition-all active:scale-90 border border-slate-700 hover:border-blue-400"
                            title="إدارة الحساب"
                          >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </button>
                          {u.username !== 'admin' && (
                            <button 
                              onClick={() => openDeleteModal(u)}
                              className="p-2 md:p-2.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg md:rounded-xl transition-all active:scale-90 border border-slate-700 hover:border-red-400"
                              title="حذف المستخدم"
                            >
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
         {/* Search Button/Input */}
         {!isSearchOpen ? (
           <button
             onClick={() => setIsSearchOpen(true)}
             className="flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white p-3 rounded-xl transition-all backdrop-blur-md border border-slate-700"
             title="بحث عن مستخدم"
           >
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </button>
         ) : (
           <div
             className="relative flex items-center bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl px-2 py-2 transition-all duration-300 w-[120px] sm:w-[160px] md:w-[200px]"
             style={{ animation: "slideIn 0.3s ease-out" }}
           >
             <button
               onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
               className="flex items-center justify-center text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50 shrink-0"
               title="إغلاق البحث"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="ابحث..."
               className="flex-1 bg-transparent text-slate-300 placeholder-slate-500 outline-none text-sm px-1 min-w-0"
               autoFocus
             />
             <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
         )}

         <button
           onClick={() => setIsCreateModalOpen(true)}
           className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3 rounded-xl transition-all shadow-lg"
           title="إضافة مستخدم جديد"
         >
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
           </svg>
         </button>
      </Taskbar>

      {/* نافذة إدارة المستخدم (Modal) */}
      {isModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* البار العلوي */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-slate-200 font-medium text-sm">إدارة حساب {selectedUser.username}</h2>
              <div className="w-7"></div>
            </div>
            
            <div className="px-3 py-3 space-y-3">
              <div className="p-3 bg-slate-800/40 rounded-lg text-right">
                <span className="block text-[10px] text-slate-500 font-medium uppercase mb-1">المستخدم</span>
                <span className="text-sm font-medium text-white">{selectedUser.username}</span>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">كلمة المرور الحالية</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={selectedUser.password || ''}
                    placeholder="غير متوفرة"
                    className="w-full bg-slate-800/50 rounded-lg px-3 py-2 pr-12 text-white text-sm placeholder-slate-600 focus:outline-none text-right font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedUser.password) {
                        navigator.clipboard.writeText(selectedUser.password);
                        alert('تم نسخ كلمة المرور!');
                      }
                    }}
                    className="absolute left-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-xs"
                    title="نسخ كلمة المرور"
                    disabled={!selectedUser.password}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div className="space-y-1 text-right">
                  <label className="text-xs text-slate-500 block">تغيير كلمة المرور</label>
                  <input
                    autoFocus
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة..."
                    className="w-full bg-slate-800/50 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right font-mono"
                    required
                  />
                </div>
                
                <div className="flex gap-2 justify-center pt-1">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors" title="إلغاء">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                   <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors" title="تحديث">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة مستخدم جديد (Modal) */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* البار العلوي */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewUsername('');
                  setNewUserPassword('');
                }} 
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-slate-200 font-medium text-sm">إضافة مستخدم جديد</h2>
              <div className="w-7"></div>
            </div>
            
            <form onSubmit={handleCreateUser} className="px-3 py-3 space-y-3">
              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">اسم المستخدم</label>
                <input
                  autoFocus
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full bg-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right"
                  required
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs text-slate-500 block">كلمة المرور</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:bg-slate-800 transition-colors text-right"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex gap-2 justify-center pt-1">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewUsername('');
                    setNewUserPassword('');
                  }} 
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="إلغاء"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button 
                  type="submit" 
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  title="إضافة"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف (Delete Confirmation Modal) */}
      {isDeleteModalOpen && userToDelete && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-slate-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* البار العلوي */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }} 
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-slate-200 font-medium text-sm">تأكيد الحذف</h2>
              <div className="w-7"></div>
            </div>
            
            <div className="px-3 py-4 text-center">
              <p className="text-slate-300 text-sm mb-2">
                هل أنت متأكد من حذف المستخدم <span className="font-medium text-white">{userToDelete.username}</span>؟
              </p>
              <p className="text-red-400 text-xs">
                سيتم حذف جميع ملاحظات المستخدم أيضاً.
              </p>
            </div>
            
            <div className="px-3 pb-3 flex gap-2 justify-center">
              <button 
                type="button" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }} 
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="إلغاء"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                type="button"
                onClick={handleDeleteUser}
                className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                title="حذف"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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
