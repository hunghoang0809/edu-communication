import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Notification } from "./entity/notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationController } from './notification.controller';



@Module({
  imports: [TypeOrmModule.forFeature([User,  Notification])],
  controllers:[NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
