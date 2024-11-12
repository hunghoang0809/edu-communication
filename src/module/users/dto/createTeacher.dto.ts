import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../enum/role.enum";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({message:"Số điện thoại không được để trống"})
  phone: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  @IsNotEmpty({message: "Mật khẩu không được bỏ trống"})
  password: string;
  @ApiProperty({type: "enum", enum: Role, default: Role.ADMIN})
  role: Role;
  @ApiProperty()
  @IsNotEmpty({message: "Họ và tên không được để trống"})
  fullName: string;
  @ApiProperty()
  email: string;
}

