import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import TeachersService from "./teachers.service";
import { JwtAuthGuard } from "../../utils/guard/jwt.guard";
import { RolesGuard } from "../../utils/guard/role.guard";
import { Roles } from "../../utils/decorator/role.decorator";
import { Role } from "../users/enum/role.enum";
import teachersService from "./teachers.service";
import CreateTeacherDto from "./dto/createTeacher.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FilterUserDto } from "../users/dto/filterUser.dto";

@ApiTags("Teachers")
@Controller('admin/teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Post("")
  public create(@Body() req: CreateTeacherDto) {
    return this.teachersService.create(req)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get("")
  public findAll(@Query() req: FilterUserDto) {
    return this.teachersService.list(req)
  }
}