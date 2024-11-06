import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './module/database/database.module';
import { AuthModule } from './module/authentication/auth.module';
import { UsersModule } from './module/users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), DatabaseModule, AuthModule, UsersModule],
  controllers: [],
  providers: [{provide: APP_INTERCEPTOR, useClass: ResponseInterceptor}],
})
export class AppModule {}
