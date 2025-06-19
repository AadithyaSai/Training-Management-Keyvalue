import { instanceToPlain, plainToInstance } from "class-transformer";
import LoggerService from "./logger.service";
import HTTPException from "../exceptions/http.exception";
import { CreateMaterialDto, UpdateMaterialDto } from "../dto/material.dto";
import { MaterialRepository } from "../repositories/material.repository";
import { Material } from "../entities/material.entity";
import { SessionService } from "./session.service";

export class MaterialService {
	private logger = LoggerService.getInstance("MaterialService()");
	constructor(
		private materialRepository: MaterialRepository,
		private sessionService: SessionService
	) {}

	async createMaterial(materialDto: CreateMaterialDto): Promise<Material> {
		const material = plainToInstance(
			Material,
			instanceToPlain(materialDto)
		);
		material.session = await this.sessionService.findOneById(
			materialDto.sessionId
		);
		const result = await this.materialRepository.create(material);
		this.logger.info(`Material created with ID: ${result.id}`);
		return result;
	}
	async findAllMaterial(): Promise<Material[]> {
		const materials = await this.materialRepository.getAll();

		return materials;
	}
	async findOneById(id: number) {
		const material = await this.materialRepository.getById(id);
		if (!material) {
			throw new HTTPException(404, "material not found");
		}
		return material;
	}

	async deleteMaterial(id: number): Promise<void> {
		const material = await this.materialRepository.getById(id);
		if (!material) {
			throw new HTTPException(404, "Material not found");
		}

		await this.materialRepository.delete(id);
		this.logger.info(`Material deleted with ID: ${id}`);
	}
	async updateMaterial(
		id: number,
		materialDto: UpdateMaterialDto
	): Promise<Material> {
		const existingMaterial = await this.materialRepository.getById(id);

		if (!existingMaterial) {
			throw new HTTPException(404, "User not found");
		}

		const materialData = plainToInstance(
			Material,
			instanceToPlain(materialDto)
		);
		materialData.session = await this.sessionService.findOneById(
			materialDto.sessionId
		);
		const result = await this.materialRepository.update(id, materialData);
		this.logger.info(`Material updated with ID: ${result.id}`);
		return result;
	}
}
