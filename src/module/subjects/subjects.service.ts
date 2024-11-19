import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Subject } from './entity/subject.entity';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { User } from '../users/entity/user.entity';
import { AddSubjectToTeacherDto } from './dto/addSubjectToTeacher.dto';
import { Role } from '../users/enum/role.enum';
import { classToPlain } from 'class-transformer';


@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkIfSubjectExists(name: string): Promise<boolean> {
    const subject = await this.subjectRepository.findOne({
      where: { name },
    });
    return !!subject;
  }


  async create(createSubjectDto: CreateSubjectDto): Promise<any> {
    const { name, teacherIds } = createSubjectDto;


    const subjectExists = await this.checkIfSubjectExists(name);
    if (subjectExists) {
      throw new ConflictException('Môn học với tên này đã tồn tại.');
    }


    const newSubject = this.subjectRepository.create({name: name });

    if (teacherIds && teacherIds.length > 0) {
      const teachers = await this.userRepository.find({
        where: { id: In(teacherIds), role: Role.TEACHER },
        relations: ['subject'],
      });


      if (teachers.length !== teacherIds.length) {
        throw new NotFoundException('Một số giáo viên không tồn tại.');
      }


      const teachersWithExistingSubjects = teachers.filter(teacher => teacher.subject);

      if (teachersWithExistingSubjects.length > 0) {
        const teacherIdsWithSubjects = teachersWithExistingSubjects.map(teacher => teacher.id).join(', ');
        throw new ConflictException(`Giáo viên với ID ${teacherIdsWithSubjects} đã được gán dạy môn học khác.`);
      }


      for (const teacher of teachers) {
        teacher.subject = newSubject;

        await this.userRepository.save(teacher);
      }
      newSubject.users = teachers;
    }

    await this.subjectRepository.save(newSubject);
    // Lưu môn học mới vào cơ sở dữ liệu
    return {
      statusCode: 200,
      data: null,
      message: "Thêm môn hoc thành công"
    }
  }



  async findAll(){

    const subjects = await this.subjectRepository.find({relations: ['users']});
    const result = subjects.map(subject => {
      subject.users = subject.users.map(user => classToPlain(user) as User);
      return subject;
    });

    return {
      statusCode: 200,
      data: result,
      message: "Lấy danh sách môn học thành công"
    }
  }

  async findOne(id: number){
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!subject) {
      throw new Error('Không tìm thấy môn học');
    }
    subject.users = subject.users.map(user => classToPlain(user) as User);
    return {
      statusCode: 200,
      data: subject,
      message: "Tìm kiếm môn học thành công"
    };
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const { name, teacherIds } = updateSubjectDto;

    const existingSubject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!existingSubject) {
      throw new NotFoundException('Môn học không tồn tại');
    }

    if (name && name !== existingSubject.name) {
      const subjectExists = await this.checkIfSubjectExists(name);
      if (subjectExists) {
        throw new ConflictException('Môn học này đã tồn tại');
      }
      existingSubject.name = name;
    }

    if (teacherIds && teacherIds.length > 0) {
      // Lấy danh sách giáo viên từ mảng teacherIds
      const teachers = await this.userRepository.find({
        where: {
          id: In(teacherIds),
          role: Role.TEACHER,
        },
      });

      if (teachers.length !== teacherIds.length) {
        throw new BadRequestException('Một số giáo viên không tồn tại');
      }

      // Kiểm tra nếu giáo viên đã được thêm vào môn học khác
      const teachersInOtherSubjects = teachers.filter(
        (teacher) => teacher.subject && teacher.subject.id !== id
      );

      if (teachersInOtherSubjects.length > 0) {
        const teacherIdsInOtherSubjects = teachersInOtherSubjects.map((teacher) => teacher.id).join(', ');
        throw new BadRequestException(`Giáo viên này đã dạy môn học khác`);
      }


      existingSubject.users = teachers;
    } else {

      existingSubject.users = [];
    }

    await this.subjectRepository.save(existingSubject);

    return {
      statusCode: 200,
      message: 'Cập nhật môn học thành công',
      data: existingSubject,
    };
  }


  async remove(id: number) {
    const subject = await this.subjectRepository.findOne({where: {id}});
    if(!subject){
      throw new BadRequestException("Không tìm thấy môn học")
    }
    await this.subjectRepository.remove(subject);
    return {
      statusCode: 200,
      message: "Xóa môn học thành công"
    }
  }

}
