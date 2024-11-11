import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Teacher } from '../../teachers/entity/teacher.entity';
import { Exclude } from "class-transformer";

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  phone: string;
  @Column({ unique: true })
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  role: string;
  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;
}
