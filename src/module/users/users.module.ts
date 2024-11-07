import { Module } from '@nestjs/common';

import UsersService from './users.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersController } from "./users.controller";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  controllers:[UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
