import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
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
  @IsEnum(GradeLevel)
  gradeLevel: GradeLevel;
}
