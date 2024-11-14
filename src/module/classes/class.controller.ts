import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/udpateClass.dto';
import { ClassService } from './class.service';
import { ApiTags } from '@nestjs/swagger';
import { AddStudentsToClassDto } from './dto/AddStudents.dto';

@ApiTags('Classes')
@Controller('classes')
export class ClassController {
  constructor(private readonly classesService: ClassService) {}

  @Get()
  async findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.classesService.findOne(id);
  }

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.classesService.remove(id);
  }

  @Post(':classId/students/')
  async addStudentToClass(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() addStudentsToClassDto: AddStudentsToClassDto,
  ) {
    return await this.classesService.addStudentsToClass(classId, addStudentsToClassDto);
  }
}