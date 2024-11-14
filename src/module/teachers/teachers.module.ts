import { Module } from '@nestjs/common';

import TeachersService from './teachers.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeachersController } from "./teachers.controller";
import { User } from "../users/entity/user.entity";
import { SubjectsModule } from '../subjects/subjects.module';
import { Class } from '../classes/entity/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ User, Class]), SubjectsModule],
  controllers:[TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
