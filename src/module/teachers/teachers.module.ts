import { Module } from '@nestjs/common';

import TeachersService from './teachers.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeachersController } from "./teachers.controller";
import { User } from "../users/entity/user.entity";
import { Class } from '../classes/entity/class.entity';
import { Subject } from '../subjects/entity/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ User, Subject, Class])],
  controllers:[TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
