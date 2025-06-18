import { Router } from "express";
import dataSource from "../db/dataSource";
import TrainingRepository from "../repositories/training.repository";
import TrainingService from "../services/training.service";
import TrainingController from "../controllers/training.controller";
import validRoles from "../middlewares/authorization.middleware";
import { AuthRoles } from "../types/authorization.type";

const trainingRepository = new TrainingRepository(
  dataSource.getRepository("Training")
);
const trainingService = new TrainingService(trainingRepository);
const trainingController = new TrainingController(trainingService);

const trainingRouter = Router();

trainingRouter.get(
  "/",
  validRoles([AuthRoles.ADMIN]),
  trainingController.getTrainings.bind(trainingController)
);
trainingRouter.get(
  "/:id",
  validRoles([
    AuthRoles.ADMIN,
    AuthRoles.MODERATOR,
    AuthRoles.TRAINER,
    AuthRoles.CANDIDATE,
  ]),
  trainingController.getTrainings.bind(trainingController)
);
trainingRouter.post(
  "/",
  validRoles([AuthRoles.ADMIN]),
  trainingController.createTraining.bind(trainingController)
);
trainingRouter.patch(
  "/:id",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  trainingController.updateTraining.bind(trainingController)
);
trainingRouter.delete(
  "/:id",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  trainingController.deleteTraining.bind(trainingController)
);

trainingRouter.post(
  "/:id/members",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  trainingController.addMembers.bind(trainingController)
);
trainingRouter.delete(
  "/:id/members",
  validRoles([AuthRoles.TRAINING_ADMIN]),
  trainingController.removeMembers.bind(trainingController)
);

export default trainingRouter;
export { trainingController, trainingService, trainingRepository };
