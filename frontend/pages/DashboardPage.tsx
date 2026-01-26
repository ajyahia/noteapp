import React, { useState, useMemo } from "react";
import { Note } from "../types";
import NoteCard from "../components/NoteCard";
import Taskbar from "../components/Taskbar";
import PageHeader from "../components/PageHeader";
import ShareModal from "../components/ShareModal";

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

interface DashboardPageProps {
  notes: Note[];
  user: { username: string };
  onLogout: () => void;
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
  onReadNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onGoToProfile: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  notes,
  user,
  onLogout,
  onAddNote,
  onEditNote,
  onReadNote,
  onDeleteNote,
  onGoToProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [shareNote, setShareNote] = useState<Note | null>(null);

  // Helper function to get initials from username
  const getInitials = (name: string): string => {
    if (!name || name.trim() === "") return "?";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      // If only one word, return first character
      return parts[0].charAt(0);
    }

    // Return first letter of first and last name
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);

    return `${firstInitial}.${lastInitial}`;
  };

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes;
    }

    const query = searchQuery.toLowerCase().trim();

    return notes.filter((note) => {
      // Search in title
      if (note.title.toLowerCase().includes(query)) {
        return true;
      }

      // Search in content
      if (note.content && note.content.toLowerCase().includes(query)) {
        return true;
      }

      // Search in blocks (all text content)
      if (note.blocks && Array.isArray(note.blocks)) {
        for (const page of note.blocks) {
          if (Array.isArray(page)) {
            for (const block of page) {
              if (
                block.content &&
                block.content.toLowerCase().includes(query)
              ) {
                return true;
              }
            }
          }
        }
      }

      return false;
    });
  }, [notes, searchQuery]);
  return (
    <>
      <style>{slideInStyle}</style>
      <div className="relative pb-52 pt-8 px-4 md:px-8 max-w-7xl mx-auto">
        <PageHeader
          className="mb-4 md:mb-6"
          sticky={true}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                  ملاحظاتي
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-medium truncate">
                {searchQuery.trim()
                  ? `${filteredNotes.length} من ${notes.length}`
                  : `${notes.length} ملاحظة`}
              </p>
            </div>

          <button
            onClick={onGoToProfile}
            className="group flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 transition-all shrink-0"
            title="الملف الشخصي"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          </div>
        </PageHeader>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 transition-all hover:scale-110 hover:border-blue-500/30">
              <svg
                className="w-10 h-10 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-3">
              لا توجد ملاحظات بعد
            </h2>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              كن مبدعاً وابدأ بتدوين أفكارك الآن، ملاحظاتك ستظهر هنا بشكل منظم
              وجميل.
            </p>
          </div>
        ) : filteredNotes.length === 0 && searchQuery.trim() ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 transition-all hover:scale-110 hover:border-blue-500/30">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-3">
              لم يتم العثور على نتائج
            </h2>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              لا توجد ملاحظات تطابق بحثك "{searchQuery}". جرب كلمات مفتاحية
              أخرى.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => onEditNote(note)}
                onRead={() => onReadNote(note)}
                onDelete={onDeleteNote}
                onShare={() => setShareNote(note)}
              />
            ))}
          </div>
        )}

        <Taskbar onLogout={onLogout}>
          {/* Search Button/Input */}
          <div className="relative flex items-center">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white p-3 rounded-xl transition-all shadow-lg"
                title="بحث"
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
                className="relative flex items-center bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 transition-all duration-500 shadow-lg min-w-[200px] md:min-w-[300px]"
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
                  placeholder="ابحث هنا..."
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

          {/* Add Note Button */}
          <button
            onClick={onAddNote}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white p-3 rounded-xl transition-all shadow-lg"
            title="إضافة ملاحظة"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </Taskbar>

        {shareNote && (
          <ShareModal
            noteId={shareNote.id}
            noteTitle={shareNote.title}
            onClose={() => setShareNote(null)}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
