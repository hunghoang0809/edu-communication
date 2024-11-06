import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import UsersService from './users.service';
import CreateUserDto from './dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {

  }

  @Get()
  async findAll() {
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
  }

  @Put(':id')
  async update(@Param('id') id: string) {

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

  }
}