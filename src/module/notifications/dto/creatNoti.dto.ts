import { ApiProperty } from "@nestjs/swagger";

export class SendNotificationDto {
  @ApiProperty({ type: [Number] })
  recipientIds: number[];

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;


}