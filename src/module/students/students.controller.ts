import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import StudentsService from './students.service';
import { User } from "../../utils/decorator/user.decorator";


@Controller('students')
@ApiTags('Students')
export class StudentsController {
constructor(
 private readonly studentsService: StudentsService,
) {
}
@Get("profile")
@ApiBearerAuth()
  async getProfile(
  @User('id') userId: number
) {
    return await this.studentsService.profile(userId);
  }

}