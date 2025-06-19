import { Request, Response, NextFunction } from "express";

import { AssignmentService } from "../services/assignment.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import {
	AssignmentSubmissionDto,
	CreateAssignmentDto,
	UpdateAssignmentDto,
} from "../dto/assignment.dto";
import { uploadFile } from "../utils/cloud";

export default class AssignmentController {
	constructor(private assignmentService: AssignmentService) {}

	async createAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const sessionId = parseInt(req.params.sessionId, 10);
			const assignmentData = plainToInstance(
				CreateAssignmentDto,
				req.body
			);

			const errors = await validate(assignmentData);
			if (errors.length > 0) {
				return res.status(400).json({
					message: "Validation failed",
					errors: errors.map((error) => error.constraints),
				});
			}

			const assignment = await this.assignmentService.createAssignment(
				sessionId,
				assignmentData
			);

			res.status(201).json(assignment);
		} catch (error) {
			next(error);
		}
	}

	async getAssignmentById(req: Request, res: Response, next: NextFunction) {
		try {
			const assignmentId = parseInt(req.params.id, 10);
			const assignment = await this.assignmentService.getAssignmentById(
				assignmentId
			);

			if (!assignment) {
				return res
					.status(404)
					.json({ message: "Assignment not found" });
			}

			res.status(200).json(assignment);
		} catch (error) {
			next(error);
		}
	}

	async getAllAssignments(req: Request, res: Response, next: NextFunction) {
		try {
			const assignments =
				await this.assignmentService.getAllAssignments();
			res.status(200).json(assignments);
		} catch (error) {
			next(error);
		}
	}

	async updateAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const assignmentId = parseInt(req.params.id, 10);
			const updateData = plainToInstance(UpdateAssignmentDto, req.body);
			const errors = await validate(updateData);
			if (errors.length > 0) {
				return res.status(400).json({
					message: "Validation failed",
					errors: errors.map((error) => error.constraints),
				});
			}

			const updatedAssignment =
				await this.assignmentService.updateAssignment(
					assignmentId,
					updateData
				);

			res.status(200).json(updatedAssignment);
		} catch (error) {
			next(error);
		}
	}

	async deleteAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const assignmentId = parseInt(req.params.id, 10);
			const deletedAssignment =
				await this.assignmentService.deleteAssignment(assignmentId);

			res.status(200).json(deletedAssignment);
		} catch (error) {
			next(error);
		}
	}
	async submitAssignment(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id; // Assuming user ID is stored in req.user
			const assignmentId = parseInt(req.params.id, 10);
			const submissionData = plainToInstance(
				AssignmentSubmissionDto,
				req.body
			);
			if (req.file) {
				submissionData.file = await uploadFile(req.file, "assignments");
				submissionData.completionLink = submissionData.file; // Assuming completionLink is the same as file
			}
			const errors = await validate(submissionData);
			if (errors.length > 0) {
				return res.status(400).json({
					message: "Validation failed",
					errors: errors.map((error) => error.constraints),
				});
			}

			const submission = await this.assignmentService.submitAssignment(
				userId,
				assignmentId,
				submissionData
			);
			console.log("Submission created:", submission);
			res.status(201).json(submission);
		} catch (error) {
			next(error);
		}
	}

	async getAssignmentSubmissions(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const assignmentId = parseInt(req.params.id, 10);
			const submissions =
				await this.assignmentService.getSubmissionsByAssignmentId(
					assignmentId
				);

			res.status(200).json(submissions);
		} catch (error) {
			next(error);
		}
	}
}
