import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  teacherIds: number[];
}
