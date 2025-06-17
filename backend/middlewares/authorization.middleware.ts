import { Request, Response, NextFunction } from "express";

import HTTPException from "../exceptions/http.exception";
import AuthorizationService from "../services/authorization.service";
import { userService } from "../routes/user.route";
import { trainingService } from "../routes/training.route";
import { sessionService } from "../routes/session.routes";
import { AuthRole, AuthRoles } from "../types/authorization.type";

const authorizationService = new AuthorizationService(
  userService,
  trainingService,
  sessionService
);

async function checkAccess(
  allowedRoles: AuthRole[],
  userId: number,
  sessionId?: number,
  reqUserId?: number
) {
  if (allowedRoles.includes(AuthRoles.TRAINING_ADMIN)) {
    return (
      sessionId &&
      (await authorizationService.isAdminOfTrainingProgram(userId, sessionId))
    );
  } else if (allowedRoles.includes(AuthRoles.MODERATOR)) {
    return (
      sessionId && (await authorizationService.isModerator(userId, sessionId))
    );
  } else if (allowedRoles.includes(AuthRoles.TRAINER)) {
    return (
      sessionId && (await authorizationService.isTrainer(userId, sessionId))
    );
  } else if (allowedRoles.includes(AuthRoles.CANDIDATE)) {
    return (
      sessionId && (await authorizationService.isCandidate(userId, sessionId))
    );
  } else if (allowedRoles.includes(AuthRoles.OWN)) {
    return reqUserId !== null && userId === reqUserId;
  }
  return false;
}

export default function validRoles(allowedRoles: AuthRole[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HTTPException(401, "No such user");
      }

      const id = req.user.id;

      if (allowedRoles.includes(AuthRoles.PUBLIC)) {
        return next();
      }

      if (allowedRoles.includes(AuthRoles.ADMIN) && req.user.isAdmin) {
        return next();
      }

      const sessionId = parseInt(req.params.sessionId, 10) || null; // will only be present in some session endpoints. null otherwise
      const reqUserId =
        parseInt(req.params.id, 10) || (req.body && req.body.id) || null; // will only be present in some user endpoints. null otherwise
      if (!(await checkAccess(allowedRoles, id, sessionId, reqUserId))) {
        throw new HTTPException(403, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
