import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';


import { ApiTags } from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { SubjectService } from './subjects.service';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}


  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }


  @Get()
  async findAll() {
    return this.subjectService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.subjectService.findOne(id);
  }


  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.subjectService.remove(id);
  }
}
