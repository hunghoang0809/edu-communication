import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { CreateUserDto } from './dto/createUser.dto';

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
    this.userRepository.create({...req})
    return {
      messsage: "Tạo thành công người dùng"
    }
  }

  async list(){
    const users = await this.userRepository.find();
    return {
      data: users
    };
  }

}

export default UsersService;
