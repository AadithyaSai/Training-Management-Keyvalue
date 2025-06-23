import { type Repository } from "typeorm";
import { User } from "../entities/user.entity";

export default class UserRepository {
	constructor(private repository: Repository<User>) {}

	async findOneByUsername(username: string): Promise<User | null> {
		return this.repository.findOne({
			where: { username },
			select: ["id", "name", "username", "email", "isAdmin", "password"],
		});
	}

	async findOneById(id: number): Promise<User | null> {
		return this.repository.findOne({
			where: { id },
			relations: { userSessions: true, assignments: true },
		});
	}

	async createOrUpdateUser(user: User): Promise<User> {
		return this.repository.save(user);
	}

	async mergeUser(user1: User, user2: User): Promise<User> {
		return this.repository.merge(user1, user2);
	}

	async deleteUser(id: number): Promise<void> {
		await this.repository.softDelete(id);
	}

	async findAllUsers(): Promise<User[]> {
		return this.repository.find({
			select: ["id", "name", "username", "email", "isAdmin"],
		});
	}

	async findAllAdmins(): Promise<User[]> {
		return this.repository.find({
			where: { isAdmin: true },
			select: ["id", "name", "username", "email", "isAdmin"],
		});
	}

	async countUsers(): Promise<number> {
		return this.repository.count();
	}
}
