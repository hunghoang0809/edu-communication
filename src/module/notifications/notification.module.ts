import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { TeachersController } from "../teachers/teachers.controller";
import TeachersService from "../teachers/teachers.service";
import { Notification } from "./entity/notification.entity";
import { NotificationService } from "./notification.service";



@Module({
  imports: [TypeOrmModule.forFeature([User,  Notification])],
  controllers:[],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class TeachersModule {}
