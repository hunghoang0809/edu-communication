import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { RegisterDto } from './dto/Register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {

  }
  @Post("login")
  async login (@Body() request: LoginDto) {
    return await this.authService.login(request);
  }

}