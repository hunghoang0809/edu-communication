import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty()
  @IsNotEmpty({message: "Họ và tên không được để trống"})
  name: string;
  @ApiProperty()
  @IsNotEmpty({message: "Id user không được để trống"})
  userId: number;
  @ApiProperty()
  subjectId: number;
  @ApiProperty()
  email: string;
}

export default CreateTeacherDto;
