import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import UsersService from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../../utils/decorator/role.decorator";
import { JwtAuthGuard } from "../../utils/guard/jwt.guard";
import { RolesGuard } from "../../utils/guard/role.guard";
import { Role } from "./enum/role.enum";

@ApiTags('Users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    return  this.usersService.create(createUserDto)
  }

  @Get("")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findAll() {
    return this.usersService.list()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: string) {

  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {

  }
}