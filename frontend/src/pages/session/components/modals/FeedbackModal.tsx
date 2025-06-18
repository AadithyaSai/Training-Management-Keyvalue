import { useState } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  candidateName 
}) => {
  const [rating, setRating] = useState(3);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Feedback submitted:", { rating, feedback, candidateName });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-700">
        <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
          <h2 className="text-xl font-semibold">
            FEEDBACK {candidateName && `- ${candidateName}`}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Your Feedback</label>
          <textarea
            className="w-full h-32 p-3 rounded-md bg-[#2A2A2A] text-white border border-gray-600 focus:outline-none resize-none"
            placeholder="Type your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Rating :</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <span className={`text-2xl ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-400'}`}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="border border-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};