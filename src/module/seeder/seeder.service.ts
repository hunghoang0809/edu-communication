import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Role } from '../users/enum/role.enum';
import { User } from '../users/entity/user.entity';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InitDataService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      console.log('No users found, adding initial users.');

      const users = [
        {
          username: 'admin',
          password: await bcrypt.hash('123456', 14),
          role: Role.ADMIN,
          phone: '',
        },
      ];
      await this.userRepository.save(users);
      console.log('Initial users have been added.');
    } else {
      console.log('Users already exist, skipping initial data.');

    }
  }
}
