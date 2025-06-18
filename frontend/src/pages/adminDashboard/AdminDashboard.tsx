import { useNavigate, useParams } from "react-router-dom";
import { useGetTrainingListQuery } from "../../api-service/training/training.api";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
	formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import { useGetUserDashboardDataQuery } from "../../api-service/user/user.api";
import { use } from "react";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const { userId } = useParams();
	const { data: userDashboardData, isLoading } = useGetUserDashboardDataQuery(
		{ id: userId }
	);
	const progress: number =
		(userDashboardData?.upcomingPrograms.length /
			userDashboardData?.totalPrograms.length) *
		100;

	return (
		<Layout title="Admin Dashboard" isLoading={isLoading}>
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
