
import { useGetUserDashboardDataQuery } from "../../api-service/user/user.api";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, { formatTrainingList } from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import { useParams } from "react-router-dom";

const CommonDashboard = () => {
    const { userId } = useParams();
    const { data: userDashboardData, isLoading } = useGetUserDashboardDataQuery(
        { id: userId }
    );
    const progress: number =
        Number(((userDashboardData?.upcomingPrograms.length /
            userDashboardData?.totalPrograms.length) *
        100).toFixed(0));
    return (
        <Layout title="Dashboard" isLoading={isLoading}>
            <div className="flex flex-col items-center justify-center gap-10 p-5">
                <DashboardCardList
                    data={[
                        {
                            label: "Total Programs",
                            value: userDashboardData?.totalPrograms.length,
                        },
                        {
                            label: "Todays Session",
                            value: userDashboardData?.todaysSessions.length,
                        },
                        {
                            label: "Completed Programs",
                            value: userDashboardData?.completedPrograms.length,
                        },
                        {
                            label: "Upcoming Sessions",
                            value: userDashboardData?.upcomingSessions.length,
                        },
                        {
                            label: "Program Stats",
                            value: progress,
                            type: "Progress",
                        },
                    ]}
                />
                <EventList
                    isAdmin={false}
                    heading="Trainings"
                    showCreateButton={false}
                    data={formatTrainingList(userDashboardData?.totalPrograms)}
                />
            </div>
        </Layout>
    );
};

export default CommonDashboard;
