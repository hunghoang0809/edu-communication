import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Teacher } from '../../teachers/entity/teacher.entity';

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
  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;
}
