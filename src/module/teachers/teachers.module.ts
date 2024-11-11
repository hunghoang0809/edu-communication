import { Module } from '@nestjs/common';

import TeachersService from './teachers.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeachersController } from "./teachers.controller";
import { User } from "../users/entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ User])],
  controllers:[TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
