import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class LoginDto{
  @ApiProperty({required: true, example: 'admin'})
  phoneOrUsername: string;
  @ApiProperty({required: true, example: '123456'})
  password: string;
}