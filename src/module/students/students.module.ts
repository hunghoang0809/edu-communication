import { Module } from '@nestjs/common';

import StudentsService from './students.service';

@Module({
  imports: [],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
