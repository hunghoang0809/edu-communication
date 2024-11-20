import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import StudentsService from './students.service';
import { User } from "../../utils/decorator/user.decorator";
import { JwtAuthGuard } from '../../utils/guard/jwt.guard';
import { RolesGuard } from '../../utils/guard/role.guard';
import { Roles } from '../../utils/decorator/role.decorator';
import { Role } from '../users/enum/role.enum';


@Controller('students')
@ApiTags('Students')
export class StudentsController {
constructor(
 private readonly studentsService: StudentsService,
) {
}
@Get("profile")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
@ApiBearerAuth()
  async getProfile(
  @User('id') userId: number
) {
    return await this.studentsService.profile(userId);
  }

}