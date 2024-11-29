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
    const teacher = await this.userRepository.findOne({
      where: { role: Role.TEACHER, id: id },
      relations: ['subject', 'classes']
    });
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
    const teacher = await this.userRepository.findOne({
      where: { role: Role.TEACHER, id: id },
      relations: ['classes', 'subject'],
    });

    if (!teacher) {
      throw new NotFoundException("Giáo viên không tồn tại");
    }

    if (!teacher.subject) {
      throw new BadRequestException("Cập nhật môn học cho giáo viên trước khi phân công lớp");
    }

    // Nếu không truyền `classIds` hoặc mảng rỗng, xóa toàn bộ các lớp hiện tại
    if (!req.classIds || req.classIds.length === 0) {
      teacher.classes = []; // Xóa toàn bộ các lớp
      await this.userRepository.save(teacher); // Lưu thay đổi

      return {
        statusCode: 200,
        message: "Đã xóa toàn bộ lớp học của giáo viên",
        data: null,
        totalCount: null,
      };
    }

    // Tìm các lớp được truyền lên
    const classes = await this.classRepository.find({
      where: { id: In(req.classIds) },
      relations: ['user', 'user.subject'],
    });

    // Kiểm tra các lớp có tồn tại hay không
    if (classes.length !== req.classIds.length) {
      const foundClassIds = classes.map(classObj => classObj.id);
      const missingClassIds = req.classIds.filter(id => !foundClassIds.includes(id));

      throw new BadRequestException(`Lớp học với các ID ${missingClassIds.join(', ')} không tồn tại`);
    }

    // Xóa các lớp cũ không nằm trong danh sách `req.classIds`
    teacher.classes = teacher.classes.filter(cls => req.classIds.includes(cls.id));

    // Kiểm tra và thêm giáo viên vào các lớp mới
    for (const classObj of classes) {
      // Kiểm tra nếu lớp đã có giáo viên phụ trách cùng môn học
      for (const existingTeacher of classObj.user) {
        if (
          existingTeacher.role === Role.TEACHER &&
          existingTeacher.subject &&
          existingTeacher.subject.id === teacher.subject.id &&
          existingTeacher.id !== teacher.id
        ) {
          throw new BadRequestException(
            `Lớp ${classObj.name} đã có giáo viên khác phụ trách môn ${teacher.subject.name}`
          );
        }
      }

      // Thêm giáo viên vào lớp nếu chưa có
      if (!classObj.user.some(user => user.id === teacher.id)) {
        classObj.user.push(teacher);
      }
    }

    // Cập nhật danh sách lớp mới
    teacher.classes = [...teacher.classes, ...classes];

    // Lưu thay đổi
    await this.userRepository.save(teacher);
    await this.classRepository.save(classes);

    return {
      statusCode: 200,
      message: "Cập nhật lớp học của giáo viên thành công",
      data: null,
      totalCount: null,
    };
  }



  async listStudentsInClass(teacherId: number, classId: number) {
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, role: Role.TEACHER },
      relations: ['subject'],
    });
    if (!teacher) {
      throw new NotFoundException('Giáo viên không tồn tại');
    }

    if (!teacher.subject) {
      throw new BadRequestException('Giáo viên chưa được phân môn học');
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['user'],
    });
    if (!classEntity) {
      throw new NotFoundException('Lớp học không tồn tại');
    }

    const teacherOfClass = classEntity.user.find(
      (user) => user.id === teacherId && user.role === Role.TEACHER
    );

    if (!teacherOfClass) {
      throw new BadRequestException('Giáo viên không được phân công cho lớp này');
    }

    const students = classEntity.user.filter((user) => user.role === Role.STUDENT);

    if (students.length === 0) {
      return {
        statusCode: 200,
        message: 'Không có học sinh nào trong lớp này',
        data: [],
        totalCount: 0,
      };
    }

    const studentGrades = await Promise.all(
      students.map(async (student) => {
        const grade = await this.gradeRepository.findOne({
          where: {
            user: { id: student.id },
            class: classEntity.name,
            subject: teacher.subject.name,
          },
        });

        return {
          studentId: student.id,
          name: student.fullName,
          grade: grade
            ? {
              scoreFactor1: grade.scoreFactor1,
              scoreFactor2: grade.scoreFactor2,
              scoreFactor3: grade.scoreFactor3,
              averageScore: grade.averageScore,
            }
            : null,
        };
      })
    );

    return {
      statusCode: 200,
      message: 'Danh sách học sinh và điểm theo môn học',
      data: studentGrades,
      totalCount: studentGrades.length,
    };
  }


  async upsertGrades(teacherId: number, addGradeDto: AddGradeDto) {
    const { addGrade } = addGradeDto;

    if (!addGrade || addGrade.length === 0) {
      throw new BadRequestException('Danh sách điểm không được để trống');
    }

    const gradesToSave: Grade[] = [];

    for (const gradeDto of addGrade) {
      const student = await this.userRepository.findOne({
        where: { id: gradeDto.userId, role: Role.STUDENT },
      });

      if (!student) {
        throw new BadRequestException(`Học sinh ID ${gradeDto.userId} không tồn tại`);
      }


      const classExists = await this.classRepository.findOne({
        where: { id: gradeDto.classId },
        relations: ['user', 'user.subject'],
      });

      if (!classExists) {
        throw new BadRequestException(`Lớp học ID ${gradeDto.classId} không tồn tại`);
      }


      const teacherOfClass = classExists.user.find(
        (user) => user.id === teacherId && user.role === Role.TEACHER,
      );

      if (!teacherOfClass) {
        throw new BadRequestException(`Bạn không có quyền nhập điểm cho lớp ID ${gradeDto.classId}`);
      }

      if (!teacherOfClass.subject || !teacherOfClass.subject.name) {
        throw new BadRequestException('Giáo viên chưa có môn học, không thể nhập điểm');
      }


      const existingGrade = await this.gradeRepository.findOne({
        where: {
          user: { id: student.id },
          class: String(classExists.name), // Ép kiểu thành chuỗi
          subject: String(teacherOfClass.subject.name),
        },
      });

      if (existingGrade) {

        existingGrade.scoreFactor1 = gradeDto.scoreFactor1;
        existingGrade.scoreFactor2 = gradeDto.scoreFactor2;
        existingGrade.scoreFactor3 = gradeDto.scoreFactor3;


        if (
          existingGrade.scoreFactor1 !== null &&
          existingGrade.scoreFactor2 !== null &&
          existingGrade.scoreFactor3 !== null
        ) {
          existingGrade.averageScore =
            (existingGrade.scoreFactor1 +
              existingGrade.scoreFactor2 * 2 +
              existingGrade.scoreFactor3 * 3) /
            6;
        } else {
          existingGrade.averageScore = null;
        }


        await this.gradeRepository.save(existingGrade);
      } else if (
        gradeDto.scoreFactor1 !== undefined ||
        gradeDto.scoreFactor2 !== undefined ||
        gradeDto.scoreFactor3 !== undefined
      ) {

        const grade = new Grade();
        grade.user = student;
        grade.scoreFactor1 = gradeDto.scoreFactor1;
        grade.scoreFactor2 = gradeDto.scoreFactor2;
        grade.scoreFactor3 = gradeDto.scoreFactor3;
        grade.subject = teacherOfClass.subject.name;
        grade.class = classExists.name;
        grade.schoolYear = classExists.schoolYear;


        if (
          gradeDto.scoreFactor1 !== null &&
          gradeDto.scoreFactor2 !== null &&
          gradeDto.scoreFactor3 !== null
        ) {
          grade.averageScore =
            (gradeDto.scoreFactor1 +
              gradeDto.scoreFactor2 * 2 +
              gradeDto.scoreFactor3 * 3) /
            6;
        } else {
          grade.averageScore = null;
        }

        gradesToSave.push(grade);
      }
    }

    if (gradesToSave.length > 0) {
      await this.gradeRepository.save(gradesToSave);
    }

    return {
      statusCode: 200,
      message: 'Nhập điểm thành công',
      total: gradesToSave.length,
    };
  }

}



  export default TeachersService;
