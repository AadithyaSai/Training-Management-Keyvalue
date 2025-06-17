import SessionRepository from "../repositories/session.repository";
import { Session } from "../entities/session.entity";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { CreateSessionDto, UpdateSessionDto } from "../dto/session.dto";
import LoggerService from "./logger.service";
import HTTPException from "../exceptions/http.exception";
import { UserSessionRepository } from "../repositories/user-session.repository";
import { CreateUserSessionDto, DeleteUserSessionDto } from "../dto/user-session.dto";
import { Role, UserSession } from "../entities/user-session.entity";
import UserRepository from "../repositories/user.repository";
import UserService from "./user.service";
import TrainingService from "./training.service";
import { error } from "console";

export class SessionService {
  private logger = LoggerService.getInstance("UserService()");
  constructor(
    private sessionRepository: SessionRepository,
    private trainingService: TrainingService,
    private userSessionRepository: UserSessionRepository
  ) {}

  async createSession(sessionDto: CreateSessionDto): Promise<Session> {
    const session = plainToInstance(Session, instanceToPlain(sessionDto));
    const training = await this.trainingService.getTrainingById(
      sessionDto.program_id
    );
    if (training) {
      session.training = training;
    } else {
      throw new HTTPException(400, "No such training");
    }
    const result = await this.sessionRepository.create(session);
    this.logger.info(`Session created with ID: ${result.id}`);

    return result;
  }

  async findAllSessions(): Promise<Session[]> {
    const sessions = await this.sessionRepository.findAll();

    return sessions;
  }
  async getUpcomingSessions(): Promise<Session[]> {
    const sessions = await this.sessionRepository.findUpcomingSessions();
    return sessions;
  }
  async getTodaySessions(): Promise<Session[]> {
    const sessions = await this.sessionRepository.findTodaySessions();
    return sessions;
  }
 

  async findOneById(id: number): Promise<Session> {
    const session = await this.sessionRepository.findOneById(id);
    if (!session) {
      throw new HTTPException(404, "Session not found");
    }
    return session;
  }
  async deleteSession(id: number): Promise<void> {
    const session = await this.sessionRepository.findOneById(id);
    if (!session) {
      throw new HTTPException(404, "Session not found");
    }

    await this.sessionRepository.delete(id);
    this.logger.info(`User deleted with ID: ${id}`);
  }

  async updateSession(
    id: number,
    sessionDto: UpdateSessionDto
  ): Promise<Session> {
    const existingSession = await this.sessionRepository.findOneById(id);

    if (!existingSession) {
      throw new HTTPException(404, "User not found");
    }

    const sessionData = plainToInstance(Session, instanceToPlain(sessionDto));
    sessionData.training = await this.trainingService.getTrainingById(
      sessionDto.program_id
    );
    const training = await this.trainingService.getTrainingById(
      sessionDto.program_id
    );
    if (training) {
      sessionData.training = training;
    } else {
      throw new HTTPException(400, "No such training");
    }
    const result = await this.sessionRepository.update(id, sessionData);
    this.logger.info(`Session updated with ID: ${result.id}`);
    return result;
  }
  async addUsersToSession(
    session_id: number,
    userSessionDto: CreateUserSessionDto
  ): Promise<UserSession[]> {
    const users = userSessionDto.users.map(({ id, role }) => {
      return {
        id: id,
        role: role as Role,
      };
    });
    const result = await this.userSessionRepository.addUsersToSession(
      session_id,
      users
    );
    
    this.logger.info(`User Session created: ${result}`);
    return result
  }
  async removeUsersFromSession(sessionId: number, userSessionDto:DeleteUserSessionDto){
    const session = await this.sessionRepository.findOneById(sessionId);
     const userIds = userSessionDto.userIds;
    if (!session) {
      throw new HTTPException(404, "Session not found");
    }
    await this.userSessionRepository.removeUsersFromSession(sessionId, userIds);
  }

  async getAllUserSessions(): Promise<UserSession[]> {

    const userSessions = await this.userSessionRepository.getAll();

    return userSessions;
  }

  
   

}
