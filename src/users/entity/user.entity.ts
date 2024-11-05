import { Entity } from 'typeorm';
import { ShareEntity } from '../../base.entity';

@Entity('users')
export class UserEntity extends ShareEntity {
  email: string;
  firstName: string;
  password: string;
}
