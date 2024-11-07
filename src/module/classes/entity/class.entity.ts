import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Teacher } from "../../teachers/entity/teacher.entity";
import { BaseEntity } from "../../../base.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { Student } from "../../students/entity/student.entity";


@Entity()
export class Class extends BaseEntity {
  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  teacher: Teacher;

  @ManyToMany(() => Subject, (subject) => subject.classes)
  @JoinTable() // Tạo bảng trung gian giữa Class và Subject
  subjects: Subject[];

  @ManyToMany(() => Student, (student) => student.classes)
  @JoinTable()
  students: Student[];
}
