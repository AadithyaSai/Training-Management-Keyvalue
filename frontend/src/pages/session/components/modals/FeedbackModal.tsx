import { useState } from "react";
import { useCreateFeedbackMutation } from "../../../../api-service/feedback/feedback.api";
import { UserRoleType, type UserRole } from "../sessionTypes";
import { jwtDecode } from "jwt-decode";
import Button, { ButtonType } from "../../../../components/button/Button";
import type { CandidateData } from "./CandidateListModal";

interface FeedbackModalProps {
    sessionId: number;
    userRole: UserRole;
    trainerId?: number;
    isOpen: boolean;
    onClose: () => void;
    candidate?: CandidateData;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    sessionId,
    userRole,
    trainerId,
    isOpen,
    onClose,
    candidate,
}) => {
    const [rating, setRating] = useState(3);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState("");

    const [createFeedback] = useCreateFeedbackMutation();

    if (!isOpen) return null;

    const token = localStorage.getItem("token");
    const decoded: { id: number } = jwtDecode(token || "");
    const userId = decoded.id;

    const handleSubmit = () => {
        const isCandidate: boolean = userRole == UserRoleType.CANDIDATE;
        const feedbackData = {
            comments: feedback,
            rating: rating * 2, // Mapping 1-5 stars to a rating (0-10)
            fromId: Number(userId),
            toId: Number((isCandidate ? trainerId : candidate?.id) || 0),
            sessionId: sessionId,
            type:
                isCandidate
                    ? "aboutTrainer"
                    : "aboutCandidate",
        }
        createFeedback(feedbackData)
            .unwrap()
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.log(error));

        console.log("Feedback submitted:", feedbackData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
                    <h2 className="text-xl font-semibold">
                        FEEDBACK {candidate && `- ${candidate.name}`}
                    </h2>
                    <button onClick={onClose} className="text-xl font-bold">
                        &times;
                    </button>
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
                                <span
                                    className={`text-2xl ${
                                        star <= (hover || rating)
                                            ? "text-yellow-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button onClick={handleSubmit} variant={ButtonType.PRIMARY}>
                        Submit
                    </Button>
                    <Button onClick={onClose} variant={ButtonType.SECONDARY}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};
