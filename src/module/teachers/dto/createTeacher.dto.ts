import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty()
  @IsNotEmpty({message: "Họ và tên không được để trống"})
  name: string;
  @ApiPropertyOptional()
  @IsOptional()
  subjectId: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  @IsNotEmpty({message: "Tên đăng nhập không được để trống"})
  username: string;

}

export default CreateTeacherDto;
