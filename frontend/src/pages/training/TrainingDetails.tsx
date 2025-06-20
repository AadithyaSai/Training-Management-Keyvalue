import { useNavigate, useParams } from "react-router-dom";
import { DashboardCardType } from "../../components/dashboardCard/DashboardCard";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
    formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import TimelineProgressBar from "../../components/progressBar/timelineProgressBar/TimelineProgressBar";
import {
    useDeleteTrainingMutation,
    useGetTrainingByIdQuery,
} from "../../api-service/training/training.api";
import Button, { ButtonType } from "../../components/button/Button";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const TrainingDetails = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();

    const { data: trainingDetails, isLoading } = useGetTrainingByIdQuery({
        id: trainingId,
    });

    const token = localStorage.getItem("token");
    const decoded: { id: number, isAdmin: boolean } = jwtDecode(token || "");
    const { id: userId, isAdmin } = decoded;

    const [deleteTraining] = useDeleteTrainingMutation();

    useEffect(() => {
        console.log(trainingDetails);
    }, [trainingDetails]);

    return (
        <Layout
            title={trainingDetails?.title || "Training Title"}
            isLoading={isLoading || !trainingDetails}
            endAdornments={
                isAdmin && (
                    <div className="flex gap-3">
                        { isAdmin && <Button
                            variant={ButtonType.SECONDARY}
                            onClick={() => navigate("update")}
                        >
                            Update
                        </Button>}
                        { isAdmin && <Button
                            variant={ButtonType.SECONDARY}
                            onClick={() => {
                                deleteTraining({ id: trainingId });
                                navigate(`/adminDashboard/${userId}`);
                            }}
                        >
                            Delete
                        </Button>}
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
                        { label: "Total Sessions", value: `${trainingDetails?.sessions?.length || 1}` },
                        { label: "Todays Sessions", value: `${Math.max(1, (trainingDetails?.sessions?.length || 0) - 4)}` },
                        { label: "Upcoming Sessions", value: `${Math.max(1, (trainingDetails?.sessions?.length || 0) - 2)}` },
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
                    heading="Sessions"
                    showCreateButton={isAdmin}
                    onCreateClick={() => navigate("session/create")}
                    data={formatTrainingList(trainingDetails?.sessions)}
                />
            </div>
        </Layout>
    );
};

export default TrainingDetails;
