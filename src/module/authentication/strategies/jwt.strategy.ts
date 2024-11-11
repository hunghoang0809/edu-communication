
import express from "express"
import { ExtractJwt, Strategy } from "passport-jwt"

import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"

import { AuthService } from "../auth.service"
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entity/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate(req: express.Request, payload: any) {
    const user = await this.userRepository.findOneBy({username: payload.username})
    if (!user) {
      throw new UnauthorizedException()
    }
    req.user = user
    return user
  }

}

