import { AssignmentRepository } from "../repositories/assignment.repository";
import { Assignment } from "../entities/assignment.entity";
import {
	AssignmentSubmissionDto,
	CreateAssignmentDto,
	UpdateAssignmentDto,
} from "../dto/assignment.dto";
import HTTPException from "../exceptions/http.exception";
import AssignmentSubmissionRepository from "../repositories/assignmentSubmission.repository";
import UserService from "./user.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import AssignmentSubmission from "../entities/assignmentSubmission.entity";
import { SessionService } from "./session.service";

export class AssignmentService {
	constructor(
		private assignmentRepository: AssignmentRepository,
		private assignmentSubmissionRepository: AssignmentSubmissionRepository,
		private userService: UserService,
		private sessionService: SessionService
	) {}

	async createAssignment(
		sessionId: number,
		assignmentDto: CreateAssignmentDto
	): Promise<Assignment> {
		const session = await this.sessionService.findOneById(sessionId);

		if (!session) {
			throw new HTTPException(
				400,
				`Session with id ${sessionId} not found`
			);
		}

		const assignment = plainToInstance(
			Assignment,
			instanceToPlain(assignmentDto)
		);

		assignment.session = session;
		return await this.assignmentRepository.create(assignment);
	}

	async getAssignmentById(id: number): Promise<Assignment | null> {
		return this.assignmentRepository.getById(id);
	}

	async getAllAssignments(): Promise<Assignment[]> {
		return this.assignmentRepository.getAll();
	}

	async updateAssignment(
		id: number,
		data: UpdateAssignmentDto
	): Promise<Assignment> {
		const existingAssignment = await this.assignmentRepository.getById(id);
		if (!existingAssignment) {
			throw new Error(`Assignment with id ${id} not found`);
		}
		const updatedData = plainToInstance(Assignment, instanceToPlain(data));
		updatedData.id = id; // Ensure the ID is set for the update
		if (data.sessionId) {
			const session = await this.sessionService.findOneById(
				data.sessionId
			);
			if (!session) {
				throw new HTTPException(
					400,
					`Session with id ${data.sessionId} not found`
				);
			}
			updatedData.session = session;
		} else {
			updatedData.session = existingAssignment.session; // Keep the existing session if not updated
		}

		return this.assignmentRepository.update(id, updatedData);
	}

	async deleteAssignment(id: number): Promise<Assignment> {
		const assignment = await this.assignmentRepository.getById(id);
		if (assignment) {
			await this.assignmentRepository.delete(id);
			return assignment;
		}
		return null;
	}

	async submitAssignment(
		userId: number,
		assignmentId: number,
		assignmentSubmissionDto: AssignmentSubmissionDto
	): Promise<AssignmentSubmission> {
		const assignment = await this.assignmentRepository.getById(
			assignmentId
		);
		if (!assignment) {
			throw new HTTPException(
				400,
				`Assignment with id ${assignmentId} not found`
			);
		}

		const user = await this.userService.findOneById(userId);
		if (!user) {
			throw new HTTPException(400, `User with id ${userId} not found`);
		}
		assignmentSubmissionDto.completedOn = new Date();
		const submission = plainToInstance(
			AssignmentSubmission,
			instanceToPlain(assignmentSubmissionDto)
		);
		submission.user = user;
		submission.assignment = assignment;

		return await this.assignmentSubmissionRepository.submitAssignment(
			submission
		);
	}

	async getSubmissionsByAssignmentId(
		assignmentId: number
	): Promise<AssignmentSubmission[]> {
		return this.assignmentSubmissionRepository.getSubmissionsByAssignmentId(
			assignmentId
		);
	}
	async getAllCandidatesSubmissionsForSession(sessionId: number): Promise<{ candidate: any; submissions: AssignmentSubmission[] }[]> {
		// Get the session and its assignments
		const session = await this.sessionService.findOneById(sessionId);
		if (!session) {
			throw new HTTPException(404, "Session not found");
		}
		const assignments = session.assignments;
		if (!assignments || assignments.length === 0) {
			return [];
		}

		// Get all candidates from session.userSessions with role 'candidate'
		const candidates = (session.userSessions || [])
			.filter(us => us.user && us.role === "candidate")
			.map(us => us.user);

		if (!candidates || candidates.length === 0) {
			return [];
		}

		// For each assignment, get its submissions and group by candidate
		const result: { candidate: any; submissions: AssignmentSubmission[] }[] = [];
		for (const candidate of candidates) {
			const submissions: AssignmentSubmission[] = [];
			for (const assignment of assignments) {
				const subs = await this.assignmentSubmissionRepository.getSubmissionsByAssignmentId(assignment.id);
				const candidateSubs = subs.filter(sub => sub.user && sub.user.id === candidate.id);
				submissions.push(...candidateSubs);
			}
			result.push({ candidate, submissions });
		}
		return result;
	}
}
