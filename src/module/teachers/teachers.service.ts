import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from 'typeorm';
import  { CreateTeacherDto } from "./dto/createTeacher.dto";
import { User } from "../users/entity/user.entity";
import { Role } from "../users/enum/role.enum";
import { classToPlain } from 'class-transformer';
import { Class } from '../classes/entity/class.entity';
import { Subject } from '../subjects/entity/subject.entity';
import AddTeacherClassDto from './dto/addTeacherClass.dto';

@Injectable()
class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {
  }

  async getProfile(id: number) {
    const teacher = await this.userRepository.findOne({ where: { role: Role.TEACHER, id: id }, relations: ['subject', 'classes'] });
    if (!teacher) {
      throw new NotFoundException("Giáo viên không tồn tại");
    }
    return {
      data: classToPlain(teacher),
    }
  }

  async updateProfile(id: number, req: CreateTeacherDto) {
    const teacher = await this.userRepository.findOne({ where: { role: Role.TEACHER, id: id } });
    if (!teacher) {
      throw new NotFoundException("Giáo viên không tồn tại");
    }
    const subject = await this.subjectRepository.findOneById(req.subjectId);
    if (!subject) {
      throw new BadRequestException("Môn học không tồn tại");
    }
    teacher.subject = subject;
    teacher.fullName = req.name;
    teacher.email = req.email;
    teacher.phone = req.phone;
    await this.userRepository.save(teacher);
    return {
      statusCode: 200,
      message: "Cập nhật thông tin giáo viên thành công",
      data: null,
      totalCount: null,
    }
  }

  async addTeacherToClass(id: number, req: AddTeacherClassDto) {
    // Fetch the teacher (single object)
    const teacher = await this.userRepository.findOne({
      where: { role: Role.TEACHER, id: id },
      relations: ['classes','subject'],  // Include classes and their subjects
    });

    if (!teacher) {
      throw new NotFoundException("Giáo viên không tồn tại");
    }

    // Fetch the classes by IDs
    const classes = await this.classRepository.find({
      where: {
        id: In(req.classIds),
      },
      relations: ['user', 'user.subject'],
    });

    if (classes.length !== req.classIds.length) {
      // Find out which class IDs are missing
      const foundClassIds = classes.map(classObj => classObj.id);
      const missingClassIds = req.classIds.filter(id => !foundClassIds.includes(id));

      // Throw error if any classId is missing
      throw new BadRequestException(`Lớp học với các ID ${missingClassIds.join(', ')} không tồn tại`);
    }
    for (const classObj of classes) {
      for (const existingTeacher of classObj.user) {
        // Check if the existing teacher has a subject and if the role is 'teacher'
        if (existingTeacher.role === Role.TEACHER && existingTeacher.subject && existingTeacher.subject.id === teacher.subject.id) {
          if (existingTeacher.id == teacher.id) {
            throw new BadRequestException(`Lớp ${classObj.name} đã có giáo viên phụ trách môn ${teacher.subject.name}`);
          }
        }
      }
    }

    teacher.classes = [...teacher.classes, ...classes];
    for (const classObj of classes) {
      classObj.user.push(teacher);  // Add teacher to class
    }

    // Save the updated teacher
    await this.userRepository.save(teacher);
    await this.classRepository.save(classes);

    return {
      statusCode: 200,
      message: "Thêm giáo viên vào lớp học thành công",
      data: null,
      totalCount: null,
    };
  }




}

export default TeachersService;
