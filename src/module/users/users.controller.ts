import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import UsersService from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../utils/decorator/role.decorator";
import { JwtAuthGuard } from "../../utils/guard/jwt.guard";
import { RolesGuard } from "../../utils/guard/role.guard";
import { Role } from "./enum/role.enum";
import { FilterUserDto } from "./dto/filterUser.dto";
import CreateTeacherDto from "../teachers/dto/createTeacher.dto";
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    return  this.usersService.create(createUserDto);
  }

  @Get("")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findAll(@Query() req: FilterUserDto) {
    return this.usersService.list(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: number) {
    return this.usersService.getById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: number, @Body() req: UpdateUserDto) {
    return this.usersService.update(id, req);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}