import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/createUser.dto';
import { FilterUserDto } from "./dto/filterUser.dto";
import * as bcrypt from "bcrypt";
import {updateFilterPagination} from "../../query";
import { classToPlain } from "class-transformer";
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role } from './enum/role.enum';
import { Subject } from '../subjects/entity/subject.entity';


@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(req: CreateUserDto){
    const user = await this.userRepository.findOne({where:[
        {phone: req.phone},
        {username: req.username}
      ]})
    if(user){
      throw new BadRequestException("Tên đăng nhập hoặc số điện thoại đã tồn tại")
    }

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    let {password, ...res } = req
    const pass =await bcrypt.hash(password, 14)
    const newUser = this.userRepository.create({ password: pass, ...res });
    if(req.subjectId && req.role !== Role.TEACHER){
      throw new BadRequestException('Chỉ giáo viên mới được phân công môn học');
    }
    else if (req.role === Role.TEACHER && req.subjectId) {
      const subject = await this.subjectRepository.findOneById(req.subjectId);
      if (!subject) {
        throw new NotFoundException('Môn học không tồn tại');
      }

      newUser.subject = subject;
    }
    await this.userRepository.save(newUser);
    return {
      statusCode: 200,
      message: "Tạo thành công người dùng",
      data: null,
      totalCount: null
    }
  }


  async list(req: FilterUserDto){
     let filter = await updateFilterPagination(req)
    const whereCondition =req.keyword
      ? [
        { phone: Like(`%${req.keyword}%`), role: req.role },
        { username: Like(`%${req.keyword}%`),role: req.role },
      ]
      : [{ role: req.role }];
      const skip = filter.startIndex

    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip,
      take: req.pageSize // Number of records to fetch per page
    });
     const usersWithoutPassword  = users.map(user => classToPlain(user))
    return {
      data: usersWithoutPassword,
      totalCount: total,
    };
  }



  async getById(id: number){
    const user = await this.userRepository.findOne({where:{id}})

    return {
      data: classToPlain(user)
    }
  }

  async update(id: number, request: UpdateUserDto) {
    const { phone, username } = request;

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUserByUsername && existingUserByUsername.id !== id) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại.');
    }

    const existingUserByPhone = await this.userRepository.findOne({
      where: { phone },
    });

    if (existingUserByPhone && existingUserByPhone.id !== id) {
      throw new BadRequestException('Số điện thoại đã tồn tại.');
    }

    const user = await this.userRepository.findOne({ where: { id }, relations: ['subject'] });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    if (user.role === Role.TEACHER && request.subjectId) {
      const subject = await this.subjectRepository.findOneById(request.subjectId);
      if (!subject) {
        throw new NotFoundException('Môn học không tồn tại');
      }

      user.subject = subject;
    }

    Object.assign(user, request);
    await this.userRepository.save(user);

    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      data: user,
    };
  }


async delete(id: number){
    const user = await this.userRepository.delete(id)
  if(!user){
    throw new NotFoundException("Không tồn tại người dùng")
  }
  return {
    statusCode: 200,
    message: "Xóa người dùng thành công",
    data: null,
  }
}

}

export default UsersService;
