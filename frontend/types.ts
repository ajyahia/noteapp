
export interface Comment {
  title: string;
  content: string;
  color: string;
}

export type BlockType = 'text' | 'quote';

export interface NoteBlock {
  type: BlockType;
  content: string;
  color?: string; // لتمويل لون الاقتباس
}

export interface Note {
  id: string;
  title: string;
  content: string; // للملحوظات القديمة أو النسخة الاحتياطية
  blocks: NoteBlock[][]; // مصفوفة الصفحات، وكل صفحة مصفوفة من المكعبات
  date: string;
  comments?: Record<string, Comment>; // key format: "pageIndex-wordIndex"
}

export type View = 'LOGIN' | 'DASHBOARD' | 'ADD_NOTE' | 'PROFILE' | 'READ_NOTE' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  notesCount: number;
  joinDate: string;
}

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface Feedback {
  id: string;
  type: FeedbackType;
  title: string;
  message?: string;
}
