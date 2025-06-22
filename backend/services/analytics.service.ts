import { Status } from "../entities/session.entity";
import { Role } from "../entities/training-users.entity";
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
				(member) => member.role === Role.CANDIDATE
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

	async exportProgramList(userId: number): Promise<Buffer> {
		const programList = (await this.getUserAnalytics(userId)).totalPrograms;

		const csvHeader = "ID,Title,StartDate,EndDate,CreatedBy\n";

		const csvContent = programList
			.map((program) => {
				return `${program.title},${program.startDate},${program.endDate},${program.description},${program.sessions.length},${program.members.length}`;
			})
			.join("\n");

		return Buffer.from(csvHeader + csvContent, "utf-8");
	}

	async exportSingleProgram(programId: number): Promise<Buffer> {
		const program = await trainingService.getTrainingById(programId);
		if (!program) {
			throw new HTTPException(404, "Program not found");
		}
		const csvHeader =
			"SessionID,Title,Date,Status,Trainer,Moderators,Candidates\n";
		const csvContent = program.sessions
			.map((session) => {
				const userSessions = session.userSessions || [];
				const trainer =
					userSessions.find((us) => us.role === Role.TRAINER)?.user
						?.username || "";
				const moderators =
					userSessions
						.filter((us) => us.role === Role.MODERATOR)
						.map((us) => us.user?.username)
						.join(";") || "";
				const candidates =
					userSessions
						.filter((us) => us.role === Role.CANDIDATE)
						.map((us) => us.user?.username)
						.join(";") || "";
				return `${session.id},${session.title},${session.date},${session.status},${trainer},${moderators},${candidates}`;
			})
			.join("\n");
		return Buffer.from(csvHeader + csvContent, "utf-8");
	}

	async exportSessionList(): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}

	async exportSingleSession(sessionId: number): Promise<Buffer> {
		throw new Error("Method not implemented.");
	}
}
