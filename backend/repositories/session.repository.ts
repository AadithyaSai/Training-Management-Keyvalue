import { Between, In, Repository } from "typeorm";
import { Session, Status } from "../entities/session.entity";
import { User } from "../entities/user.entity";
import { Material } from "../entities/material.entity";
import { UserSession } from "../entities/user-session.entity";
import { Training } from "../entities/training.entity";

class SessionRepository {
	constructor(private repository: Repository<Session>) {}

	// Create a new session
	async create(session: Session): Promise<Session> {
		return this.repository.save(session);
	}
	//create session
	async createSessions(
		sessions: {
			title: string;
			description: string;
			preReq: string;
			status: Status;
			duration: number;
			training: Training;
		}[]
	): Promise<Session[]> {
		return this.repository.save(sessions);
	}
	async findSessionsWIthIds(sessionIds: number[]): Promise<Session[]> {
		return this.repository.find({
			where: {
				id: In(sessionIds),
			},
		});
	}
	async updateSessions(
		updatedSessions: Partial<Session>[]
	): Promise<Session[]> {
		const sessionIds = updatedSessions.map((s) => s.id);
		const existingSessions = await this.findSessionsWIthIds(sessionIds);

		const sessionsToUpdate = existingSessions.map((existing) => {
			const update = updatedSessions.find((u) => u.id === existing.id);
			this.repository.merge(existing, update);

			return existing;
		});

		return this.repository.save(sessionsToUpdate);
	}

	// Get all sessions
	async findAll(): Promise<Session[]> {
		return this.repository.find({
			relations: {
				training: true,
				userSessions: {
					user: true,
				},
				materials: true,
			},
		});
	}
	async findUpcomingSessions(): Promise<Session[]> {
		return this.repository.find({
			where: {
				status: "Scheduled" as Status,
			},
			relations: {
				training: true,
				userSessions: {
					user: true,
				},
				materials: true,
			},
		});
	}

	async findTodaySessions(): Promise<Session[]> {
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));
		console.log("helooooooooo", startOfDay);
		return this.repository.find({
			where: {
				date: today,
				status: "Scheduled" as Status,
			},
			relations: {
				training: true,
				userSessions: {
					user: true,
				},
				materials: true,
			},
		});
	}

	//   // Get sessions where a user is a participant
	//   async findByUserId(userId: number): Promise<Session[]> {
	//     return this.repository
	//       .createQueryBuilder("session")
	//       .leftJoinAndSelect("session.userSessions", "userSession")
	//       .leftJoinAndSelect("userSession.user", "user")
	//       .leftJoinAndSelect("session.materials", "materials")
	//       .where("user.id = :userId", { userId })
	//       .getMany();
	//   }

	// Get session by ID
	async findOneById(id: number): Promise<Session | null> {
		return this.repository.findOne({
			where: { id },
			relations: {
				training: true,
				userSessions: {
					user: true,
				},
				materials: true,
				assignments: true,
			},
		});
	}

	// Update a session
	async update(
		id: number,
		data: Partial<Omit<Session, "id">>
	): Promise<Session | undefined> {
		return this.repository.save({ id, ...data });
	}

	// Delete a session
	async delete(id: number): Promise<void> {
		await this.repository.delete(id);
	}

	async findByUserId(userId: number): Promise<Session[]> {
		return await this.repository.find({
			relations: {
				userSessions: { user: true },
			},
			where: {
				userSessions: {
					user: { id: userId },
				},
			},
		});
	}
}

export default SessionRepository;
