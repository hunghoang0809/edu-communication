import { IsArray, ArrayNotEmpty, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTeachersDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  teachers: TeacherDto[];

  @ApiProperty()
  @IsNotEmpty({message:"Id lớp học không được để trống"})
  classId: number

  @ApiProperty()
  isDelete: boolean;

}

class TeacherDto {
  @ApiProperty()
  @IsNotEmpty({message:"Id giáo viên không được để trống"})
  teacherId: number;

  @ApiProperty()
  subjectId: number;
}
