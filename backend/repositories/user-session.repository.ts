import { Repository } from "typeorm";
import {  UserSession } from "../entities/user-session.entity";
import SessionRepository from "./session.repository";
import TrainingRepository from "./training.repository";
import { Role } from "../entities/training-users.entity";

export class UserSessionRepository {
  constructor(private repository: Repository<UserSession>,private sessionRepository:SessionRepository,private trainingRepository:TrainingRepository) {}

  async addUsersToSession(
  sessionId: number,
  users: { id: number; role: Role }[]
): Promise<UserSession[]> {
  // Load the session with its training
  const session = await this.sessionRepository.findOneById(sessionId)

  if (!session || !session.training) {
    throw new Error('Session or its training not found.');
  }

  const trainingId = session.training.id;

  // Load training users with the given IDs
  const userIds = users.map((u) => u.id);
  
  const training= await this.trainingRepository.findOneById(trainingId);
  const trainingUsers=training.members;

  // Prepare insert values after role validation
  const insertValues: UserSession[] = [];

  for (const { id: userId, role } of users) {
    // Find all training user roles for this user
    const userTrainingRoles = trainingUsers
      .filter((tu) => tu.user.id === userId)
      .map((tu) => tu.role);

    let isValid = false;

    if (role === Role.TRAINER) {
      isValid = userTrainingRoles.includes(Role.TRAINER) || userTrainingRoles.includes(Role.ADMIN);
    } else if (role === Role.MODERATOR) {
      isValid = userTrainingRoles.includes(Role.MODERATOR) || userTrainingRoles.includes(Role.ADMIN);
    } else if (role === Role.CANDIDATE) {
      isValid = userTrainingRoles.includes(Role.CANDIDATE);
    }

    if (!isValid) {
      throw new Error(
        `User ${userId} cannot be assigned role '${role}' in this session (training roles: [${userTrainingRoles.join(', ')}]).`
      );
    }

    insertValues.push(
      this.repository.create({
        session: { id: sessionId },
        user: { id: userId },
        role,
      })
    );
  }

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
async UpdateUserRole(
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

  async getUserRoleInSession(sessionId: number, userId: number): Promise<Role | null> {
    const userSession = await this.repository.findOne({
      where: {
        session: { id: sessionId },
        user: { id: userId },
      },
      relations: ['user', 'session'],
    });

    return userSession?.role || null;
  }
  // Update a user's role in a session
  // async updateRole(userId: number, sessionId: number, newRole: Role): Promise<void> {
  //   await this.repository.update(
  //     { user: { id: userId }, session: { id: sessionId } },
  //     { role: newRole }
  //   );
  // }


  


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
