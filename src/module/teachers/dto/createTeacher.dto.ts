import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty()
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
