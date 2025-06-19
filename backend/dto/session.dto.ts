import {
	IsNotEmpty,
	IsString,
	IsDateString,
	IsOptional,
	IsEnum,
	IsNumber,
  ValidateNested,
  isNumber,
} from "class-validator";
import { Status } from "../entities/session.entity";
import { Type } from "class-transformer";

export class CreateSessionDto {

	@IsNotEmpty()
	@IsNumber()
	programId: number;
	@IsNotEmpty()
	@IsString()
	title: string;


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
export class CreateSessionsDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions: CreateSessionDto[];
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
export class UpdateSessionItemDto {
  @IsNotEmpty()
  @IsNumber()
  id:number
	@IsOptional()
	@IsString()
	title?: string;

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
export class UpdateSessionsDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateSessionItemDto)
  sessions: UpdateSessionItemDto[];
}
