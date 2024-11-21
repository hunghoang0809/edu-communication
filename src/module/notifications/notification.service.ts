import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
    const { recipientId, title, content } = rq;

    // Kiểm tra người nhận
    const recipient = await this.userRepository.findOne({ where: { id: recipientId } });
    if (!recipient) {
      throw new NotFoundException(`Người nhận với ID ${recipientId} không tồn tại.`);
    }

    // Kiểm tra người gửi
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Người gửi với ID ${senderId} không tồn tại.`);
    }

    // Tạo thông báo

    const notification = this.notificationRepository.create({
      title,
      content,
      sender,
      recipient,
    });

    // Lưu thông báo vào cơ sở dữ liệu
    await this.notificationRepository.save(notification);

    return {
      statusCode: 201,
      message: 'Tạo thông báo thành công.',
      data: notification,
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

    return {
      statusCode: 200,
      message: 'Lấy danh sách thông báo thành công.',
      data: notifications,
    };
  }



}