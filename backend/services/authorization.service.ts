import LoggerService from "./logger.service";
import UserService from "./user.service";

export default class AuthorizationService {
  private logger = LoggerService.getInstance(AuthorizationService.name);

  constructor(private userService: UserService) {}

  async isAdmin(userId: number): Promise<boolean> {
    return (await this.userService.findOneById(userId)).isAdmin;
  }

  async isModerator(userId: number, sessionId: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async isTrainer(userId: number, sessionId: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async isCandidate(userId: number, sessionId: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
