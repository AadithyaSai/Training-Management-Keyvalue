import { Router } from "express";

import dataSource from "../db/dataSource";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { AssignmentService } from "../services/assignment.service";
import AssignmentController from "../controllers/assignment.controller";
import AssignmentSubmissionRepository from "../repositories/assignmentSubmission.repository";
import { userService } from "./user.route";
import { sessionService } from "./session.routes";

const assignmentRepository = new AssignmentRepository(
  dataSource.getRepository("Assignment")
);
const assignmentSubmissionRepository = new AssignmentSubmissionRepository(
  dataSource.getRepository("AssignmentSubmission")
);

const assignmentService = new AssignmentService(
  assignmentRepository,
  assignmentSubmissionRepository,
  userService,
  sessionService
);
const assignmentController = new AssignmentController(assignmentService);
const assignmentRouter = Router();

assignmentRouter.post(
  "/session/:sessionId",
  assignmentController.createAssignment.bind(assignmentController)
);
assignmentRouter.get(
  "/:id",
  assignmentController.getAssignmentById.bind(assignmentController)
);
assignmentRouter.get(
  "/",
  assignmentController.getAllAssignments.bind(assignmentController)
);
assignmentRouter.patch(
  "/:id",
  assignmentController.updateAssignment.bind(assignmentController)
);
assignmentRouter.delete(
  "/:id",
  assignmentController.deleteAssignment.bind(assignmentController)
);
assignmentRouter.post(
  "/:id/submit",
  assignmentController.submitAssignment.bind(assignmentController)
);
assignmentRouter.get(
  "/:id/submissions",
  assignmentController.getAssignmentSubmissions.bind(assignmentController)
);

export default assignmentRouter;
export {
  assignmentController,
  assignmentService,
  assignmentRepository,
  assignmentSubmissionRepository,
};
