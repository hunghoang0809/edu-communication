import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Teacher } from "./entity/teacher.entity";
import createTeacherDto, { CreateTeacherDto } from "./dto/createTeacher.dto";
import { LoginDto } from "../authentication/dto/Login.dto";

@Injectable()
class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(req: CreateTeacherDto) {
    this.teacherRepository.create({...req})
    return {
      message: "Tạo giáo viên thành công"
    }
  }
}





export default TeachersService;
