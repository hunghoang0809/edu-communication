import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class AddStudentsToClassDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  studentIds: number[];
}
