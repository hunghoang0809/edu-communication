import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Edu Communication API')
    .setDescription('The Edu Communication API description')
    .setVersion('1.0')
    .addTag('edu-communication')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  console.log('Server is running on http://localhost:3099/api');
  await app.listen(3099);
}
bootstrap();
