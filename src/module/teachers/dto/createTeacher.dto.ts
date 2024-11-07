import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTeacherDto {
  @ApiProperty()
  @IsNotEmpty({message: "Họ và tên không được để trống"})
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  subjectId: number;
}

export default CreateTeacherDto;
