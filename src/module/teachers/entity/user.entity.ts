import { Column, Entity } from 'typeorm';
import { ShareEntity } from '../../../base.entity';

@Entity('users')
export class UserEntity extends ShareEntity {
  @Column()
  phone: string;
  @Column()
  password: string;
  @Column()
  role: string;
}
