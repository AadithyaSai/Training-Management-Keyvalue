import { JwtPayload } from "../dto/jwt-payload";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import UserService from "./user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoggerService from "./logger.service";
import { User } from "../entities/user.entity";
import { StringValue } from "ms";

export class AuthService {
	private logger = LoggerService.getInstance(UserService.name);

	constructor(private userService: UserService) {}

	async login(username: string, password: string) {
		const user: User = await this.userService.findOneByUsername(username);
		if (!user) {
			throw new Error("Invalid username or password");
		}
		if (user) {
			const isPasswordValid: boolean = await bcrypt.compare(
				password,
				user.password
			);
			if (!isPasswordValid) {
				throw new Error("Invalid username or password");
			}
			const payload: JwtPayload = {
				id: user.id,
				email: user.email,
				username: user.username,
				isAdmin: user.isAdmin,
			};

			const token: string = jwt.sign(payload, JWT_SECRET, {
				expiresIn: JWT_VALIDITY as StringValue,
			});
			return {
				tokenType: "Bearer",
				accessToken: token,
			};
		}
	}
}
