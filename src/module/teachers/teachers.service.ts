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
import AddGradeDto from "./dto/addGrade.dto";
import { Grade } from "../students/entity/grade.entity";

@Injectable()
class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
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
    if (!teacher.subject){
      throw new BadRequestException("Cập nhập môn học cho giáo viên trước khi phân công lớp")
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


  async upsertGrades(teacherId: number, addGradeDto: AddGradeDto) {
    const { addToUserDto } = addGradeDto;

    if (!addToUserDto || addToUserDto.length === 0) {
      throw new BadRequestException('Danh sách điểm không được để trống');
    }

    const gradesToSave: Grade[] = [];
    const gradesToRemove: Grade[] = [];

    for (const addGradeToUser of addToUserDto) {
      const student = await this.userRepository.findOne({ where: { id: addGradeToUser.userId, role: Role.STUDENT } });

      if (!student) {
        throw new BadRequestException(`Học sinh ID ${addGradeToUser.userId} không tồn tại`);
      }

      for (const gradeDto of addGradeToUser.addGrade) {
        const classExists = await this.classRepository.findOne({
          where: { id: gradeDto.classId },
          relations: ['users', 'users.subject'],
        });

        if (!classExists) {
          throw new BadRequestException(`Lớp học ID ${gradeDto.classId} không tồn tại`);
        }

        // Kiểm tra giáo viên có quyền
        const teacherOfClass = classExists.user.find(
          (user) => user.id === teacherId && user.role === Role.TEACHER,
        );

        if (!teacherOfClass) {
          throw new BadRequestException(`Bạn không có quyền nhập điểm cho lớp ID ${gradeDto.classId}`);
        }

        if (!teacherOfClass.subject || !teacherOfClass.subject.name) {
          throw new BadRequestException('Giáo viên chưa có môn học, không thể nhập điểm');
        }

        // Kiểm tra điểm của học sinh đã tồn tại chưa
        const existingGrade = await this.gradeRepository.findOne({
          where: { user: student, class: String(gradeDto.classId), subject: teacherOfClass.subject.name },
        });

        if (existingGrade) {
          // Nếu đã có điểm thì cập nhật
          existingGrade.scoreFactor1 = gradeDto.scoreFactor1;
          existingGrade.scoreFactor2 = gradeDto.scoreFactor2;
          existingGrade.scoreFactor3 = gradeDto.scoreFactor3;

          await this.gradeRepository.save(existingGrade);
        } else if (gradeDto.scoreFactor1 || gradeDto.scoreFactor2 || gradeDto.scoreFactor3) {
          const grade = new Grade();
          grade.user = student;
          grade.scoreFactor1 = gradeDto.scoreFactor1;
          grade.scoreFactor2 = gradeDto.scoreFactor2;
          grade.scoreFactor3 = gradeDto.scoreFactor3;
          grade.subject = teacherOfClass.subject.name;
          grade.class = classExists.name;
          grade.schoolYear = classExists.schoolYear;

          gradesToSave.push(grade);  // Thêm vào danh sách lưu
        } else {
          // Nếu không có điểm và không truyền điểm mới, xóa điểm cũ
          if (existingGrade) {
            gradesToRemove.push(existingGrade);  // Thêm vào danh sách xóa
          }
        }
      }
    }

    if (gradesToSave.length > 0) {
      await this.gradeRepository.save(gradesToSave);
    }

    if (gradesToRemove.length > 0) {
      await this.gradeRepository.remove(gradesToRemove);
    }

    return {
      statusCode: 200,
      message: 'Nhap diem thanh cong',
      total: gradesToSave.length + gradesToRemove.length,
    };
  }





}

export default TeachersService;
