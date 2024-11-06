import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  phone: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column()
  role: string;
}
