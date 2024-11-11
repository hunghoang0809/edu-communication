import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/createUser.dto';
import { FilterUserDto } from "./dto/filterUser.dto";
import * as bcrypt from "bcrypt";
import {updateFilterPagination} from "../../query";
import { classToPlain } from "class-transformer";

@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(req: CreateUserDto){
    const user = await this.userRepository.findOne({where:[
        {phone: req.phone},
        {username: req.username}
      ]})
    if(user){
      throw new BadRequestException("Tên đăng nhập hoặc số điện thoại đã tồn tại")
    }
    let {password, ...res } = req
    const pass =await bcrypt.hash(password, 14)
    const newUser = this.userRepository.create({ password: pass, ...res }); // Create the entity instance
    await this.userRepository.save(newUser);
    return {
      statusCode: 200,
      message: "Tạo thành công người dùng",
      data: null,  // Include the created user data in the response
      totalCount: null
    }
  }


  async list(req: FilterUserDto){
     let filter = await updateFilterPagination(req)
    const whereCondition =req.keyword
      ? [
        { phone: Like(`%${req.keyword}%`) },
        { username: Like(`%${req.keyword}%`) }
      ]
      : [];
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

  async update(id: number, request: CreateUserDto){
    const user = await this.userRepository.update(id, request)
    if(!user){
      throw new NotFoundException("")
    }
   return {
      statusCode: 200,
     message: "Cập nhật người dùng thành công",
     data: null,
   }
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
