import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class LoginDto{
  @ApiProperty({required: true, example: '1234567890'})
  phone: string;
  @ApiProperty({required: true})
  password: string;
}