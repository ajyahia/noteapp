import React, { useState, useCallback, useEffect } from "react";
import { View, Note, Comment, NoteBlock } from "./types";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddNotePage from "./pages/AddNotePage";
import ProfilePage from "./pages/ProfilePage";
import ReadingPage from "./pages/ReadingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { FeedbackProvider, useFeedback } from "./context/FeedbackContext";
import { api, removeToken } from "./api";

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("LOGIN");
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const { showFeedback } = useFeedback();

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    // Check if admin login route
    if (window.location.hash === "#admin") {
      setCurrentView("ADMIN_LOGIN");
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (token) {
      // Try to fetch user info and notes to verify token is still valid
      Promise.all([api.getUser(), api.getNotes()])
        .then(([userResponse, fetchedNotes]) => {
          setUser({ username: userResponse.user.username });
          setNotes(fetchedNotes);
          setCurrentView("DASHBOARD");
        })
        .catch(() => {
          // Token is invalid, clear it
          removeToken();
          setCurrentView("LOGIN");
        });
    }
  }, []);

  const handleLogin = useCallback(
    async (credentials: any) => {
      try {
        const response = await api.login(
          credentials.username,
          credentials.password
        );
        setUser({ username: response.user.username });
        setCurrentView("DASHBOARD");

        // Fetch notes after successful login
        try {
          const fetchedNotes = await api.getNotes();
          setNotes(fetchedNotes);
        } catch (notesError) {
          console.error("Error fetching notes:", notesError);
          setNotes([]);
        }

        showFeedback(
          "success",
          "تم الدخول بنجاح",
          "مرحباً بك في لوحة التحكم الخاصة بك."
        );
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMessage =
          error.message || "اسم المستخدم أو كلمة المرور غير صحيحة";
        showFeedback("error", "فشل تسجيل الدخول", errorMessage);
      }
    },
    [showFeedback]
  );

  const handleAdminLogin = useCallback(
    async (credentials: any) => {
      try {
        const response = await api.adminLogin(
          credentials.username,
          credentials.password
        );
        setCurrentView("ADMIN_DASHBOARD");
        showFeedback(
          "success",
          "تم الدخول بنجاح",
          "مرحباً بك في لوحة إدارة النظام."
        );
      } catch (error: any) {
        console.error("Admin login error:", error);
        const errorMessage = error.message || "بيانات المسؤول غير صحيحة";
        showFeedback("error", "فشل تسجيل الدخول", errorMessage);
      }
    },
    [showFeedback]
  );

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      removeToken();
      setUser(null);
      setNotes([]);
      setCurrentView("LOGIN");
      setActiveNote(null);
      showFeedback("info", "تم تسجيل الخروج", "نراك قريباً!");
    }
  }, [showFeedback]);

  const handleSaveNote = useCallback(
    async (title: string, pages: NoteBlock[][]) => {
      const isUpdate = activeNote !== null;

      try {
        if (isUpdate) {
          const updatedNote = await api.updateNote(activeNote.id.toString(), {
            title,
            blocks: pages,
            content: pages[0]?.[0]?.content || "",
          });
          setNotes((prev) =>
            prev.map((n) => (n.id === activeNote.id ? updatedNote : n))
          );
          showFeedback(
            "success",
            "تم تحديث الملاحظة",
            "تم حفظ التعديلات بنجاح."
          );
        } else {
          const newNote = await api.createNote({
            title,
            blocks: pages,
            content: pages[0]?.[0]?.content || "",
            date: new Date().toLocaleDateString("ar-SA"),
          });
          setNotes((prev) => [newNote, ...prev]);
          showFeedback(
            "success",
            "تم إنشاء الملاحظة",
            "تمت إضافة الملاحظة الجديدة لقائمتك."
          );
        }

        setCurrentView("DASHBOARD");
        setActiveNote(null);
      } catch (error: any) {
        showFeedback(
          "error",
          "فشل الحفظ",
          error.message || "حدث خطأ أثناء حفظ الملاحظة."
        );
      }
    },
    [activeNote, showFeedback]
  );

  const handleUpdateProfile = useCallback(
    async (username: string, password?: string) => {
      try {
        const updateData: { username?: string; password?: string } = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;

        const response = await api.updateProfile(updateData);
        setUser({ username: response.user.username });
        setCurrentView("DASHBOARD");
        showFeedback(
          "success",
          "تم تحديث الملف الشخصي",
          "تم حفظ بياناتك الجديدة بنجاح."
        );
      } catch (error: any) {
        showFeedback(
          "error",
          "فشل التحديث",
          error.message || "حدث خطأ أثناء تحديث الملف الشخصي."
        );
      }
    },
    [showFeedback]
  );

  const handleDeleteNote = useCallback(
    async (id: string) => {
      try {
        await api.deleteNote(id);
        setNotes((prev) => prev.filter((n) => n.id.toString() !== id));
        showFeedback(
          "warning",
          "تم حذف الملاحظة",
          "تمت إزالة الملاحظة من سجلاتك."
        );
      } catch (error: any) {
        showFeedback(
          "error",
          "فشل الحذف",
          error.message || "حدث خطأ أثناء حذف الملاحظة."
        );
      }
    },
    [showFeedback]
  );

  const handleSaveComment = useCallback(
    async (noteId: string, key: string, comment: Comment) => {
      try {
        const note = notes.find((n) => n.id.toString() === noteId);
        if (!note) return;

        const updatedComments = {
          ...(note.comments || {}),
          [key]: comment,
        };

        const updatedNote = await api.updateNote(noteId, {
          comments: updatedComments,
        });

        setNotes((prev) =>
          prev.map((n) => (n.id.toString() === noteId ? updatedNote : n))
        );
        showFeedback(
          "success",
          "تم حفظ التعليق",
          "تمت إضافة التعليق على الكلمة المحددة."
        );
      } catch (error: any) {
        showFeedback(
          "error",
          "فشل الحفظ",
          error.message || "حدث خطأ أثناء حفظ التعليق."
        );
      }
    },
    [notes, showFeedback]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 transition-colors duration-300">
      {currentView === "LOGIN" && (
        <LoginPage
          onLogin={handleLogin}
          onGoToAdmin={() => setCurrentView("ADMIN_LOGIN")}
        />
      )}
      {currentView === "ADMIN_LOGIN" && (
        <AdminLoginPage onLogin={handleAdminLogin} />
      )}
      {currentView === "ADMIN_DASHBOARD" && (
        <AdminDashboardPage
          onLogout={() => {
            setCurrentView("ADMIN_LOGIN");
            showFeedback("info", "تم تسجيل الخروج", "نراك قريباً!");
          }}
        />
      )}
      {currentView === "DASHBOARD" && user && (
        <DashboardPage
          notes={notes}
          user={user}
          onLogout={handleLogout}
          onAddNote={() => {
            setActiveNote(null);
            setCurrentView("ADD_NOTE");
          }}
          onEditNote={(n) => {
            setActiveNote(n);
            setCurrentView("ADD_NOTE");
          }}
          onReadNote={(n) => {
            setActiveNote(n);
            setCurrentView("READ_NOTE");
          }}
          onDeleteNote={handleDeleteNote}
          onGoToProfile={() => setCurrentView("PROFILE")}
        />
      )}
      {currentView === "ADD_NOTE" && (
        <AddNotePage
          initialNote={activeNote || undefined}
          onSave={handleSaveNote}
          onCancel={() => setCurrentView("DASHBOARD")}
          onLogout={handleLogout}
        />
      )}
      {currentView === "PROFILE" && user && (
        <ProfilePage
          user={user}
          onSave={handleUpdateProfile}
          onCancel={() => setCurrentView("DASHBOARD")}
          onLogout={handleLogout}
        />
      )}
      {currentView === "READ_NOTE" && activeNote && (
        <ReadingPage
          note={notes.find((n) => n.id === activeNote.id) || activeNote}
          onEdit={() => setCurrentView("ADD_NOTE")}
          onBack={() => setCurrentView("DASHBOARD")}
          onLogout={handleLogout}
          onSaveComment={handleSaveComment}
          onUpdatePageBlocks={() => {}}
        />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <FeedbackProvider>
    <AppContent />
  </FeedbackProvider>
);

export default App;
