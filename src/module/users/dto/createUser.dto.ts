import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../enum/role.enum";

export class CreateUserDto {
  @ApiProperty()
  phone: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({type: "enum", enum: Role})
  role: Role;
}

