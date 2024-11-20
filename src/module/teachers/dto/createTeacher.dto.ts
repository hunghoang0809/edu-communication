import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeacherDto {
  @ApiPropertyOptional()
  @IsOptional()
  subjectId: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
}

export default CreateTeacherDto;
