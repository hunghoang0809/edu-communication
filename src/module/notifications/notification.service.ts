import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from 'typeorm';
import { Subject } from "rxjs";
import { User } from "../users/entity/user.entity";
import { SendNotificationDto } from "./dto/creatNoti.dto";
import { Notification } from "./entity/notification.entity";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async createNotification(rq: SendNotificationDto, senderId: number): Promise<any> {
    const { recipientIds, title, content } = rq;


    if (!recipientIds || recipientIds.length === 0) {
      throw new BadRequestException('Danh sách người nhận không được để trống.');
    }

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Người gửi với ID ${senderId} không tồn tại.`);
    }

    const recipients = await this.userRepository.find({
      where: { id: In(recipientIds) },
    });

    if (recipients.length !== recipientIds.length) {
      throw new NotFoundException('Một số người nhận không tồn tại.');
    }

    const notifications = recipients.map((recipient) => {
      return this.notificationRepository.create({
        title,
        content,
        sender,
        recipient,
      });
    });

    await this.notificationRepository.save(notifications);

    return {
      statusCode: 201,
      message: 'Tạo thông báo thành công.',
      data: null,
    };
  }


  async getNotificationsByRecipient(recipientId: number): Promise<any> {

    const recipient = await this.userRepository.findOne({ where: { id: recipientId } });
    if (!recipient) {
      throw new NotFoundException(`Người nhận với ID ${recipientId} không tồn tại.`);
    }


    const notifications = await this.notificationRepository.find({
      where: { recipient: { id: recipientId } },
      order: { createdAt: 'DESC' },
      relations: ['sender'],
    });
    const response = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      senderId: notification.sender.id,
    }));

    return {
      statusCode: 200,
      message: 'Lấy danh sách thông báo thành công.',
      data: response,
    };
  }



}