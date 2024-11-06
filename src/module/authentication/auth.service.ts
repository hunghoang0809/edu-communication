import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import UsersService from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async generateToken(phone: string, role: string){
    const payload = {phone: phone, role: role}
    return this.jwtService.sign(payload)
  }

  async validateUser(req: LoginDto){
    const user = await this.userRepository.findOneBy({phone: req.phone})
    if(!user){
      throw new NotFoundException("Người dùng chưa được cấp tài khoản")
    }
    if (user && (await bcrypt.compare(req.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Mật khẩu không đúng');


  }

  async login(req: LoginDto) {
    const user = await this.validateUser(req)
    const token = await this.generateToken(user.phone, user.role)
    return {
      data: {
        user: user,
        accessToken: token
      }
    }
  }


}