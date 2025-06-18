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

const TrainingDetails = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();

    const { data: trainingDetails } = useGetTrainingByIdQuery({
        id: trainingId,
    });
    const [deleteTraining] = useDeleteTrainingMutation();
    useEffect(()=>{console.log(trainingDetails)}, [trainingDetails])

    if (!trainingDetails) return <></>;


    return (
        <Layout
            title={trainingDetails.title}
            endAdornments={
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
                            deleteTraining({ id: trainingId });
                            navigate("/dashboard");
                        }}
                    >
                        Delete
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center justify-center gap-10 p-5">
                <DashboardCardList
                    data={[
                        { label: "Total Program", value: "1" },
                        { label: "Upcoming Sessions", value: "3" },
                        {
                            label: "Total Progress",
                            value: "60",
                            type: DashboardCardType.PROGRESS,
                        },
                        { label: "Text", value: "4" },
                        { label: "Text", value: "5" },
                    ]}
                />
                <TimelineProgressBar
                    startDate="2023-10-13"
                    todayDate="2023-10-15"
                    endDate="2023-10-31"
                />
                <EventList
                    heading="Sessions"
                    showCreateButton={true}
                    onCreateClick={() => navigate("session/create")}
                    data={formatTrainingList(trainingDetails.sessions)}
                />
            </div>
        </Layout>
    );
};

export default TrainingDetails;
