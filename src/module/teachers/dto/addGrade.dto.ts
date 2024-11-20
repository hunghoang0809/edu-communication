import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Column } from "typeorm";

class GradeDto{

  @ApiProperty()
  scoreFactor1: number;

  @ApiProperty()
  scoreFactor2: number;

  @ApiProperty()
  scoreFactor3: number;

  @ApiProperty()
  classId: number;
}

 class AddGradeToUserDto {

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: [GradeDto] })
  addGrade: GradeDto[];

}

export class AddGradeDto{
  @ApiProperty({ type: [AddGradeToUserDto] })
  addToUserDto: AddGradeToUserDto[];
}


export default AddGradeDto;
