import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import TeachersService from "./teachers.service";
import { JwtAuthGuard } from "../../utils/guard/jwt.guard";
import { RolesGuard } from "../../utils/guard/role.guard";
import { Roles } from "../../utils/decorator/role.decorator";
import { Role } from "../users/enum/role.enum";
import teachersService from "./teachers.service";
import CreateTeacherDto from "./dto/createTeacher.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FilterUserDto } from "../users/dto/filterUser.dto";
import { User } from '../../utils/decorator/user.decorator';
import { AddSubjectToTeacherDto } from '../subjects/dto/addSubjectToTeacher.dto';
import { SubjectService } from '../subjects/subjects.service';
import AddTeacherClassDto from './dto/addTeacherClass.dto';

@ApiTags("Teachers")
@Controller('teacher')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService)
  { }


  @Roles(Role.TEACHER)
  @Get("profile")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async getProfile(
    @User('id') userId: number
  ) {

    return this.teachersService.getProfile(userId);
  }


  @Patch("update-profile")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)

  public async updateProfile(
    @User('id') userId: number,
    @Body() req: CreateTeacherDto
  ) {
    return this.teachersService.updateProfile(userId, req);
  }

  @Patch("add-class/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async addTeacherToClass(
    @Param('id') userId: number,
    @Body() req: AddTeacherClassDto
  ) {
    return this.teachersService.addTeacherToClass(userId, req);
  }

}