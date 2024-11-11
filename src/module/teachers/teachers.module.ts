import { Module } from '@nestjs/common';

import TeachersService from './teachers.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Teacher } from "./entity/teacher.entity";
import { TeachersController } from "./teachers.controller";
import { User } from "../users/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User])],
  controllers:[TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
