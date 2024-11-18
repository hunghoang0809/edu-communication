import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AddTeacherClassDto {
  @ApiProperty()
  classIds: number[];
}

export default AddTeacherClassDto;
