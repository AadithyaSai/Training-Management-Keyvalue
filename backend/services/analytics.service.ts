import { Status } from "../entities/session.entity";
import { TrainingUserRole } from "../entities/training-users.entity";
import HTTPException from "../exceptions/http.exception";
import { sessionService } from "../routes/session.routes";
import { trainingService } from "../routes/training.route";
import { OverallAnalytics, UserAnalytics } from "../types/analytics.type";
import LoggerService from "./logger.service";
import UserService from "./user.service";

export default class AnalyticsService {
	private logger = LoggerService.getInstance(AnalyticsService.name);

	constructor(private userService: UserService) {}

	async getUserCount() {
		return await this.userService.countUsers();
	}

	async getOverallAnalytics(): Promise<OverallAnalytics> {
		throw new Error("Method not implemented.");
	}

	async getUserAnalytics(userId: number): Promise<UserAnalytics> {
		const user = await this.userService.findOneById(userId);
		if (!user) {
			throw new HTTPException(404, "User not found");
		}
		const today = new Date();
		const totalPrograms = await trainingService.getProgramsByUserId(userId);
		const totalSessions = await sessionService.getSessionsByUserId(userId);

		const completedPrograms = totalPrograms.filter((program) => {
			new Date(program.endDate) < today;
		});
		const activePrograms = totalPrograms.filter((program) => {
			return (
				new Date(program.startDate) <= today &&
				new Date(program.endDate) >= today
			);
		});
		const todaysSessions = totalSessions.filter((session) => {
			return (
				new Date(session.date) === today &&
				session.status === (Status.Scheduled || Status.InProgress)
			);
		});
		const upcomingPrograms = totalPrograms.filter((program) => {
			return new Date(program.startDate) >= today;
		});
		const upcomingSessions = totalSessions.filter((session) => {
			return (
				new Date(session.date) >= today &&
				session.status === (Status.Scheduled || Status.InProgress)
			);
		});
		return {
			...user,
			totalPrograms: totalPrograms,
			totalSessions: totalSessions,
			activePrograms: activePrograms,
			todaysSessions: todaysSessions,
			upcomingSessions: upcomingSessions,
			upcomingPrograms: upcomingPrograms,
			completedPrograms: completedPrograms,
		};
	}

	async getSingleProgramAnalytics(programId: number) {
		const program = await trainingService.getTrainingById(programId);
		const totalSessions = program.sessions;
		const today = new Date();
		const upcomingSessions = totalSessions.filter((session) => {
			return (
				new Date(session.date) >= today &&
				session.status === (Status.Scheduled || Status.InProgress)
			);
		});
		const progress =
			totalSessions.length -
			(upcomingSessions.length / totalSessions.length) * 100;
		return {
			program,
			totalSessionCount: totalSessions.length,
			upcomingSessionsCount: upcomingSessions.length,
			totalAttendees: program.members.filter(
				(member) => member.role === TrainingUserRole.CANDIDATE
			).length,
			progress: progress,
		};
	}

	async exportUserList(): Promise<Buffer> {
		const userList = await this.userService.findAllUsers();

		const csvHeader = "ID,Username,Email,IsAdmin\n";

		const csvContent = userList
			.map((user) => {
				return `${user.id},${user.username},${user.email},${user.isAdmin}`;
			})
			.join("\n");

		return Buffer.from(csvHeader + csvContent, "utf-8");
	}

	async exportProgramList(): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}

	async exportSingleProgram(programId: number): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}

	async exportSessionList(): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}

	async exportSingleSession(sessionId: number): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}
}
