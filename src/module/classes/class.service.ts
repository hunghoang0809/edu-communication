import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Class } from './entity/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/udpateClass.dto';
import { User } from '../users/entity/user.entity';
import { Role } from '../users/enum/role.enum';
import { AddStudentsToClassDto } from './dto/AddStudents.dto';

@Injectable()
export class ClassService {
    constructor(
      @InjectRepository(Class)
      private readonly classRepository: Repository<Class>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Class[]> {
        return this.classRepository.find({ relations: ['user', 'subjects'] });
    }

    async findOne(id: number): Promise<Class> {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['user', 'subjects'],
        });
        if (!classEntity) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return classEntity;
    }

    async create(createClassDto: CreateClassDto): Promise<any> {
        const existingClass = await this.classRepository.findOne({
            where: {
                name: createClassDto.name,
                schoolYear: createClassDto.schoolYear,
                gradeLevel: createClassDto.gradeLevel,
            },
        });

        if (existingClass) {
            throw new BadRequestException('Lớp học này đã tồn tại trong khối học và năm học này.');
        }


        const newClass = this.classRepository.create(createClassDto);
        this.classRepository.save(newClass);
        return {
            statusCode: 200,
            message: "Tạo lớp học thành công",
            data: null,
            totalCount: null
         }
    }

    async update(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
        await this.classRepository.update(id, updateClassDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.classRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
    }

    async addTeacherToClass(classId: number, userId: number): Promise<Class> {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
            relations: ['user'],
        });
        const teacher = await this.userRepository.findOne({ where: { id: userId, role:Role.TEACHER } });

        if (!classEntity || !teacher) {
            throw new Error('Class or teacher not found');
        }

        classEntity.user.push(teacher);
        return await this.classRepository.save(classEntity);
    }


    async addStudentsToClass(classId: number, addStudentsToClassDto: AddStudentsToClassDto) {
        const classEntity = await this.classRepository.findOne({ where: { id: classId }, relations: ['students'] });

        if (!classEntity) {
            throw new NotFoundException(`Class with ID ${classId} not found`);
        }

        const students = await this.userRepository.find({
            where: {
                id: In(addStudentsToClassDto.studentIds),
                role: Role.STUDENT,
            },
            relations: ['classes'],
        });
        if (students.length !== addStudentsToClassDto.studentIds.length) {
            throw new NotFoundException('Some students not found');
        }

        for (const student of students) {
            if (student.classes.length > 0) {
                throw new BadRequestException(`Student with ID ${student.id} is already assigned to another class`);
            }
        }


        classEntity.user = [...classEntity.user, ...students.filter(student => !classEntity.user.includes(student))];

        await this.classRepository.save(classEntity);
        return classEntity;
    }


}