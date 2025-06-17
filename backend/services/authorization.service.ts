import LoggerService from "./logger.service";
import { SessionService } from "./session.service";
import TrainingService from "./training.service";
import UserService from "./user.service";

export default class AuthorizationService {
  private logger = LoggerService.getInstance(AuthorizationService.name);

  constructor(
    private userService: UserService,
    private trainingService: TrainingService,
    private sessionService: SessionService
  ) {}

  async isAdmin(userId: number): Promise<boolean> {
    return (await this.userService.findOneById(userId)).isAdmin;
  }

  async isAdminOfTrainingProgram(
    userId: number,
    trainingId: number
  ): Promise<boolean> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    if (!user.isAdmin) {
      return false;
    }

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
  }

  async isModerator(userId: number, sessionId: number): Promise<boolean> {
    return true; // Placeholder for actual implementation
  }

  async isTrainer(userId: number, sessionId: number): Promise<boolean> {
    return true;
  }

  async isCandidate(userId: number, sessionId: number): Promise<boolean> {
    return true;
  }
}
