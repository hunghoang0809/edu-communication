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
    // Fetch the teacher (single object)
    const teacher = await this.userRepository.findOne({
      where: { role: Role.TEACHER, id: id },
      relations: ['classes', 'subject'],  // Include classes and their subjects
    });

    if (!teacher) {
      throw new NotFoundException("Giáo viên không tồn tại");
    }
    if (!teacher.subject) {
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
    const { addGrade } = addGradeDto;

    if (!addGrade || addGrade.length === 0) {
      throw new BadRequestException('Danh sách điểm không được để trống');
    }

    const gradesToSave: Grade[] = [];

    for (const gradeDto of addGrade) {
      // Tìm học sinh
      const student = await this.userRepository.findOne({
        where: { id: gradeDto.userId, role: Role.STUDENT },
      });

      if (!student) {
        throw new BadRequestException(`Học sinh ID ${gradeDto.userId} không tồn tại`);
      }

      // Kiểm tra lớp học
      const classExists = await this.classRepository.findOne({
        where: { id: gradeDto.classId },
        relations: ['user', 'user.subject'],
      });

      if (!classExists) {
        throw new BadRequestException(`Lớp học ID ${gradeDto.classId} không tồn tại`);
      }

      // Kiểm tra quyền giáo viên
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
        // Nếu đã có điểm thì cập nhật
        existingGrade.scoreFactor1 = gradeDto.scoreFactor1;
        existingGrade.scoreFactor2 = gradeDto.scoreFactor2;
        existingGrade.scoreFactor3 = gradeDto.scoreFactor3;

        // Tính điểm trung bình nếu đủ 3 đầu điểm
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

        // Lưu bản ghi đã cập nhật
        await this.gradeRepository.save(existingGrade);
      } else if (
        gradeDto.scoreFactor1 !== undefined ||
        gradeDto.scoreFactor2 !== undefined ||
        gradeDto.scoreFactor3 !== undefined
      ) {
        // Chỉ tạo mới nếu không có bản ghi nào tồn tại
        const grade = new Grade();
        grade.user = student;
        grade.scoreFactor1 = gradeDto.scoreFactor1;
        grade.scoreFactor2 = gradeDto.scoreFactor2;
        grade.scoreFactor3 = gradeDto.scoreFactor3;
        grade.subject = teacherOfClass.subject.name;
        grade.class = classExists.name;
        grade.schoolYear = classExists.schoolYear;

        // Tính điểm trung bình nếu đủ 3 đầu điểm
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
          grade.averageScore = null; // Không đủ điểm, trung bình là null
        }

        gradesToSave.push(grade); // Thêm vào danh sách lưu
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
