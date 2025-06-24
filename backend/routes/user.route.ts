import { Router } from "express";

import dataSource from "../db/dataSource";
import UserRepository from "../repositories/user.repository";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRepository = new UserRepository(dataSource.getRepository("User"));
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.post("/", userController.createUser.bind(userController));

router.use(authMiddleware);

router.get("/", userController.getAllUsers.bind(userController));
router.get("/admin", userController.getAllAdmins.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.patch("/:id", userController.updateUser.bind(userController));
router.patch(
  "/admin/:id",
  userController.changeAdminStatus.bind(userController)
);
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
export { userController, userService, userRepository };
