import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AdminService } from './user/admin.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Student Enrollment API')
    .setDescription('API for managing students, courses, and enrollments')
    .setVersion('1.0')
    .addTag('students')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip out properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
    }),
  );
  const adminService = app.get(AdminService);
  adminService.createSuperAdmin();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
