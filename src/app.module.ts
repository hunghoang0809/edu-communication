import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './module/database/database.module';
import { AuthModule } from './module/authentication/auth.module';
import { UsersModule } from './module/users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { InitDataService } from './module/seeder/seeder.service';
import { SeederModule } from './module/seeder/seeder.module';
import { TeachersModule } from "./module/teachers/teachers.module";
import { SubjectsModule } from "./module/subjects/subjects.module";
import { StudentsModule } from "./module/students/students.module";
import { ClassModule } from "./module/classes/class.module";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), DatabaseModule, AuthModule, UsersModule, SeederModule, TeachersModule, SubjectsModule, StudentsModule, ClassModule],
  controllers: [],
  providers: [{provide: APP_INTERCEPTOR, useClass: ResponseInterceptor}],
})
export class AppModule {}
