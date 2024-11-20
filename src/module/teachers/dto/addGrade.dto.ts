import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


class GradeDto{

  @ApiProperty()
  userId: number;

  @ApiProperty()
  scoreFactor1: number;

  @ApiProperty()
  scoreFactor2: number;

  @ApiProperty()
  scoreFactor3: number;

  @ApiProperty()
  classId: number;
}

export class AddGradeDto {

  @ApiProperty({ type: [GradeDto] })
  addGrade: GradeDto[];

}



export default AddGradeDto;
