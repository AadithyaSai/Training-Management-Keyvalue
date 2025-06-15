import { Request, Response, NextFunction } from "express";

import HTTPException from "../exceptions/http.exception";
import AuthorizationService from "../services/authorization.service";
import { userService } from "../routes/user.route";

export default function validRoles(allowedRoles: string[]) {
  const authorizationService = new AuthorizationService(userService);

  async function checkAccess(
    allowedRoles: string[],
    userId: number,
    sessionId?: number
  ) {
    if (allowedRoles.includes("ALL")) {
      return true;
    } else if (allowedRoles.includes("ADMIN")) {
      return await authorizationService.isAdmin(userId);
    } else if (allowedRoles.includes("MODERATOR")) {
      return (
        sessionId && (await authorizationService.isModerator(userId, sessionId))
      );
    } else if (allowedRoles.includes("TRAINER")) {
      return (
        sessionId && (await authorizationService.isTrainer(userId, sessionId))
      );
    } else if (allowedRoles.includes("CANDIDATE")) {
      return (
        sessionId && (await authorizationService.isCandidate(userId, sessionId))
      );
    }
    return false;
  }

  return async function (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const id = req.user.id; // TODO: Extend Request to include user details too
    const sessionId = parseInt(req.params.sessionId, 10) || null; // will only be present in some session endpoints. null otherwise
    if (!(await checkAccess(allowedRoles, id, sessionId))) {
      throw new HTTPException(403, "Forbidden");
    }
    next();
  };
}
