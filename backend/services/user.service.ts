import { hash } from "bcrypt";

import type UserRepository from "../repositories/user.repository";
import HTTPException from "../exceptions/http.exception";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { User } from "../entities/user.entity";
import LoggerService from "./logger.service";

export default class UserService {
  private logger = LoggerService.getInstance(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async findOneById(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HTTPException(404, "User not found");
    }
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = plainToInstance(User, instanceToPlain(userDto));
    user.password = await hash(user.password, 10);

    const result = await this.userRepository.createOrUpdateUser(user);
    this.logger.info(`User created with ID: ${result.id}`);

    return result;
  }

  async updateUser(id: number, userDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneById(id);

    if (!existingUser) {
      throw new HTTPException(404, "User not found");
    }

    const userData = plainToInstance(User, instanceToPlain(userDto));

    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }

    const user = await this.userRepository.mergeUser(existingUser, userData);

    const result = await this.userRepository.createOrUpdateUser(user);
    this.logger.info(`User updated with ID: ${result.id}`);
    return result;
  }

  async changeAdminStatus(id: number, isAdmin: boolean): Promise<void> {
    if (typeof isAdmin !== "boolean") {
      throw new HTTPException(400, "isAdmin must be a boolean value");
    }

    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HTTPException(404, "User not found");
    }

    user.isAdmin = isAdmin;

    await this.userRepository.createOrUpdateUser(user);
    this.logger.info(`User admin status updated for ID: ${id} to ${isAdmin}`);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HTTPException(404, "User not found");
    }

    await this.userRepository.deleteUser(id);
    this.logger.info(`User deleted with ID: ${id}`);
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAllUsers();

    return users;
  }

  async findAllAdmins(): Promise<User[]> {
    const admins = await this.userRepository.findAllAdmins();

    return admins;
  }

  async countUsers(): Promise<number> {
    const count = await this.userRepository.countUsers();
    return count;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new Error("Invalid username");
    }
    return user;
  }
}
