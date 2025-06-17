import { useParams } from "react-router-dom";
import { DashboardCardType } from "../../components/dashboardCard/DashboardCard";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, { formatTrainingList } from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import TimelineProgressBar from "../../components/progressBar/timelineProgressBar/TimelineProgressBar";
import { useGetTrainingByIdQuery, useGetTrainingListQuery } from "../../api-service/training/training.api";

const dummyDashboardData = [
    {
        title: "Althaf",
        description: "A short one line description about the session",
        duration: "3 days",
        status: "Active",
        totalSessions: 7,
        progress: 30,
    },
    {
        title: "Bhagya",
        description: "A short one line description about the session",
        duration: "3 days",
        status: "Active",
        totalSessions: 7,
        progress: 90,
    },
    {
        title: "Nithish",
        description: "A short one line description about the session",
        duration: "3 days",
        status: "Scheduled",
        totalSessions: 7,
        progress: 90,
    },
];

const TrainingDetails = () => {
    const { trainingId } = useParams();
    
    const { data: trainingDetails } = useGetTrainingByIdQuery({ id: trainingId });
    
    if(!trainingDetails)
        return (<></>);

    return (
        <Layout title={trainingDetails.title}>
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
                    onCreateClick={() => console.log("Create program clicked")}
                    data={formatTrainingList(trainingDetails.sessions)}
                />
            </div>
        </Layout>
    );
};

export default TrainingDetails;
