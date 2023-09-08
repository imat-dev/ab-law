import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FallbackExceptionFilter } from 'src/filter/fallback.filter';
import { HttpExceptionFilter } from 'src/filter/http.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new FallbackExceptionFilter, new HttpExceptionFilter);
  await app.listen(3000);
}
bootstrap();
