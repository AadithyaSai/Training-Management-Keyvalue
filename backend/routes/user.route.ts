import { Router } from "express";

import dataSource from "../db/dataSource";
import { AuthRoles } from "../types/authorization.type";
import UserRepository from "../repositories/user.repository";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import validRoles from "../middlewares/authorization.middleware";

const userRepository = new UserRepository(dataSource.getRepository("User"));
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const router = Router();
router.get(
  "/",
  validRoles([AuthRoles.ADMIN]),
  userController.getAllUsers.bind(userController)
);
router.get(
  "/admin",
  validRoles([AuthRoles.ADMIN]),
  userController.getAllAdmins.bind(userController)
);
router.get(
  "/:id",
  validRoles([AuthRoles.ADMIN, AuthRoles.OWN]),
  userController.getUserById.bind(userController)
);
router.post("/", userController.createUser.bind(userController));
router.patch(
  "/:id",
  validRoles([AuthRoles.ADMIN, AuthRoles.OWN]),
  userController.updateUser.bind(userController)
);
router.patch(
  "/admin/:id",
  validRoles([AuthRoles.ADMIN]),
  userController.changeAdminStatus.bind(userController)
);
router.delete(
  "/:id",
  validRoles([AuthRoles.ADMIN]),
  userController.deleteUser.bind(userController)
);

export default router;
export { userController, userService, userRepository };
