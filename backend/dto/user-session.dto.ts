import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
} from "class-validator";
import { Status } from "../entities/session.entity";
import { Role } from "../entities/user-session.entity";

export class CreateUserSessionDto {
  @IsNotEmpty()
  @IsNumber()
  users: { id: number, role: Role }[];
}
export class DeleteUserSessionDto {
  @IsNotEmpty()
  @IsNumber()
  userIds:number[];
}

export class UpdateUserSessionDto {
  @IsOptional()
  @IsNumber()
  session_id: number;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
