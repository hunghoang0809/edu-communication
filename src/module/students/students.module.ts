import { Controller, Module } from '@nestjs/common';

import StudentsService from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Subject } from "../subjects/entity/subject.entity";
import { Class } from "../classes/entity/class.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ User, Subject, Class])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
