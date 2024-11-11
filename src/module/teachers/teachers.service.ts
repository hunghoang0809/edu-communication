import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import createTeacherDto, { CreateTeacherDto } from "./dto/createTeacher.dto";
import { LoginDto } from "../authentication/dto/Login.dto";
import { User } from "../users/entity/user.entity";
import { Role } from "../users/enum/role.enum";
import { FilterUserDto } from "../users/dto/filterUser.dto";
import { updateFilterPagination } from "../../query";
import { plainToClass } from "class-transformer";

@Injectable()
class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async list(req: FilterUserDto){
    let filter = updateFilterPagination(req)
    const skip = filter.startIndex
    const usersWithTeacherInfo = await this.userRepository.createQueryBuilder('users')
      .leftJoinAndSelect('users.teacher', 'teachers')
      .where('users.role = :role', { role: Role.TEACHER })
      .skip(skip)
      .take(req.pageSize)
      .getMany();
    const sanitizedUsers = plainToClass(User, usersWithTeacherInfo);
    return{
       data: sanitizedUsers,
    }
  }
}





export default TeachersService;
