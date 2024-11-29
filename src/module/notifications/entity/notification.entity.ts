
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from "../../../base.entity";
import { User } from "../../users/entity/user.entity";

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => User, (user) => user.notificationsSent, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.notificationsReceived, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
