import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import dataSource from "../db/dataSource";
import SessionRepository from "../repositories/session.repository";
import { SessionService } from "../services/session.service";
import { UserSessionRepository } from "../repositories/user-session.repository";
import { userService } from "./user.route";
import { trainingService } from "./training.route";


const sessionRepository = new SessionRepository(dataSource.getRepository("Session"));
const userSessionRepository=new UserSessionRepository(dataSource.getRepository("UserSession"))
const sessionService= new SessionService(sessionRepository,trainingService,userSessionRepository);
const sessionController=new SessionController(sessionService);

const sessionRouter=Router();

sessionRouter.get("/upcoming", sessionController.getUpcomingSessions.bind(sessionController));
sessionRouter.get("/", sessionController.getAllSessions.bind(sessionController));
sessionRouter.post("/", sessionController.createSession.bind(sessionController));
sessionRouter.get("/today", sessionController.getTodaySessions.bind(sessionController));
sessionRouter.get("/:id", sessionController.getSessionById.bind(sessionController));
sessionRouter.patch("/:id", sessionController.updateSession.bind(sessionController));
sessionRouter.delete("/:id", sessionController.deleteSession.bind(sessionController));
sessionRouter.post( "/:id/roles",sessionController.addUsersToSession.bind(sessionController));
sessionRouter.delete( "/:id/roles",sessionController.removeUsersFromSession.bind(sessionController));
sessionRouter.get("/:id", sessionController.getAllUserSessions.bind(sessionController));
export default sessionRouter;
export { sessionController, sessionService, sessionRepository};