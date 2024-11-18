import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/udpateClass.dto';
import { ClassService } from './class.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddStudentsToClassDto } from './dto/addStudents.dto';
import { JwtAuthGuard } from '../../utils/guard/jwt.guard';
import { RolesGuard } from '../../utils/guard/role.guard';
import { Role } from '../users/enum/role.enum';
import { Roles } from '../../utils/decorator/role.decorator';
import { FilterClassDto } from './dto/filterClass.dto';
import { User } from '../../utils/decorator/user.decorator';
import { AddTeachersDto } from './dto/addTeachers.dto';

@ApiTags('Classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classesService: ClassService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(@Query() filter: FilterClassDto, @User('role') userRole: Role) {
    return this.classesService.findAll(filter, userRole);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: number) {
    return this.classesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: number, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  async remove(@Param('id') id: number) {
    return this.classesService.remove(id);
  }


}