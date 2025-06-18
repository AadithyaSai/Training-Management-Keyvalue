import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import dataSource from "../db/dataSource";
import SessionRepository from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import { UserSessionRepository } from "../repositories/user-session.repository";
import { trainingService } from "./training.route";
import validRoles from "../middlewares/authorization.middleware";
import { AuthRoles } from "../types/authorization.type";

const sessionRepository = new SessionRepository(
  dataSource.getRepository("Session")
);
const userSessionRepository = new UserSessionRepository(
  dataSource.getRepository("UserSession")
);
const sessionService = new SessionService(
  sessionRepository,
  trainingService,
  userSessionRepository
);
const sessionController = new SessionController(sessionService);

const sessionRouter = Router();

sessionRouter.get(
  "/upcoming",
  validRoles([AuthRoles.ADMIN]),
  sessionController.getUpcomingSessions.bind(sessionController)
);
sessionRouter.get(
  "/",
  validRoles([AuthRoles.ADMIN]),
  sessionController.getAllSessions.bind(sessionController)
);
sessionRouter.post(
  "/",
  validRoles([AuthRoles.ADMIN]),
  sessionController.createSession.bind(sessionController)
);
sessionRouter.get(
  "/today",
  validRoles([AuthRoles.ADMIN]),
  sessionController.getTodaySessions.bind(sessionController)
);
sessionRouter.get(
  "/:sessionId",
  validRoles([
    AuthRoles.ADMIN,
    AuthRoles.MODERATOR,
    AuthRoles.CANDIDATE,
    AuthRoles.TRAINER,
  ]),
  sessionController.getSessionById.bind(sessionController)
);
sessionRouter.patch(
  "/:sessionId",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  sessionController.updateSession.bind(sessionController)
);
sessionRouter.delete(
  "/:sessionId",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  sessionController.deleteSession.bind(sessionController)
);
sessionRouter.post(
  "/:sessionId/roles",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  sessionController.addUsersToSession.bind(sessionController)
);
sessionRouter.delete(
  "/:sessionId/roles",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  sessionController.removeUsersFromSession.bind(sessionController)
);
sessionRouter.get(
  "/:userId",
  validRoles([AuthRoles.OWN]),
  sessionController.getAllUserSessions.bind(sessionController)
);
export default sessionRouter;
export { sessionController, sessionService, sessionRepository };
