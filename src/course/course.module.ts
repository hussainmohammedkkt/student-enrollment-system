import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './course.model';
import { EnrollmentSchema } from 'src/enrollment/enrollment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Course',
        schema: CourseSchema,
      },
      {
        name: 'Enrollment',
        schema: EnrollmentSchema,
      },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
