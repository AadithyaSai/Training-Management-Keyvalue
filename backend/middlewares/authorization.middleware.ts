import { Request, Response, NextFunction } from "express";

import HTTPException from "../exceptions/http.exception";
import { userService } from "../routes/user.route";
import { trainingService } from "../routes/training.route";
import { sessionService } from "../routes/session.routes";
import { AuthRole, AuthRoles } from "../types/authorization.type";
import AuthorizationService from "../services/authorization.service";

const authorizationService = new AuthorizationService();

const roleChecks: [
  AuthRole,
  (userId: number, sessionId: number) => Promise<boolean>
][] = [
  [
    AuthRoles.TRAINING_ADMIN,
    authorizationService.isAdminOfTrainingProgram.bind(authorizationService),
  ],
  [
    AuthRoles.MODERATOR,
    authorizationService.isModerator.bind(authorizationService),
  ],
  [
    AuthRoles.TRAINER,
    authorizationService.isTrainer.bind(authorizationService),
  ],
  [
    AuthRoles.CANDIDATE,
    authorizationService.isCandidate.bind(authorizationService),
  ],
];

async function checkAccess(
  allowedRoles: AuthRole[],
  userId: number,
  sessionId?: number,
  reqUserId?: number
) {
  console.log(sessionId);
  if (allowedRoles.includes(AuthRoles.OWN)) {
    return reqUserId !== null && userId === reqUserId;
  }

  for (const [role, checkFn] of roleChecks) {
    if (allowedRoles.includes(role) && sessionId) {
      if (await checkFn(userId, sessionId)) {
        return true;
      }
      console.warn(
        `User with ID ${userId} does not have the required role: ${role} for session ID ${sessionId}`
      );
    }
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

      const sessionId = parseInt(req.params.id, 10) || null; // will only be present in some session endpoints. null otherwise
      const reqUserId =
        parseInt(req.params.id, 10) || (req.body && req.body.id) || null; // will only be present in some user endpoints. null otherwise
      console.log(req.params);
      console.log(sessionId);
      if (!(await checkAccess(allowedRoles, id, sessionId, reqUserId))) {
        throw new HTTPException(403, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
