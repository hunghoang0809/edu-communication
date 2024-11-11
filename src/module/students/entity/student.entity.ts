import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { Class } from "../../classes/entity/class.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { User } from "../../users/entity/user.entity";

@Entity('students')
export class Student extends BaseEntity {
  @Column({nullable: false})
  name: string;
  @Column({unique: true})
  student_id: string;
  @ManyToOne(() => Class, (classes) => classes.students)
  classes: Class[];
  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];
  @OneToOne(() => User, (user) => user.student)
  @JoinColumn()
  user: User;
}
@Entity()
export class Grade extends BaseEntity {
  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @ManyToOne(() => Student, (student) => student.grades)
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.grades)
  subject: Subject;

  @ManyToOne(() => Class, (classEntity) => classEntity.id)
  class: Class;
}