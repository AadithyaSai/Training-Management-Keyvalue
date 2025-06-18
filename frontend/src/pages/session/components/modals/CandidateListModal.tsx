import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";

interface CandidateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateListModal: React.FC<CandidateListModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  // Dummy candidate data
  const candidates = [
    "Candidate 1",
    "Candidate 2", 
    "Candidate 3",
    "Candidate 4",
    "Candidate 5"
  ];

  if (!isOpen) return null;

  const handleViewAssignment = (candidateName: string) => {
    console.log(`Viewing assignment for ${candidateName}`);
    // Implementation for viewing assignment
  };

  const handleGiveFeedback = (candidateName: string) => {
    setSelectedCandidate(candidateName);
    setFeedbackModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg w-full max-w-2xl mx-4 border border-gray-700">
          <div className="flex justify-between items-center border-b border-gray-600 p-4">
            <h2 className="text-xl font-semibold flex items-center">
              LIST OF CANDIDATES
              <span className="ml-2 text-gray-400">▼</span>
            </h2>
            <button onClick={onClose} className="text-xl font-bold hover:text-red-500">&times;</button>
          </div>
          
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {candidates.map((candidate, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-4">
                <span className="text-lg">{candidate}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewAssignment(candidate)}
                    className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
                  >
                    Assignment
                  </button>
                  <button
                    onClick={() => handleGiveFeedback(candidate)}
                    className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
                  >
                    Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedCandidate("");
        }}
        candidateName={selectedCandidate}
      />
    </>
  );
};