import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Class } from './entity/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/udpateClass.dto';
import { User } from '../users/entity/user.entity';
import { Role } from '../users/enum/role.enum';
import { AddStudentsToClassDto } from './dto/AddStudents.dto';
import { FilterUserDto } from '../users/dto/filterUser.dto';
import { FilterClassDto } from './dto/filterClass.dto';
import { updateFilterPagination } from '../../query';
import { classToPlain } from 'class-transformer';

@Injectable()
export class ClassService {
    constructor(
      @InjectRepository(Class)
      private readonly classRepository: Repository<Class>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

    async findAll(filter: any, userRole: Role) {
        filter = await updateFilterPagination(filter)
        const skip = filter.startIndex
        if (userRole === 'admin') {
            const classes = await this.classRepository.find({
                skip,
                take: filter.pageSize,
            });
            const totalCount = await this.classRepository.count();

            return {
                data: classes,
                totalCount: totalCount
            };
        }else{
            const queryBuilder = this.classRepository.createQueryBuilder('class')
              .leftJoinAndSelect('class.user', 'user') // Thêm mối quan hệ với bảng user
              .where('user.id = :userId', { userId: filter.userId }) // Filter theo userId
              .skip(skip)
              .take(filter.pageSize);
            const classes = await queryBuilder.getMany();
            const totalCount = await queryBuilder.getCount();
            return {
                data: classes,
                totalCount: totalCount
            }
        }


    }

    async findOne(id: number) {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['user','subjects'],
        });
        if (!classEntity) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        const students = classEntity.user.filter((user) => user.role === Role.STUDENT);
        const teachers = classEntity.user.filter((user) => user.role === Role.TEACHER);
        return {
            data: {
                ...classEntity,
               user: classToPlain(students),
                teacher: classToPlain(teachers),
            }
        };
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

    async update(id: number, updateClassDto: UpdateClassDto) {
        await this.classRepository.update(id, updateClassDto);
        return {
            statusCode: 200,
            message: 'Cập nhật lớp học thành công',
            data: null,
            totalCount: null,
        }
    }

    async remove(id: number) {
        const result = await this.classRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return {
            statusCode: 200,
            message: 'Xóa lớp học thành công',
            data: null,
            totalCount: null,
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


    async addStudentsToClass( request: AddStudentsToClassDto) {
        const classEntity = await this.classRepository.findOne({ where: { id: request.classId }, relations: ['user'] });

        if (!classEntity) {
            throw new NotFoundException(`Class with ID ${request.classId} not found`);
        }

        const students = await this.userRepository.find({
            where: {
                id: In(request.studentIds),
                role: Role.STUDENT,
            },
            relations: ['classes'],
        });
        if (students.length !== request.studentIds.length) {
            throw new NotFoundException('Some students not found');
        }

        for (const student of students) {
            if (student.classes.length > 0) {
                throw new BadRequestException(`Student with ID ${student.id} is already assigned to another class`);
            }
        }


        classEntity.user = [...classEntity.user, ...students.filter(student => !classEntity.user.includes(student))];

        await this.classRepository.save(classEntity);
        return {
            statusCode: 200,
            message: 'Thêm học sinh vào lớp học thành công',
            data: null,
            totalCount: null,
        };
    }


}