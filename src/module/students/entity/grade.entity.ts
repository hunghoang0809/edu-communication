import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { Class } from "../../classes/entity/class.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { User } from "../../users/entity/user.entity";

@Entity()
export class Grade extends BaseEntity {
  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @ManyToOne(() => User, (student) => student.grades)
  user: User;

  @ManyToOne(() => Subject, (subject) => subject.grades )
  subject: Subject;

  @ManyToOne(() => Class, (classEntity) => classEntity.id)
  class: Class;
}