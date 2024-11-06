import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import UsersService from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken() {

  }

  async generateAccessToken() {

  }

  async generateRefreshToken() {

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