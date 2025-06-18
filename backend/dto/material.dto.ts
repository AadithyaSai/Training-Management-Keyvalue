import {
	IsString,
	IsNotEmpty,
	IsOptional,
	IsNumber,
	Min,
	Max,
} from "class-validator";

export class CreateMaterialDto {
	@IsNotEmpty()
	@IsNumber()
	sessionId: number;
    
	@IsString()
	@IsNotEmpty()
	link: string;

	file: File;
}

export class UpdateMaterialDto {
	@IsOptional()
	@IsNumber()
	sessionId: number;

	@IsString()
	@IsOptional()
	link: string;

	file: File;
}
