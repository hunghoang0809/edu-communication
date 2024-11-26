
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateClassDto  {
  @ApiProperty()
  name: string;

  @ApiProperty()
  schoolYear: string;

  @ApiProperty()
  studentIds: number[];

  @ApiProperty()
  homeroomTeacher: number;

}
