import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useAddMembersToSessionMutation,
    useDeleteSessionMutation,
    useGetSessionByIdQuery,
} from "../../api-service/session/session.api";
import { useGetUserRoleInSessionQuery } from "../../api-service/user/user.api";
import { useGetFeedbacksBySessionIdQuery } from "../../api-service/feedback/feedback.api";
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
import { useGetTrainingByIdQuery } from "../../api-service/training/training.api";

interface TrainingUserPoolDetails {
    isTrainer: boolean;
    isModerator: boolean;
    isUserInTrainerPool: boolean;
    isUserInModeratorPool: boolean;
}

const SessionDetails = () => {
    const [sessionDetails, setSessionDetails] = useState<SessionData>({
        trainer: { id: 0, name: "" },
        moderators: [],
        description: "",
        materials: [],
        materialQualityFeedback: "",
        sessionFeedback: "",
    });

    const [trainingUserDetails, setTrainingUserDetails] =
        useState<TrainingUserPoolDetails>({
            isTrainer: false,
            isModerator: false,
            isUserInTrainerPool: false,
            isUserInModeratorPool: false,
        });

    const navigate = useNavigate();
    const { trainingId, sessionId } = useParams();
    const userDetails: UserStateData = useSelector(getUserDetails);
    const { isAdmin, id: userId } = userDetails;

    const { data: sessionDetailsData } = useGetSessionByIdQuery({
        id: sessionId,
    });
    const { data: trainingDetailsData } = useGetTrainingByIdQuery({
        id: trainingId,
    });
    const { data: feedbackList } = useGetFeedbacksBySessionIdQuery({
        sessionId,
    });
    const [addUsers] = useAddMembersToSessionMutation();
    const [deleteSession, { isLoading }] = useDeleteSessionMutation();
    const { data: userRole } = useGetUserRoleInSessionQuery({
        sessionId,
        userId,
    });

    const handleEnrollSelf = (role: UserRole) => {
        addUsers({ id: sessionId, members: [{ id: userId, role }] })
            .unwrap()
            .then(() => console.log("Completed"))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        if (!sessionDetailsData) return;
        const sessionUserDetails = sessionDetailsData.userSessions.map(
            (userSession: {
                role: UserRole;
                user: { id: number, name: string };
            }) => ({
                id: userSession.user.id,
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

        {
            /* Collecting the data of trainer and moderators of the this session from database to the state */
        }
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
        });
    }, [sessionDetailsData]);

    {
        /* Collecting the pool of whether this user is in trainers or moderators pool  of this training 
        from database to the state */
    }
    useEffect(() => {
        if (!trainingDetailsData || !sessionDetails) return;

        const isTrainer: boolean =
            sessionDetails?.trainer?.id === Number(userId);

        const isModerator: boolean = Boolean(
            sessionDetails.moderators?.find(
                (moderator) => Number(moderator.id) === Number(userId)
            )
        );

        console.log(sessionDetails?.trainer);

        const isUserInTrainerPool: boolean =
            trainingDetailsData.members.filter(
                (member: { role: UserRole; user: { id: number } }) =>
                    member.user.id === userId &&
                    member.role === UserRoleType.TRAINER
            ).length > 0;

        const isUserInModeratorPool: boolean =
            trainingDetailsData.members.filter(
                (member: { role: UserRole; user: { id: number } }) =>
                    member.user.id === userId &&
                    member.role === UserRoleType.MODERATOR
            ).length > 0;

        setTrainingUserDetails({
            isTrainer,
            isModerator,
            isUserInTrainerPool,
            isUserInModeratorPool,
        });
    }, [trainingDetailsData, sessionDetails]);

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
                            isTrainerAssignable={
                                !sessionDetails.trainer &&
                                trainingUserDetails.isUserInTrainerPool &&
                                !trainingUserDetails.isModerator
                            }
                            isModeratorAssignable={
                                !trainingUserDetails.isModerator &&
                                trainingUserDetails.isUserInModeratorPool &&
                                !trainingUserDetails.isTrainer
                            }
                            handleEnrollSelf={handleEnrollSelf}
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
