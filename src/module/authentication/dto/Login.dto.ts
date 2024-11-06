import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class LoginDto{
  @ApiProperty({required: true})
  phoneOrUsername: string;
  @ApiProperty({required: true})
  password: string;
}