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
}

export default CreateTeacherDto;
