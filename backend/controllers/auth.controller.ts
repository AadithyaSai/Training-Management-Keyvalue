import HTTPException from "../exceptions/http.exception";
import { AuthService } from "../services/auth.service";
import { NextFunction, Router, Response, Request } from "express";
import LoggerService from "../services/logger.service";

export class AuthController {
  private logger = LoggerService.getInstance(AuthController.name);

  constructor(private authService: AuthService, private router: Router) {
    router.post("/login", this.login.bind(this));
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const username = data.username;
      const password = data.password;
      if (!username || !password) {
        throw new HTTPException(400, "Invalid request body");
      }
      const token = await this.authService.login(username, password);
      res.status(200).send(token);
    } catch (error) {
      this.logger.error(error.message);
      next(error);
    }
  }
}
