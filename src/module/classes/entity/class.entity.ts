import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from "../../../base.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { User } from "../../users/entity/user.entity";
import { GradeLevel } from '../grade.enum';


@Entity()
export class Class extends BaseEntity {
  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @Column({
    type: 'enum',
    enum: GradeLevel,
    nullable: false,
  })
  gradeLevel: GradeLevel;

  @ManyToMany(() => User, (user) => user.classes)
  @JoinTable()
  user: User[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'homeroom_teacher_id' })
  homeroomTeacher: User| null;

}
