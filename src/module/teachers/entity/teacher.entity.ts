import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { User } from '../../users/entity/user.entity';
import { Subject } from "../../subjects/entity/subject.entity";
import { Class } from "../../classes/entity/class.entity";

@Entity('teachers')
export class Teacher extends BaseEntity {
  @Column()
  name: string;
  @Column()
  email: string;
  @OneToOne(() => User, (user) => user.teacher)
  @JoinColumn()
  user: User;
  @ManyToOne(() => Subject, (subject) => subject.teachers)
  subject: Subject;
  @OneToMany(() => Class, (classes ) =>classes.teacher)
  classes: Class[];
}
