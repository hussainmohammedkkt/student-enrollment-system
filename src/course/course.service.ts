import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from 'src/enrollment/enrollment.model';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course, CourseStatus } from './course.model';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    @InjectModel('Enrollment')
    private readonly enrollmentModel: Model<Enrollment>,
  ) {}

  async createCourse(createCourse: CreateCourseDto) {
    try {
      const course = new this.courseModel({
        title: createCourse.title,
        description: createCourse.description,
        duration: createCourse.duration,
        price: createCourse.price,
      });
      let result = await course.save();
      return result;
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Course already exists');
      }
      throw e;
    }
  }
  async updateCourse(id: string, updateCourse: UpdateCourseDto) {
    try {
      let result = await this.courseModel
        .updateOne(
          { _id: id },
          {
            $set: {
              ...(updateCourse.title && { title: updateCourse.title }),
              ...(updateCourse.description && {
                description: updateCourse.description,
              }),
              ...(updateCourse.duration && { duration: updateCourse.duration }),
              ...(updateCourse.price && { price: updateCourse.price }),
            },
          },
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Course not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Course not found');
    }
  }
  async getAllCourses(page: number, limit: number) {
    const courses = await this.courseModel
      .find({
        status: { $ne: CourseStatus.DELETED },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    if (!courses) {
      return [];
    }
    return courses;
  }

  async getCourseById(id: string) {
    try {
      const course = await this.courseModel
        .findOne({
          _id: id,
          status: { $ne: CourseStatus.DELETED },
        })
        .exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      throw new NotFoundException('Course not found');
    }
  }

  async deleteCourse(id: string) {
    let checkIfEnrolled = await this.checkIfEnrolled(id);
    if (checkIfEnrolled) {
      throw new ConflictException('Course is already enrolled');
    }
    try {
      let result = await this.courseModel
        .updateOne({ _id: id }, { $set: { status: CourseStatus.DELETED } })
        .exec();
      if (result.modifiedCount === 0) {
        throw new NotFoundException('Course not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Course not found');
    }
  }
  async checkIfEnrolled(course_id: string) {
    const enrollment = await this.enrollmentModel
      .findOne({
        course_id: course_id,
      })
      .exec();
    if (enrollment) {
      return true;
    } else {
      return false;
    }
  }
}
