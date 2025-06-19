import { useNavigate } from "react-router-dom";
import { useGetTrainingListQuery } from "../../api-service/training/training.api";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
    formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data: trainingDetailsList, isLoading } = useGetTrainingListQuery({});
    return (
        <Layout title="Admin Dashboard" isLoading={isLoading}>
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
                    heading="Trainings"
                    showCreateButton={true}
                    onCreateClick={() => navigate("/training/create")}
                    data={formatTrainingList(trainingDetailsList)}
                />
            </div>
        </Layout>
    );
};

export default AdminDashboard;
