import { useState } from "react";
import { FeedbackModal } from "./FeedbackModal";
import {
	UserRoleType,
	type AssignmentData,
	type UserRole,
} from "../../pages/session/components/sessionTypes";
import { useGetSessionByIdQuery } from "../../api-service/session/session.api";
import { useGetAssignmentListQuery } from "../../api-service/assignment/viewAssignment.api";
export interface AssignmentSubmissionData {
	link: string;
}
export interface CandidateData {
	id: number;
	name: string;
	assignments?: Array<AssignmentSubmissionData>;
}

interface CandidateListModalProps {
	sessionId: number;
	userRole: UserRole;
	isOpen: boolean;
	onClose: () => void;
}

export const CandidateListModal: React.FC<CandidateListModalProps> = ({
	sessionId,
	userRole,
	isOpen,
	onClose,
}) => {
	const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
	const [selectedCandidate, setSelectedCandidate] = useState<CandidateData>();

	const { data: sessionDetails } = useGetSessionByIdQuery({ id: sessionId });
	const { data: assignmentSubmissions } =
		useGetAssignmentListQuery(sessionId);
	const userSessions = sessionDetails?.userSessions || [];
	const candidateUserSessions = userSessions.filter(
		(userSession: { role: UserRole }) =>
			userSession.role == UserRoleType.CANDIDATE
	);
	const candidates: Array<CandidateData> = candidateUserSessions.map(
		(candidateUserSession: { id: number; user: { name: string } }) => ({
			id: candidateUserSession.id,
			name: candidateUserSession.user.name || "",
		})
	);
	const [submittedAssignments, setSubmittedAssignments] = useState(false);
	// console.log(candidates[0].assignments);

	if (!isOpen) return <></>;

	const handleViewAssignment = (list) => {
		if (list) {
			setSubmittedAssignments(true);
		}
		// console.log(`Viewing assignment for ${candidate.name}`);
		// Implementation for viewing assignment
	};

	const handleGiveFeedback = (candidate: CandidateData) => {
		setSelectedCandidate(candidate);
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
						<button
							onClick={onClose}
							className="text-xl font-bold hover:text-red-500"
						>
							&times;
						</button>
					</div>

					<div className="p-4 space-y-4 max-h-96 overflow-y-auto">
						{assignmentSubmissions?.map((submission: any) => (
							<div
								key={submission.candidate.id}
								className="flex justify-between items-center border-b border-gray-600 pb-4"
							>
								<span className="text-lg">
									{submission.candidate.name}
								</span>
								<div className="flex space-x-3">
									<button
										onClick={() =>
											handleViewAssignment(
												submission.submissions
											)
										}
										className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
									>
										Assignment
									</button>

									<button
										onClick={() =>
											handleGiveFeedback(
												submission.candidate
											)
										}
										className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
									>
										Feedback
									</button>
								</div>
								<div>
									{submittedAssignments &&
										submission.submissions &&
										submission.submissions.length > 0 && (
											<div className="flex flex-col space-y-1 text-sm text-gray-300 bg-gray-800 p-2 rounded-md">
												{submission.submissions.map(
													(sub: any, idx: number) => (
														<div
															key={idx}
															className="mb-1"
														>
															<div>
																<span className="font-semibold">
																	Assignment:
																</span>{" "}
																{sub.assignment
																	?.title ||
																	"N/A"}
															</div>

															<div>
																<span className="font-semibold">
																	Completion
																	Link:
																</span>{" "}
																{sub.completionLink ? (
																	<a
																		href={
																			sub.completionLink
																		}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-400 underline"
																	>
																		{
																			sub.completionLink
																		}
																	</a>
																) : (
																	"N/A"
																)}
															</div>
														</div>
													)
												)}
											</div>
										)}
								</div>
							</div>
						))}
						{/* {assignmentSubmissions.map((candidate) => (
                            <div
                                // key={index}
                                className="flex justify-between items-center border-b border-gray-600 pb-4"
                            >
                                <span className="text-lg">
                                    {candidate.candidate.id}
                                </span>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() =>
                                            handleViewAssignment(candidate)
                                        }
                                        className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
                                    >
                                        Assignment
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleGiveFeedback(candidate)
                                        }
                                        className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700 transition"
                                    >
                                        Feedback
                                    </button>
                                </div>
                            </div>
                        ))} */}
					</div>
				</div>
			</div>

			<FeedbackModal
				sessionId={sessionId}
				userRole={userRole}
				isOpen={feedbackModalOpen}
				onClose={() => {
					setFeedbackModalOpen(false);
					setSelectedCandidate({ id: 0, name: "" });
				}}
				candidate={selectedCandidate}
			/>
		</>
	);
};
