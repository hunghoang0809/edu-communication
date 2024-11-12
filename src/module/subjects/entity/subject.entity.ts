import { Column, Entity, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { User } from '../../users/entity/user.entity';
import { Class } from "../../classes/entity/class.entity";
import { Grade } from "../../students/entity/grade.entity";

@Entity('subjects')
export class Subject extends BaseEntity {
  @Column()
  name: string;
  @OneToMany(() => User, (user) => user.subject)
  users: User[];
  @ManyToMany(() => Class, (classEntity) => classEntity.subjects)
  classes: Class[];
  @OneToMany(() => Grade, (grade) => grade.subject)
  grades: Grade[];
}
