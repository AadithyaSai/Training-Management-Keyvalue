import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	useDeleteSessionMutation,
	useGetSessionByIdQuery,
} from "../../api-service/session/session.api";
import { useGetUserRoleInSessionQuery } from "../../api-service/user/user.api";
import {
	useGetFeedbackListQuery,
	useGetFeedbacksBySessionIdQuery,
} from "../../api-service/feedback/feedback.api";
import Layout from "../../components/layout/Layout";
import { SessionContent } from "./components/SessionContent";
import { SessionActionButtons } from "./components/SessionActionButtons";
import {
	type SessionData,
	type UserRole,
	UserRoleType,
} from "./components/sessionTypes";
import Button, { ButtonType } from "../../components/button/Button";
import { useSelector } from "react-redux";
import {
	getUserDetails,
	type UserStateData,
} from "../../store/slices/userSlice";

const SessionDetails = () => {
	const [sessionDetails, setSessionDetails] = useState<SessionData>({
		trainer: { id: 0, name: "" },
		moderators: [],
		description: "",
		materials: [],
		materialQualityFeedback: "",
		sessionFeedback: "",
		assignments: [],
	});

	const navigate = useNavigate();
	const { trainingId, sessionId } = useParams();
	const { data: sessionDetailsData } = useGetSessionByIdQuery({
		id: sessionId,
	});
	const { data: feedbackList } = useGetFeedbacksBySessionIdQuery({
		sessionId,
	});
	const [deleteSession, { isLoading }] = useDeleteSessionMutation();

	useEffect(() => {
		if (!sessionDetailsData) return;

		const sessionUserDetails = sessionDetailsData.userSessions.map(
			(userSession: {
				id: number;
				role: UserRole;
				user: { name: string };
			}) => ({
				id: userSession.id,
				role: userSession.role,
				name: userSession.user.name,
			})
		);
		const trainer = sessionUserDetails.filter(
			(user: { role: UserRole }) => user.role === UserRoleType.TRAINER
		)[0];
		const moderators = sessionUserDetails.filter(
			(user: { role: UserRole }) => user.role === UserRoleType.MODERATOR
		);

		setSessionDetails({
			trainer,
			moderators: [...moderators],
			description: sessionDetailsData.description,
			materials: [
				...(sessionDetails.materials || []),
				...(sessionDetailsData.materials || []),
			],
			materialQualityFeedback: sessionDetailsData.materialQualityFeedback,
			sessionFeedback: sessionDetailsData.sessionFeedback,
			assignments: sessionDetailsData.assignments,
		});
	}, [sessionDetailsData]);

	const userDetails: UserStateData = useSelector(getUserDetails);
	const { isAdmin, id: userId } = userDetails;
	const { data: userRole } = useGetUserRoleInSessionQuery({
		userId,
		sessionId,
	});

	return (
		<Layout
			userRole={userRole}
			title={sessionDetailsData?.title || "Session Title"}
			isLoading={isLoading || !sessionDetails}
			endAdornments={
				isAdmin && (
					<div className="flex gap-3">
						<Button
							variant={ButtonType.SECONDARY}
							onClick={() => navigate("update")}
						>
							Update
						</Button>
						<Button
							variant={ButtonType.SECONDARY}
							onClick={() => {
								deleteSession({ id: sessionId });
								navigate(`/training/${trainingId}`);
							}}
						>
							Delete
						</Button>
					</div>
				)
			}
		>
			<div className="min-h-screen w-full relative text-white">
				<div className="flex flex-col gap-5">
					<div className="border border-borderColor bg-cardColor w-full rounded-lg p-6 space-y-6">
						<SessionContent
							isAdmin={isAdmin}
							sessionData={sessionDetails}
						/>

						{/* Action Buttons */}
						<div className="pt-4">
							<SessionActionButtons
								isAdmin={isAdmin}
								sessionDetails={sessionDetails}
								sessionId={Number(sessionId)}
								userRole={userRole}
							/>
						</div>
					</div>

					{isAdmin && feedbackList && feedbackList.length > 0 && (
						<div className="border border-borderColor bg-cardColor w-full rounded-lg p-6 space-y-6">
							{feedbackList?.map(
								(
									feedback: { comments: string },
									index: number
								) => (
									<div
										key={index}
										className="border-b border-gray-600 pb-4"
									>
										<h3 className="text-gray-400 text-sm mb-2">
											Feedback {index + 1}
										</h3>
										<h2 className="text-xl font-medium">
											{feedback.comments}
										</h2>
									</div>
								)
							)}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default SessionDetails;
