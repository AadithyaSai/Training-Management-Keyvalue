import { useNavigate, useParams } from "react-router-dom";
import { useGetTrainingByUserIdQuery, useGetTrainingListQuery } from "../../api-service/training/training.api";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, { formatTrainingList } from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import {  useGetUserDashboardDataQuery } from "../../api-service/user/user.api";

const CommonDashboard = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const { data: trainingDetailsList, isLoading, error } = useGetTrainingByUserIdQuery({ id: userId });

    if (isLoading) {
        return <Layout title="Your Dashboard"><p className="text-white p-5">Loading...</p></Layout>;
    }

    if (error) {
        return <Layout title="Your Dashboard"><p className="text-red-500 p-5">Failed to load training data.</p></Layout>;
    }

    const formattedTrainings = formatTrainingList(trainingDetailsList?.totalPrograms || []);

    return (
        <Layout title="Your Dashboard">
            <div className="flex flex-col items-center justify-center gap-10 p-5">
                <DashboardCardList
                    data={[
                        { label: "Text", value: "1" },
                        { label: "Text", value: "2" },
                        { label: "Text", value: "3" },
                        { label: "Text", value: "4" },
                        { label: "Text", value: "5" },
                    ]}
                />
                <EventList
                isAdmin={false}
                    heading="Trainings"
                    showCreateButton={false}
                    data={formattedTrainings}
                />
            </div>
        </Layout>
    );
};

export default CommonDashboard;
