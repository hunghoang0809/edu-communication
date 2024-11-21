import { ApiProperty } from "@nestjs/swagger";

export class SendNotificationDto {
  @ApiProperty()
  recipientId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;


}