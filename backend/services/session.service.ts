import SessionRepository from "../repositories/session.repository";
import { Session, Status } from "../entities/session.entity";
import { instanceToPlain, plainToInstance } from "class-transformer";
import {
	CreateSessionDto,
	CreateSessionsDto,
	UpdateSessionDto,
	UpdateSessionsDto,
} from "../dto/session.dto";
import LoggerService from "./logger.service";
import HTTPException from "../exceptions/http.exception";
import { UserSessionRepository } from "../repositories/user-session.repository";
import {
	CreateUserSessionDto,
	DeleteUserSessionDto,
} from "../dto/user-session.dto";
import { UserSession } from "../entities/user-session.entity";
import UserRepository from "../repositories/user.repository";
import UserService from "./user.service";
import TrainingService from "./training.service";
import { error } from "console";

import { Role, TrainingUser } from "../entities/training-users.entity";
import { userService } from "../routes/user.route";
import { FASTAPI_URL } from "../utils/constants";

export class SessionService {
	private logger = LoggerService.getInstance("UserService()");
	constructor(
		private sessionRepository: SessionRepository,
		private trainingService: TrainingService,
		private userSessionRepository: UserSessionRepository
	) {}

	async createSession(sessionDto: CreateSessionDto): Promise<Session> {
		const session = plainToInstance(Session, instanceToPlain(sessionDto));
		const training = await this.trainingService.getTrainingById(
			sessionDto.programId
		);
		if (training) {
			session.training = training;
		} else {
			throw new HTTPException(400, "No such training");
		}
		const userSessions: UserSession[] = [];
		training.members.forEach(async (member: TrainingUser) => {
			if (member.role === Role.CANDIDATE) {
				const userSession = new UserSession();
				userSession.user = member.user;
				userSession.role = member.role;
				userSessions.push(userSession);
			}
		});
		session.userSessions = userSessions;
		const result = await this.sessionRepository.create(session);

		this.logger.info(`Session created with ID: ${result.id}`);

		return result;
	}
	async updateSessions(sessionsDto: UpdateSessionsDto): Promise<Session[]> {
		if (!sessionsDto.sessions.length) {
			throw new HTTPException(400, "No session data provided");
		}
		console.log("helloooo1");
		const programId = sessionsDto.sessions[0].programId;
		console.log("helllooo2");
		// Check that all sessions belong to the same training
		const allSameTraining = sessionsDto.sessions.every(
			(dto) => dto.programId === programId
		);
		if (!allSameTraining) {
			throw new HTTPException(
				400,
				"All sessions must belong to the same training (programId)"
			);
		}

		const training = await this.trainingService.getTrainingById(programId);

		if (!training) {
			throw new HTTPException(
				404,
				`Training with ID ${programId} not found`
			);
		}

		// Create session entities with the training assigned
		const sessionsToUpdate = sessionsDto.sessions.map((dto) => ({
			id: dto.id,
			title: dto.title ? dto.title : undefined,
			date: dto.date,
			slot: dto.slot,
			description: dto.description,
			preReq: dto.preReq,
			status: dto.status,
			duration: dto.duration,
			training: training,
		}));

		const savedSessions = await this.sessionRepository.updateSessions(
			sessionsToUpdate
		);

		savedSessions.forEach((s) =>
			this.logger.info(
				`Created session '${s.title}' under training ${training.id}`
			)
		);

		return savedSessions;
	}

	async createSessions(sessionsDto: CreateSessionsDto): Promise<Session[]> {
		if (!sessionsDto.sessions.length) {
			throw new HTTPException(400, "No session data provided");
		}
		const programId = sessionsDto.sessions[0].programId;

		// Check that all sessions belong to the same training
		const allSameTraining = sessionsDto.sessions.every(
			(dto) => dto.programId === programId
		);
		if (!allSameTraining) {
			throw new HTTPException(
				400,
				"All sessions must belong to the same training (programId)"
			);
		}

		const training = await this.trainingService.getTrainingById(programId);

		if (!training) {
			throw new HTTPException(
				404,
				`Training with ID ${programId} not found`
			);
		}

		// Create session entities with the training assigned
		const sessionsToCreate = sessionsDto.sessions.map((dto) => ({
			title: dto.title,
			description: dto.description,
			preReq: dto.preReq,
			status: dto.status,
			duration: dto.duration,
			training: training,
		}));

		const savedSessions = await this.sessionRepository.createSessions(
			sessionsToCreate
		);

		// const candidates = training.members.map((member: TrainingUser) => {
		// 	if (member.role === Role.CANDIDATE){
		// 		const userSession = new UserSession();
		// 	userSession.user = member.user;
		// 	userSession.session = ; // Assuming you want to add all users to
		// 	return use;
		// 	}

		// });

		savedSessions.forEach(async (s) => {
			this.logger.info(
				`Created session '${s.title}' under training ${training.id}`
			);
			// Add userSessions to each session 's'
			const userSessions: UserSession[] = [];
			training.members.forEach(async (member: TrainingUser) => {
				if (member.role === Role.CANDIDATE) {
					const userSession = new UserSession();
					userSession.user = member.user;
					userSession.session = s;
					userSessions.push(userSession);
				}
			});
			s.userSessions = userSessions;
			await this.sessionRepository.update(s.id, s);
		});

		return savedSessions;
	}

