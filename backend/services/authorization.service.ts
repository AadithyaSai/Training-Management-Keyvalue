import dataSource from "../db/dataSource";
import { Role } from "../entities/user-session.entity";
import SessionRepository from "../repositories/session.repository";
import TrainingRepository from "../repositories/training.repository";
import { UserSessionRepository } from "../repositories/user-session.repository";
import UserRepository from "../repositories/user.repository";
import LoggerService from "./logger.service";
import { SessionService } from "./session.service";
import TrainingService from "./training.service";
import UserService from "./user.service";

export default class AuthorizationService {
  private logger = LoggerService.getInstance(AuthorizationService.name);

  private userService: UserService;
  private trainingService: TrainingService;
  private sessionService: SessionService;

  constructor() {
    const userRepo = new UserRepository(dataSource.getRepository("User"));
    this.userService = new UserService(userRepo);
    const trainingRepo = new TrainingRepository(
      dataSource.getRepository("Training")
    );
    this.trainingService = new TrainingService(trainingRepo);
    const sessionRepo = new SessionRepository(
      dataSource.getRepository("Session")
    );
    const userSessionRepo = new UserSessionRepository(
      dataSource.getRepository("UserSession")
    );
    this.sessionService = new SessionService(
      sessionRepo,
      this.trainingService,
      userSessionRepo
    );
  }

  async isAdmin(userId: number): Promise<boolean> {
    return (await this.userService.findOneById(userId)).isAdmin;
  }

  async isAdminOfTrainingProgram(
    userId: number,
    sessionId: number
  ): Promise<boolean> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    if (!user.isAdmin) {
      return false;
    }

    const trainingId = (await this.sessionService.findOneById(sessionId))
      .training.id;
    const training = await this.trainingService.getTrainingById(trainingId);
    if (!training) {
      throw new Error(`Training with ID ${trainingId} not found`);
    }

    const trainingMember = training.members.find(
      (member) => member.id === userId && member.role === "admin"
    );

    if (!trainingMember) {
      this.logger.warn(
        `User with ID ${userId} is not an admin of training program with ID ${trainingId}`
      );
      return false;
    }

    return true;
  }

  async isModerator(userId: number, sessionId: number): Promise<boolean> {
    const session = await this.sessionService.findOneById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return session.userSessions.some(
      (userSession) =>
        userSession.user.id === user.id &&
        userSession.role.toLowerCase() === Role.Moderator.toLowerCase()
    );
  }

  async isTrainer(userId: number, sessionId: number): Promise<boolean> {
    const session = await this.sessionService.findOneById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return session.userSessions.some(
      (userSession) =>
        userSession.user.id === user.id &&
        userSession.role.toLowerCase() === Role.Trainer.toLowerCase()
    );
  }

  async isCandidate(userId: number, sessionId: number): Promise<boolean> {
    const session = await this.sessionService.findOneById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return session.userSessions.some(
      (userSession) =>
        userSession.user.id === user.id &&
        userSession.role.toLowerCase() === Role.Candidate.toLowerCase()
    );
  }
}
