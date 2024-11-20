import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
class StudentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async profile(id :number){
    const student = await this.userRepository.findOne({where:{id:id}, relations:['grades','classes'] });
    return {
      data: student,
    };

  }
}


export default StudentsService;
