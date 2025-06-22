import { useNavigate, useParams } from "react-router-dom";
import { DashboardCardType } from "../../components/dashboardCard/DashboardCard";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
    EventListType,
    formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import TimelineProgressBar from "../../components/progressBar/timelineProgressBar/TimelineProgressBar";
import {
    useDeleteTrainingMutation,
    useGetTrainingByIdQuery,
} from "../../api-service/training/training.api";
import Button, { ButtonType } from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../store/slices/userSlice";
import {
    clearTrainingDetails,
    type TrainingDetails,
    type TrainingUserList,
} from "../../store/slices/trainingSlice";
import type { User } from "../../api-service/users/user.type";
import {
    UserRoleType,
    type UserRole,
} from "../session/components/sessionTypes";

export const getTrainingUsers = (trainingDetails: {
    members: Array<{ role: UserRole; user: User }>;
}) => {
    if (!trainingDetails) return;

    const members: TrainingUserList = {
        trainers: [],
        moderators: [],
        candidates: [],
    };

    trainingDetails.members.forEach(({ role, user }) => {
        switch (role) {
            case UserRoleType.TRAINER:
                members.trainers.push(user);
                break;
            case UserRoleType.MODERATOR:
                members.moderators.push(user);
                break;
            case UserRoleType.CANDIDATE:
                members.candidates.push(user);
                break;
            default:
                break;
        }
    });

    return members;
};

const UserNameList = ({
    title,
    users,
}: {
    title: string;
    users?: Array<User>;
}) => {
    return (
        <div className="w-full bg-cardColor border border-borderColor flex flex-col gap-4 text-white p-4 rounded-md">
            <h3 className="text-3xl font-bold px-2 py-3">{title}</h3>
            {users &&
                (users.length === 0 ? (
                    <p className="text-center text-gray-500 w-full border-2 border-borderColor py-10 rounded-sm">
                        No {title.toLowerCase()} found in this training
                    </p>
                ) : (
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {users.map((user, index) => (
                            <span
                                key={index}
                                className="bg-cardColor border border-borderColor px-5 py-3 rounded-sm text-center"
                            >
                                {user.name}
                            </span>
                        ))}
                    </div>
                ))}
        </div>
    );
};

const TrainingDetails = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { data: trainingDetails, isLoading } = useGetTrainingByIdQuery({
        id: trainingId,
    });
    const users = getTrainingUsers(trainingDetails);

    const { id: userId, isAdmin } = useSelector(getUserDetails);

    const [deleteTraining] = useDeleteTrainingMutation();
    dispatch(clearTrainingDetails());

    return (
        <Layout
            title={trainingDetails?.title || "Training Title"}
            isLoading={isLoading || !trainingDetails}
            endAdornments={
                isAdmin && (
                    <div className="flex gap-3">
                        {isAdmin && (
                            <Button
                                variant={ButtonType.SECONDARY}
                                onClick={() => navigate("update")}
                            >
                                Update
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                variant={ButtonType.SECONDARY}
                                onClick={() => {
                                    deleteTraining({ id: trainingId });
                                    navigate(`/adminDashboard/${userId}`);
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant={ButtonType.SECONDARY}
                            onClick={() => {
                                navigate(`/training/${trainingId}/calendar`);
                            }}
                        >
                            View Calendar
                        </Button>
                    </div>
                )
            }
        >
            <div className="flex flex-col items-center justify-center gap-10 p-5">
                <DashboardCardList
                    data={[
                        {
                            label: "Total Sessions",
                            value: `${trainingDetails?.sessions?.length || 1}`,
                        },
                        {
                            label: "Todays Sessions",
                            value: `${Math.max(
                                1,
                                (trainingDetails?.sessions?.length || 0) - 4
                            )}`,
                        },
                        {
                            label: "Upcoming Sessions",
                            value: `${Math.max(
                                1,
                                (trainingDetails?.sessions?.length || 0) - 2
                            )}`,
                        },
                        {
                            label: "Total Progress",
                            value: "60",
                            type: DashboardCardType.PROGRESS,
                        },
                        { label: "Total Attendees", value: "25" },
                    ]}
                />
                <TimelineProgressBar
                    startDate="2023-10-13"
                    todayDate="2023-10-15"
                    endDate="2023-10-31"
                />
                <EventList
                    isAdmin={isAdmin}
                    eventType={EventListType.SESSION}
                    showCreateButton={isAdmin}
                    onCreateClick={() => navigate("session/create")}
                    data={formatTrainingList(trainingDetails?.sessions)}
                />

                <UserNameList title="Trainers" users={users?.trainers} />
                <UserNameList title="Moderators" users={users?.moderators} />
                <UserNameList title="Candidates" users={users?.candidates} />
            </div>
        </Layout>
    );
};

export default TrainingDetails;
