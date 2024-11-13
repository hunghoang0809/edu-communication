import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import createTeacherDto, { CreateTeacherDto } from "./dto/createTeacher.dto";
import { LoginDto } from "../authentication/dto/Login.dto";
import { User } from "../users/entity/user.entity";
import { Role } from "../users/enum/role.enum";
import { FilterUserDto } from "../users/dto/filterUser.dto";
import { updateFilterPagination } from "../../query";
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async getProfile(id: number) {
    const teacher = await this.userRepository.findOne({ where: { role: Role.TEACHER, id: id } });
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
    await this.userRepository.update(id, req);
    return {
      statusCode: 200,
      message: "Cập nhật thông tin giáo viên thành công",
      data: null,
      totalCount: null,
    }
  }


}

export default TeachersService;
