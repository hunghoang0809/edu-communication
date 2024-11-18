import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import StudentsService from './students.service';

@Controller('students')
@ApiTags('Students')
export class StudentsController {
constructor(
 private readonly studentsService: StudentsService,
) {
}
// @Get("profile")
//   async getProfile() {
//     return await this.studentsService.profile();
//   }

}