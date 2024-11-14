import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../enum/role.enum";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({type: "enum", enum: Role, default: Role.ADMIN})
  role: Role;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiPropertyOptional()
  @IsOptional()
  subjectId: number;
}

