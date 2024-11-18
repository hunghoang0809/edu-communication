import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({message: "Tên môn học k được để trống"})
  name: string;

  @ApiProperty()
  teacherIds: number[];
}
