import { Router } from "express";
import { AuthRoles } from "../types/authorization.type";
import dataSource from "../db/dataSource";
import { MaterialRepository } from "../repositories/material.repository";
import { MaterialService } from "../services/material.service";
import { MaterialController } from "../controllers/material.controller";
import { sessionService } from "./session.routes";
import validRoles from "../middlewares/authorization.middleware";

const materialRepository = new MaterialRepository(
  dataSource.getRepository("Material")
);
const materialService = new MaterialService(materialRepository, sessionService);
const materialController = new MaterialController(materialService);

const materialRouter = Router();

materialRouter.post(
  "/",
  validRoles([AuthRoles.TRAINING_ADMIN, AuthRoles.TRAINER]),
  materialController.createMaterial.bind(materialController)
);
materialRouter.get(
  "/",
  validRoles([AuthRoles.ADMIN]),
  materialController.getAllMaterial.bind(materialController)
);
materialRouter.get(
  "/:id",
  validRoles([AuthRoles.ADMIN]),
  materialController.getMaterialById.bind(materialController)
);
materialRouter.patch(
  "/:id",
  validRoles([AuthRoles.TRAINING_ADMIN, AuthRoles.TRAINER]),
  materialController.updateMaterial.bind(materialController)
);
materialRouter.delete(
  "/:id",
  validRoles([AuthRoles.TRAINING_ADMIN, AuthRoles.TRAINER]),
  materialController.deleteMaterial.bind(materialController)
);
export default materialRouter;
export { materialController, materialService, materialRepository };
