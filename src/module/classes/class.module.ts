import { Module } from "@nestjs/common";
import { ClassService } from './class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entity/class.entity';
import { ClassController } from './class.controller';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, User])],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}