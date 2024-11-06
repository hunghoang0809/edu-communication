import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { InitDataService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [InitDataService],
  exports: [InitDataService],
})
export class SeederModule {}