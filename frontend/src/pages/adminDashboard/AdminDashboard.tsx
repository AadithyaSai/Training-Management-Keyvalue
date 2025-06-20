import { useNavigate, useParams } from "react-router-dom";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
	formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import { useGetUserDashboardDataQuery } from "../../api-service/user/user.api";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const { userId } = useParams();
	const { data: userDashboardData, isLoading: isCardDataLoading } =
		useGetUserDashboardDataQuery({ id: userId });
	// const { data: trainingList, isLoading } = useGetTrainingListQuery({});
	const progress: number = Number(
		(
			(userDashboardData?.upcomingPrograms.length /
				userDashboardData?.totalPrograms.length) *
			100
		).toFixed(0)
	);
	return (
		<Layout
			title="Admin Dashboard"
			isLoading={
				isCardDataLoading || isCardDataLoading || !userDashboardData
			}
		>
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
					isAdmin={true}
					heading="Trainings"
					showCreateButton={true}
					onCreateClick={() => navigate("/training/create")}
					data={formatTrainingList(userDashboardData?.totalPrograms)}
				/>
			</div>
		</Layout>
	);
};

export default AdminDashboard;
