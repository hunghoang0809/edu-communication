import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity  {
 @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
 })
  id!:  number;

 @CreateDateColumn({
   type: 'timestamp',
   nullable: false,
   name: 'created_at',
 })
  createdAt: Date;

 @UpdateDateColumn({
   type: 'timestamp',
   nullable: false,
   name: 'updated_at',
 })
  updatedAt!: Date;
}