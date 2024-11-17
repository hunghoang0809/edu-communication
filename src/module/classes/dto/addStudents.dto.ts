import { IsArray, ArrayNotEmpty, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStudentsToClassDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  studentIds: Number[];

  @ApiProperty()
  @IsNotEmpty({message:"Id lớp học không được để trống"})
  classId: number
}
