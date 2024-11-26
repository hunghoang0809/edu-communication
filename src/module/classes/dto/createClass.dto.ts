import { IsString, IsNotEmpty, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GradeLevel } from '../grade.enum';

export class CreateClassDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schoolYear: string;

  @ApiProperty()
  studentIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  homeroomTeacher: number;

}
