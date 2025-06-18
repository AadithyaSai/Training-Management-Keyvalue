import { Router } from "express";

import dataSource from "../db/dataSource";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { AssignmentService } from "../services/assignment.service";
import AssignmentController from "../controllers/assignment.controller";
import AssignmentSubmissionRepository from "../repositories/assignmentSubmission.repository";
import { userService } from "./user.route";
import { sessionService } from "./session.routes";
import validRoles from "../middlewares/authorization.middleware";
import { AuthRoles } from "../types/authorization.type";

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
const assignmentRouter = Router({ mergeParams: true });

assignmentRouter.post(
  "/session/:sessionId",
  validRoles([AuthRoles.TRAINING_ADMIN, AuthRoles.TRAINER]),
  assignmentController.createAssignment.bind(assignmentController)
);
assignmentRouter.get(
  "/:id",
  validRoles([
    AuthRoles.TRAINING_ADMIN,
    AuthRoles.TRAINER,
    AuthRoles.MODERATOR,
    AuthRoles.CANDIDATE,
  ]),
  assignmentController.getAssignmentById.bind(assignmentController)
);
assignmentRouter.get(
  "/",
  validRoles([AuthRoles.ADMIN]),
  assignmentController.getAllAssignments.bind(assignmentController)
);
assignmentRouter.patch(
  "/:id",
  validRoles([AuthRoles.ADMIN, AuthRoles.TRAINER]),
  assignmentController.updateAssignment.bind(assignmentController)
);
assignmentRouter.delete(
  "/:id",
  validRoles([AuthRoles.ADMIN, AuthRoles.TRAINER]),
  assignmentController.deleteAssignment.bind(assignmentController)
);
assignmentRouter.post(
  "/:id/submit",
  validRoles([AuthRoles.CANDIDATE]),
  assignmentController.submitAssignment.bind(assignmentController)
);
assignmentRouter.get(
  "/:id/submissions",
  validRoles([
    AuthRoles.TRAINING_ADMIN,
    AuthRoles.MODERATOR,
    AuthRoles.TRAINER,
    AuthRoles.CANDIDATE,
  ]),
  assignmentController.getAssignmentSubmissions.bind(assignmentController)
);

export default assignmentRouter;
export {
  assignmentController,
  assignmentService,
  assignmentRepository,
  assignmentSubmissionRepository,
};
