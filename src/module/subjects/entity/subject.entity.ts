import { Column, Entity, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { User } from '../../users/entity/user.entity';
import { Teacher } from "../../teachers/entity/teacher.entity";
import { Class } from "../../classes/entity/class.entity";
import { Grade } from "../../students/entity/student.entity";

@Entity('subjects')
export class Subject extends BaseEntity {
  @Column()
  name: string;
  @OneToMany(() => Teacher, (teacher) => teacher.subject)
  teachers: Teacher[];
  @ManyToMany(() => Class, (classEntity) => classEntity.subjects)
  classes: Class[];
  @OneToMany(() => Grade, (grade) => grade.subject)
  grades: Grade[];

}
