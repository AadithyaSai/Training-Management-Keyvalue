import { useEffect, useState } from "react";
import { SessionContent } from "./components/SessionContent";
import { SessionActionButtons } from "./components/SessionActionButtons";

import {
    type SessionData,
    type UserRole,
    UserRoleType,
} from "./components/sessionTypes";
import Layout from "../../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import {
    useDeleteSessionMutation,
    useGetSessionByIdQuery,
} from "../../api-service/session/session.api";
import Button, { ButtonType } from "../../components/button/Button";
import { jwtDecode } from "jwt-decode";
import { useGetUserRoleInSessionQuery } from "../../api-service/user/user.api";
import { useGetFeedbacksBySessionIdQuery } from "../../api-service/feedback/feedback.api";

const SessionDetails = () => {
    const [sessionDetails, setSessionDetails] = useState<SessionData>({
        description: "",
        trainer: { id: 0, name: "" },
        moderators: [],
        materials: [],
    });

    const { trainingId, sessionId } = useParams();
    const navigate = useNavigate();
    const { data: sessionDetailsData } = useGetSessionByIdQuery({
        id: sessionId,
    });

    const [deleteSession, { isLoading }] = useDeleteSessionMutation();
    const { data: feedbackList } = useGetFeedbacksBySessionIdQuery({ sessionId });

    useEffect(() => {
        if (!sessionDetailsData) return;

        const userDetails = sessionDetailsData.userSessions.map(
            (userSession: {
                id: number;
                role: UserRole;
                user: { name: string };
            }) => ({
                id: userSession.id,
                role: userSession.role,
                name: userSession.user.name
            })
        );

        const trainer = userDetails.filter((user: { role: UserRole }) => (user.role === UserRoleType.TRAINER))[0];
        const moderators = userDetails.filter((user: { role: UserRole }) => (user.role === UserRoleType.MODERATOR));

        setSessionDetails({
            description: sessionDetailsData.description,
            materials: [...(sessionDetailsData.materials || [])],
            trainer,
            moderators: [...moderators]
        });
    }, [sessionDetailsData]);

    const token = localStorage.getItem("token");
    const decoded: { isAdmin: boolean; id: number } = jwtDecode(token || "");
    const { isAdmin, id: userId } = decoded;
    const { data: userRole } = useGetUserRoleInSessionQuery({
        userId,
        sessionId,
    });

    console.log(userRole)

    return (
        <Layout
            title={sessionDetailsData?.title || "Session Title"}
            isLoading={isLoading || !sessionDetailsData}
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
                        <SessionContent sessionData={sessionDetails} />

                        {/* Action Buttons */}
                        <div className="pt-4">
                            <SessionActionButtons
                                trainerId={sessionDetails.trainer?.id || 0}
                                sessionId={Number(sessionId)}
                                userRole={userRole}
                                uploadMaterials={
                                    userRole === UserRoleType.TRAINER
                                }
                                giveFeedback={true}
                                uploadAssignment={
                                    userRole === UserRoleType.CANDIDATE
                                }
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
