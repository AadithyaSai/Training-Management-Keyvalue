import { Request, Response, NextFunction } from "express";

import HTTPException from "../exceptions/http.exception";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MaterialService } from "../services/material.service";
import { CreateMaterialDto, UpdateMaterialDto } from "../dto/material.dto";
import { uploadFile } from "../utils/cloud";

export class MaterialController {
	constructor(private materialService: MaterialService) {}

	async createMaterial(req: Request, res: Response, next: NextFunction) {
		try {
			const materialDto = plainToInstance(CreateMaterialDto, req.body);
			if (req.file) {
				materialDto.link = await uploadFile(req.file, "materials");
			}
			const errors = await validate(materialDto);
			if (errors.length > 0) {
				return res.status(400).json({
					message: "Validation failed for material",
					errors: errors.map((error) => error.constraints),
				});
			}

			const session = await this.materialService.createMaterial(
				materialDto
			);

			res.status(201).json(session);
		} catch (error) {
			next(error);
		}
	}
	async getAllMaterial(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await this.materialService.findAllMaterial();

			res.status(200).json(users);
		} catch (error) {
			next(error);
		}
	}

	async getMaterialById(req: Request, res: Response, next: NextFunction) {
		try {
			const materialId = parseInt(req.params.id, 10);
			const material = await this.materialService.findOneById(materialId);

			res.status(200).json(material);
		} catch (error) {
			next(error);
		}
	}
	async deleteMaterial(req: Request, res: Response, next: NextFunction) {
		try {
			const materialId = parseInt(req.params.id, 10);
			await this.materialService.deleteMaterial(materialId);

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
	async updateMaterial(req: Request, res: Response, next: NextFunction) {
		try {
			const materialId = parseInt(req.params.id, 10);

			const materialDto = plainToInstance(UpdateMaterialDto, req.body);
			if (req.file) {
				materialDto.link = await uploadFile(req.file, "materials");
			}
			const errors = await validate(materialDto);
			if (errors.length > 0) {
				return res.status(400).json({
					message: "Validation failed",
					errors: errors.map((error) => error.constraints),
				});
			}

			const updatedMaterial = await this.materialService.updateMaterial(
				materialId,
				materialDto
			);

			res.status(200).json(updatedMaterial);
		} catch (error) {
			next(error);
		}
	}
}
