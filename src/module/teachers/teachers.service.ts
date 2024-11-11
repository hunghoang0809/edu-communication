import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Teacher } from "./entity/teacher.entity";
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
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(req: CreateTeacherDto) {
    const user = await this.userRepository.findOne({where:{id:req.userId}});
    if(user){
      if(user.role != Role.TEACHER){
        throw new BadRequestException("Người dùng này không phải giáo viên")
      }
    }
    const findTeacher = await this.teacherRepository.findOne({where:{id:req.userId}});
    if(findTeacher){
      throw new BadRequestException("Người dùng đã đăng kí ")
    }
   const teacher = this.teacherRepository.create(req)
    this.teacherRepository.save(teacher)

    return {
     statusCode: 200,
      message: "Tạo giáo viên thành công",
      data: null,
    }
  }

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
