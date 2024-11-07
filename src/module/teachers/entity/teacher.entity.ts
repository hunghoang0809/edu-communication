import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { User } from '../../users/entity/user.entity';

@Entity('teachers')
export class Teacher extends BaseEntity {
  @Column()
  name: string;
  @Column()
  email: string;
  @OneToOne(() => User, (user) => user.teacher)
  user: User;
}
