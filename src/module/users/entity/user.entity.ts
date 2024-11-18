import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { Exclude } from "class-transformer";
import { Role } from "../enum/role.enum";
import { Class } from "../../classes/entity/class.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { Grade } from "../../students/entity/grade.entity";

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
  @Column({nullable: true})
  fullName: string;
  @Column({nullable: true})
  email: string;
  @ManyToMany(() => Class, (classes ) => classes.user)
  classes: Class[];
  @ManyToOne(() => Subject, (subject) => subject.users)
  subject: Subject;
  @OneToMany(() => Grade, (grade ) => grade.user)
  grades: Grade[];
  @Column({nullable: true})
  birthDate: Date;
  @OneToOne(() => Class, (classEntity) => classEntity.homeroomTeacher)
  homeroomClass: Class;
}
