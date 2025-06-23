import { Repository } from "typeorm";
import { Assignment } from "../entities/assignment.entity";
import { Session } from "../entities/session.entity";

export class AssignmentRepository {
	constructor(private repository: Repository<Assignment>) {}

	async create(assignment: Assignment): Promise<Assignment> {
		return this.repository.save(assignment);
	}

	async getById(id: number): Promise<Assignment | null> {
		return this.repository.findOne({ where: { id },relations:{session:true} });
	}

	async getAll(): Promise<Assignment[]> {
		return this.repository.find();
	}

	async update(
		id: number,
		data: Partial<Assignment>
	): Promise<Assignment | null> {
		return this.repository.save({ id, ...data });
	}

	async delete(id: number): Promise<void> {
		await this.repository.delete({ id });
	}

	async getBySessionId(session: Session): Promise<Assignment[]> {
		return this.repository.find({ where: { session } });
	}

	async getCountBySessionId(session: Session): Promise<number> {
		return this.repository.count({ where: { session } });
	}
}
