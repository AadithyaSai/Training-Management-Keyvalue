import { Repository } from "typeorm";
import { Role, UserSession } from "../entities/user-session.entity";
import { Session } from "../entities/session.entity";
import { User } from "../entities/user.entity";
import SessionRepository from "./session.repository";
import { CreateUserSessionDto } from "../dto/user-session.dto";

export class UserSessionRepository {
  constructor(private repository: Repository<UserSession>) {}

  async addUsersToSession(
    sessionId: number,
    users: { id: number; role: Role }[]
  ): Promise<UserSession[]> {
    const insertValues = users.map(({ id, role }) =>
      this.repository.create({
        session: { id: sessionId },
        user: { id: id },
        role: role as Role,
      })
    );
    return this.repository.save(insertValues);
  }

  async getAll(): Promise<UserSession[]> {
    return this.repository.find({
      relations: { user: true, session: true },
    });
  }

  async getByUserAndSession(
    userId: number,
    sessionId: number
  ): Promise<UserSession | null> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        session: { id: sessionId },
      },
      relations: { user: true, session: true },
    });
  }
  async removeUsersFromSession(
  sessionId: number,
  userIds: number[]
): Promise<void> {
  await this.repository
    .createQueryBuilder()
    .delete()
    .from(UserSession)
    .where("session_id = :sessionId", { sessionId })
    .andWhere("user_id IN (:...userIds)", { userIds })
    .execute();
}


  


  // // Get all users in a session
  // async getUsersBySession(session: Session): Promise<UserSession[]> {
  //   return this.repository.find({
  //     where: { session },
  //     relations: { user: true },
  //   });
  // }

  // // Update a user's role in a session
  // async updateRole(userId: number, sessionId: number, newRole: Role): Promise<void> {
  //   await this.repository.update(
  //     { user: { id: userId }, session: { id: sessionId } },
  //     { role: newRole }
  //   );
  // }

  // // Remove user from session
  // async removeUserFromSession(userId: number, sessionId: number): Promise<void> {
  //   await this.repository.delete({
  //     user: { id: userId },
  //     session: { id: sessionId },
  //   });
  // }
}
