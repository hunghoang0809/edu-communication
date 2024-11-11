import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../enum/role.enum";
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  @IsNotEmpty({message: "Tên đăng nhập không được bỏ trống"})
  username: string;
  @ApiProperty()
  @IsNotEmpty({message: "Mật khẩu không được bỏ trống"})
  password: string;
  @ApiProperty({type: "enum", enum: Role, default: Role.ADMIN})
  role: Role;
}

