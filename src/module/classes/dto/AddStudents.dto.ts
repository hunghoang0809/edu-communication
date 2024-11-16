import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStudentsToClassDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  studentIds: Number[];
}
