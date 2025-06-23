import { useNavigate, useParams } from "react-router-dom";
import DashboardCardList from "../../components/dashboardCardList/DashboardCardList";
import EventList, {
	EventListType,
	formatTrainingList,
} from "../../components/eventList/EventList";
import Layout from "../../components/layout/Layout";
import { useGetUserDashboardDataQuery } from "../../api-service/user/user.api";
import { useGetTrainingListQuery } from "../../api-service/training/training.api";
import { useSelector } from "react-redux";
import {
	getUserDetails,
	type UserStateData,
} from "../../store/slices/userSlice";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
	const [userAuthenticated, setUserAuthenticated] = useState(false);
	const { userId } = useParams();
	const navigate = useNavigate();
	const userDetails: UserStateData = useSelector(getUserDetails);

	useEffect(() => {
		if (!userId || !userDetails) return;
		if (String(userDetails.id) === userId) setUserAuthenticated(true);
		else navigate("/login");
	}, [userId, userDetails]);

	const { data: trainingList, isLoading } = useGetTrainingListQuery({});
	const { data: userDashboardData, isLoading: isCardDataLoading } =
		useGetUserDashboardDataQuery({ id: userId });
	const progress: number = Number(
		(
			((userDashboardData?.totalPrograms.length -
				userDashboardData?.upcomingPrograms.length) /
				userDashboardData?.totalPrograms.length) *
			100
		).toFixed(0)
	);

	return (
		<Layout
			title="Admin Dashboard"
			isLoading={!userAuthenticated || isCardDataLoading || isLoading}
		>
			<div className="flex flex-col items-center justify-center gap-10 p-5">
				<DashboardCardList
					data={[
						{
							label: "Total Programs",
							value: trainingList?.length,
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
					eventType={EventListType.TRAINING}
					showCreateButton={true}
					onCreateClick={() => navigate("/training/create")}
					data={formatTrainingList(trainingList)}
				/>
			</div>
		</Layout>
	);
};

export default AdminDashboard;
