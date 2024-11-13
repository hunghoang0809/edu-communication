import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Subject } from './entity/subject.entity';
import { SubjectService } from './subjects.service';
import { SubjectController } from './subjects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subject])],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectsModule {}
