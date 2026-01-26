
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Feedback, FeedbackType } from '../types';
import FeedbackContainer from '../components/FeedbackContainer';

interface FeedbackContextType {
  showFeedback: (type: FeedbackType, title: string, message?: string) => void;
  removeFeedback: (id: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const removeFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const showFeedback = useCallback((type: FeedbackType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newFeedback: Feedback = { id, type, title, message };
    
    setFeedbacks((prev) => [...prev, newFeedback]);

    // جميع الإشعارات تختفي بعد 2 ثانية
    setTimeout(() => {
      removeFeedback(id);
    }, 2000);
  }, [removeFeedback]);

  return (
    <FeedbackContext.Provider value={{ showFeedback, removeFeedback }}>
      {children}
      <FeedbackContainer feedbacks={feedbacks} onRemove={removeFeedback} />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
