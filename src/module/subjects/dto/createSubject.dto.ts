import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty()
  name: string;
}
