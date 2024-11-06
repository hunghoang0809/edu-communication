import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  phone: string;
  @Column()
  password: string;
  @Column()
  role: string;
}
