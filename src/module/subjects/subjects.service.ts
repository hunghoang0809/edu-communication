import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entity/subject.entity';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { User } from '../users/entity/user.entity';
import { AddSubjectToTeacherDto } from './dto/addSubjectToTeacher.dto';


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


  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subjectExists = await this.checkIfSubjectExists(createSubjectDto.name);
    if (subjectExists) {
      throw new ConflictException('Subject with this name already exists.');
    }
    const newSubject = this.subjectRepository.create(createSubjectDto);
    return await this.subjectRepository.save(newSubject);
  }

  // Lấy tất cả môn học
  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  // Lấy môn học theo ID
  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOneById(id);
    if (!subject) {
      throw new Error('Không tìm thấy môn học');
    }
    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subjectExists = await this.checkIfSubjectExists(updateSubjectDto.name);
    if (subjectExists) {
      throw new ConflictException('Môn học này đã tồn tại');
    }

    await this.subjectRepository.update(id, updateSubjectDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
  }

  async addSubjectToTeacher(
    addSubjectToTeacherDto: AddSubjectToTeacherDto,
  ): Promise<User> {
    const teacher = await this.userRepository.findOne({
      where: { id: addSubjectToTeacherDto.teacherId, role: 'TEACHER' },
      relations: ['subject'],
    });

    if (!teacher) {
      throw new NotFoundException('Không tìm thâý giáo viên');
    }

    if (teacher.subject) {
      throw new ConflictException('Giáo viên đã đăng kí dạy môn học này');
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: addSubjectToTeacherDto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    teacher.subject = subject;
    await this.userRepository.save(teacher);
    return teacher;
  }
}
