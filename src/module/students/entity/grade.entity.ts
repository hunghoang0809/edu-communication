import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from '../../../base.entity';
import { Class } from "../../classes/entity/class.entity";
import { Subject } from "../../subjects/entity/subject.entity";
import { User } from "../../users/entity/user.entity";

@Entity()
export class Grade extends BaseEntity {
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  scoreFactor1: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  scoreFactor2: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  scoreFactor3: number;

  @ManyToOne(() => User, (student) => student.grades)
  user: User;

  @Column()
  subject: string

  @Column()
  class: string
}