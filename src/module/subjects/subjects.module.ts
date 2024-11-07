import { Module } from '@nestjs/common';

import SubjectService from './subjects.service';

@Module({
  imports: [],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectsModule {}
