
import React from 'react';
import { Feedback } from '../types';
import FeedbackToast from './FeedbackToast';

interface FeedbackContainerProps {
  feedbacks: Feedback[];
  onRemove: (id: string) => void;
}

const FeedbackContainer: React.FC<FeedbackContainerProps> = ({ feedbacks, onRemove }) => {
  return (
    <div className="fixed top-6 left-6 z-[200] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
      {feedbacks.map((f) => (
        <FeedbackToast key={f.id} feedback={f} onRemove={() => onRemove(f.id)} />
      ))}
    </div>
  );
};

export default FeedbackContainer;
