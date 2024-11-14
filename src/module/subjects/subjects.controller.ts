import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';


import { ApiTags } from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { SubjectService } from './subjects.service';
import { AddSubjectToTeacherDto } from './dto/addSubjectToTeacher.dto';
import { JwtAuthGuard } from '../../utils/guard/jwt.guard';
import { RolesGuard } from '../../utils/guard/role.guard';
import { Roles } from '../../utils/decorator/role.decorator';
import { Role } from '../users/enum/role.enum';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return this.subjectService.findAll();
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: number) {
    return this.subjectService.findOne(id);
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    return this.subjectService.remove(id);
  }


}
