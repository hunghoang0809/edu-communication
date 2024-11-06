import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async generateToken() {

  }

  async verifyToken() {

  }

  async hashPassword() {

  }

  async login(req: LoginDto) {
    return {
      token: this.generateToken()
    }
  }

}