import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Class } from './entity/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/udpateClass.dto';
import { User } from '../users/entity/user.entity';
import { Role } from '../users/enum/role.enum';
import { AddStudentsToClassDto } from './dto/addStudents.dto';
import { FilterUserDto } from '../users/dto/filterUser.dto';
import { FilterClassDto } from './dto/filterClass.dto';
import { updateFilterPagination } from '../../query';
import { classToPlain } from 'class-transformer';
import { AddTeachersDto } from './dto/addTeachers.dto';
import { Subject } from '../subjects/entity/subject.entity';

@Injectable()
export class ClassService {
    constructor(
      @InjectRepository(Class)
      private readonly classRepository: Repository<Class>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(Subject)
      private readonly subjectRepository: Repository<Subject>,
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

    async addTeachersToClass(req: AddTeachersDto): Promise<any> {
        const { teachers, classId, isDelete } = req;

        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
            relations: ['user', 'subjects'],
        });

        if (!classEntity) {
            throw new NotFoundException(`Lớp học với ID ${classId} không tồn tại`);
        }

        for (const teacherDto of teachers) {
            const teacher = await this.userRepository.findOne({
                where: { id: teacherDto.teacherId, role: Role.TEACHER },
                relations: ['subject', 'classes'],
            });

            if (!teacher) {
                throw new BadRequestException(
                  `Người dùng với ID ${teacherDto.teacherId} không phải là giáo viên hoặc không tồn tại`
                );
            }

            const subject = await this.subjectRepository.findOne({
                where: { id: teacherDto.subjectId },
            });

            if (!subject) {
                throw new NotFoundException(`Môn học với ID ${teacherDto.subjectId} không tồn tại`);
            }

            const existingTeacher = classEntity.user.find(
              (user) =>
                user.id === teacherDto.teacherId &&
                user.subject.id === teacherDto.subjectId
            );

            if (existingTeacher && !isDelete) {
                throw new BadRequestException(
                  `Giáo viên với ID ${teacherDto.teacherId} đã được gán vào lớp học này với môn học này`
                );
            }

            if (isDelete) {
                classEntity.user = classEntity.user.filter(
                  (user) => user.id !== teacherDto.teacherId
                );
                classEntity.subjects = classEntity.subjects.filter(
                  (sub) => sub.id !== teacherDto.subjectId
                );
            } else {
                classEntity.user.push(teacher);
                if (!classEntity.subjects.find((sub) => sub.id === subject.id)) {
                    classEntity.subjects.push(subject);
                }
            }
        }

        await this.classRepository.save(classEntity);

        return {
            statusCode: 200,
            message: isDelete
              ? 'Xóa giáo viên và môn học khỏi lớp học thành công'
              : 'Thêm giáo viên và môn học vào lớp học thành công',
            data: null,
        };
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