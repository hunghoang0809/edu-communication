import { ApiProperty } from '@nestjs/swagger';

export class AddSubjectToTeacherDto {
  @ApiProperty()
  teacherId: number;
  @ApiProperty()
  subjectId: number;
}
