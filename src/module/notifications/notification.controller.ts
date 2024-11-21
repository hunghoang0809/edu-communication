import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../../utils/guard/jwt.guard";
import { RolesGuard } from "../../utils/guard/role.guard";
import { CreateSubjectDto } from "../subjects/dto/createSubject.dto";
import { SendNotificationDto } from "./dto/creatNoti.dto";
import { User } from "../../utils/decorator/user.decorator";
import { Roles } from "../../utils/decorator/role.decorator";

@Controller("notifications")
@ApiTags("Notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("send")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async create(@Body() req: SendNotificationDto, @User('id') userId: number) {
    return this.notificationService.createNotification(req, userId);
  }

  @Get("")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async findAll(@User('id') userId: number) {
    return this.notificationService.getNotificationsByRecipient(userId);
  }

}