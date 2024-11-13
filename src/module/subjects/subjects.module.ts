import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Subject } from './entity/subject.entity';
import { SubjectService } from './subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subject])],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectsModule {}
