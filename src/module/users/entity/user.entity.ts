import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { Teacher } from '../../teachers/entity/teacher.entity';
import { Exclude } from "class-transformer";
import { Student } from "../../students/entity/student.entity";
import { Role } from "../enum/role.enum";

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true })
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column({default: Role.ADMIN})
  role: string;
  @OneToOne(() => Teacher, (teacher) => teacher.user)
  @JoinColumn()
  teacher: Teacher;
  @OneToOne(() => Student, (student) => student.user)
  @JoinColumn()
  student: Student;
}
