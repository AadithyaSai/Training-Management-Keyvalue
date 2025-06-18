import {
	IsNotEmpty,
	IsString,
	IsDateString,
	IsOptional,
	IsEnum,
	IsNumber,
} from "class-validator";
import { Status } from "../entities/session.entity";

export class CreateSessionDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsNumber()
	programId: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	preReq?: string;

	@IsOptional()
	@IsEnum(Status)
	status: Status;

	@IsNotEmpty()
	@IsNumber()
	duration?: number;
}

export class UpdateSessionDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsNumber()
	programId?: number;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	preReq?: string;

	@IsOptional()
	@IsEnum(Status)
	status?: Status;

	@IsOptional()
	@IsDateString()
	date?: Date;

	@IsOptional()
	@IsNumber()
	slot?: number;

	@IsOptional()
	@IsNumber()
	duration?: number;
}
