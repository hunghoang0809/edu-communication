import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from "../../../base.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { User } from "../../users/entity/user.entity";


@Entity()
export class Class extends BaseEntity {
  @Column()
  name: string;

  @Column()
  schoolYear: string;

  @ManyToMany(() => User, (user) => user.classes)
  @JoinTable()
  user: User[];

  @ManyToMany(() => Subject, (subject) => subject.classes)
  @JoinTable()
  subjects: Subject[];
}
