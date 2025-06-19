
import { useGetUserDashboardDataQuery } from "../../api-service/user/user.api";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, { formatTrainingList } from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import { useParams } from "react-router-dom";

const CommonDashboard = () => {
    const { userId } = useParams();
    const { data: userDashboardData, isLoading } = useGetUserDashboardDataQuery({ id: userId  });
    
    return (
        <Layout title="Dashboard" isLoading={isLoading}>
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
                    showCreateButton={false}
                    data={formatTrainingList(userDashboardData?.totalPrograms)}
                />
            </div>
        </Layout>
    );
};

export default CommonDashboard;
