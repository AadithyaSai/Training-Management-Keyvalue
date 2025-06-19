import { Repository } from "typeorm";
import AssignmentSubmission from "../entities/assignmentSubmission.entity";

export default class AssignmentSubmissionRepository {
	constructor(private repository: Repository<AssignmentSubmission>) {}

	async submitAssignment(
		submission: AssignmentSubmission
	): Promise<AssignmentSubmission> {
		return this.repository.save(submission);
	}

	async getSubmissionsByAssignmentId(
		assignmentId: number
	): Promise<AssignmentSubmission[]> {
		return this.repository.find({
			where: { assignment: { id: assignmentId } },
			relations: ["user", "assignment"],
		});
	}
}
