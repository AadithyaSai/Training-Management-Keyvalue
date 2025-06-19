import { Router } from "express";
import dataSource from "../db/dataSource";
import { MaterialRepository } from "../repositories/material.repository";
import { MaterialService } from "../services/material.service";
import { MaterialController } from "../controllers/material.controller";
import { sessionService } from "./session.routes";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });


const materialRepository = new MaterialRepository(dataSource.getRepository("Material"));
const materialService= new MaterialService(materialRepository,sessionService);
const materialController=new MaterialController(materialService);

const materialRouter=Router();

materialRouter.post("/",upload.single('file'), materialController.createMaterial.bind(materialController));
materialRouter.get("/", materialController.getAllMaterial.bind(materialController));
materialRouter.get("/:id", materialController.getMaterialById.bind(materialController));
materialRouter.patch("/:id", upload.single('file'),materialController.updateMaterial.bind(materialController));
materialRouter.delete("/:id", materialController.deleteMaterial.bind(materialController));
export default materialRouter;
export { materialController, materialService, materialRepository};