	async findAllSessions(): Promise<Session[]> {
		const sessions = await this.sessionRepository.findAll();

		return sessions;
	}
	async getUpcomingSessions(): Promise<Session[]> {
		const sessions = await this.sessionRepository.findUpcomingSessions();
		return sessions;
	}
	async getTodaySessions(): Promise<Session[]> {
		const sessions = await this.sessionRepository.findTodaySessions();
		return sessions;
	}

	async findRoleInSession(sessionId: number, userId: number): Promise<Role> {
		const role = await this.userSessionRepository.getUserRoleInSession(
			sessionId,
			userId
		);
		if (!role) {
			throw new HTTPException(404, "User not found in Session");
		}
		return role;
	}

	async findOneById(id: number): Promise<Session> {
		const session = await this.sessionRepository.findOneById(id);
		if (!session) {
			throw new HTTPException(404, "Session not found");
		}
		return session;
	}
	async deleteSession(id: number): Promise<void> {
		const session = await this.sessionRepository.findOneById(id);
		if (!session) {
			throw new HTTPException(404, "Session not found");
		}

		await this.sessionRepository.delete(id);
		this.logger.info(`User deleted with ID: ${id}`);
	}

	async updateSession(
		id: number,
		sessionDto: UpdateSessionDto
	): Promise<Session> {
		const existingSession = await this.sessionRepository.findOneById(id);

		if (!existingSession) {
			throw new HTTPException(404, "User not found");
		}

		const sessionData = plainToInstance(
			Session,
			instanceToPlain(sessionDto)
		);
		sessionData.training = await this.trainingService.getTrainingById(
			sessionDto.programId
		);
		const training = await this.trainingService.getTrainingById(
			sessionDto.programId
		);
		if (training) {
			sessionData.training = training;
		} else {
			throw new HTTPException(400, "No such training");
		}
		const result = await this.sessionRepository.update(id, sessionData);
		this.logger.info(`Session updated with ID: ${result.id}`);
		return result;
	}
	async addUsersToSession(
		session_id: number,
		userSessionDto: CreateUserSessionDto
	): Promise<UserSession[]> {
		const users = userSessionDto.users.map(({ id, role }) => {
			return {
				id: id,
				role: role as Role,
			};
		});
		const result = await this.userSessionRepository.addUsersToSession(
			session_id,
			users
		);

		this.logger.info(`User Session created: ${result}`);
		return result;
	}
	async removeUsersFromSession(
		sessionId: number,
		userSessionDto: DeleteUserSessionDto
	) {
		const session = await this.sessionRepository.findOneById(sessionId);
		const userIds = userSessionDto.userIds;
		if (!session) {
			throw new HTTPException(404, "Session not found");
		}
		await this.userSessionRepository.removeUsersFromSession(
			sessionId,
			userIds
		);
	}

	async getAllUserSessions(): Promise<UserSession[]> {
		const userSessions = await this.userSessionRepository.getAll();

		return userSessions;
	}

	async getSessionsByUserId(userId: number): Promise<Session[]> {
		const user = await userService.findOneById(userId);
		if (!user) {
			throw new HTTPException(404, "User not found");
		}
		const sessions = await this.sessionRepository.findByUserId(userId);
		return sessions;
	}

	async updateAiFeedbackForSession(sessionId: number, comments: string[]) {
		const response = await fetch(`${FASTAPI_URL}/session-feedback`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				comments: comments,
			}),
		});
		const sessionFeedback = await response.json();
		this.sessionRepository.update(sessionId, sessionFeedback);
	}

	async updateAiFeedbackAboutMaterials(
		sessionId: number,
		title: string,
		description: string,
		listOfMaterials: string[]
	) {
		const response = await fetch(`${FASTAPI_URL}/material-feedback`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: title,
				description: description,
				list_of_materials: listOfMaterials,
			}),
		});
		const sessionFeedback = await response.json();
		this.sessionRepository.update(sessionId, sessionFeedback);
	}
}
