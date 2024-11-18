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
              .leftJoinAndSelect('class.user', 'user')
              .where('user.id = :userId', { userId: filter.userId })
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
        return {
            data: {
                ...classEntity,
               user: classToPlain(students),
                homeroomTeacher: classEntity.homeroomTeacher ? classEntity.homeroomTeacher.id : null,
            }
        };
    }

    async create(req: CreateClassDto): Promise<any> {
        const { name, schoolYear, studentIds, gradeLevel, teacherId } = req;

        // Kiểm tra lớp học đã tồn tại
        const existingClass = await this.classRepository.findOne({
            where: {
                name,
                schoolYear,
                gradeLevel,
            },
            relations: ['user'],
        });

        if (existingClass) {
            throw new BadRequestException('Lớp học này đã tồn tại trong khối học và năm học này.');
        }

        // Lấy danh sách học sinh từ studentIds
        const students = await this.userRepository.find({
            where: { id: In(studentIds), role: Role.STUDENT },
            relations: ['classes'],
        });

        if (students.length !== studentIds.length) {
            throw new NotFoundException('Một số học sinh không tồn tại');
        }

        // Kiểm tra nếu học sinh đã được thêm vào lớp khác trong cùng năm học
        const studentsInOtherClasses = students.filter(
          (student) =>
            student.classes.some((existingClass) => existingClass.schoolYear === schoolYear)
        );

        if (studentsInOtherClasses.length > 0) {
            const studentIds = studentsInOtherClasses.map((student) => student.id).join(', ');
            throw new BadRequestException(`Học sinh với ID ${studentIds} đã được thêm vào lớp khác`);
        }

        // Kiểm tra giáo viên chủ nhiệm
        let homeroomTeacher: User | null = null;
        if (teacherId) {
            homeroomTeacher = await this.userRepository.findOne({
                where: { id: teacherId, role: Role.TEACHER },
                relations: ['homeroomClass'],
            });

            if (!homeroomTeacher) {
                throw new NotFoundException(`Giáo viên chủ nhiệm với ID ${teacherId} không tồn tại`);
            }

            if (homeroomTeacher.homeroomClass) {
                throw new BadRequestException(`Giáo viên với ID ${teacherId} đã là chủ nhiệm lớp khác`);
            }
        }

        // Tạo lớp học mới và thêm danh sách học sinh
        const newClass = this.classRepository.create({ name, schoolYear, gradeLevel });
        newClass.user = students; // Thêm học sinh vào lớp học
        newClass.homeroomTeacher = homeroomTeacher; // Thêm giáo viên chủ nhiệm nếu có

        // Lưu lớp học mới vào cơ sở dữ liệu
        await this.classRepository.save(newClass);

        return {
            statusCode: 200,
            message: 'Tạo lớp học thành công',
            data: newClass,
        };
    }




    async update(id: number, updateClassDto: UpdateClassDto): Promise<any> {
        const { name, schoolYear, studentIds, teacherId } = updateClassDto;

        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['user', 'homeroomTeacher'],
        });

        if (!classEntity) {
            throw new NotFoundException(`Lớp học với ID ${id} không tồn tại`);
        }

        classEntity.name = name;
        classEntity.schoolYear = schoolYear;

        if (studentIds.length === 0) {
            classEntity.user = [];
        } else {
            const students = await this.userRepository.find({
                where: {
                    id: In(studentIds),
                    role: Role.STUDENT,
                },
                relations: ['classes'],
            });

            if (students.length !== studentIds.length) {
                throw new NotFoundException('Một số học sinh không tồn tại');
            }

            const studentsInOtherClasses = students.filter(
              (student) =>
                student.classes.some((existingClass) => existingClass.id !== id)
            );

            if (studentsInOtherClasses.length > 0) {
                const conflictingStudentIds = studentsInOtherClasses.map((student) => student.id).join(', ');
                throw new BadRequestException(`Học sinh với ID ${conflictingStudentIds} đã được thêm vào lớp khác`);
            }

            classEntity.user = students;
        }

        if (teacherId) {
            const teacher = await this.userRepository.findOne({
                where: {
                    id: teacherId,
                    role: Role.TEACHER,
                },
                relations: ['homeroomClass'],
            });

            if (!teacher) {
                throw new NotFoundException(`Giáo viên với ID ${teacherId} không tồn tại`);
            }


            if (teacher.homeroomClass && teacher.homeroomClass.id !== id) {
                throw new BadRequestException(`Giáo viên này đã là giáo viên chủ nhiệm của lớp khác`);
            }


            classEntity.homeroomTeacher = teacher;
        } else {
            classEntity.homeroomTeacher = null;
        }

        await this.classRepository.save(classEntity);

        return {
            statusCode: 200,
            message: 'Cập nhật lớp học thành công',
            data: null,
        };
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



}