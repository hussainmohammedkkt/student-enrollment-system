import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Enrollment } from './enrollment.model';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './enrollment.dto';
import { CourseService } from '../course/course.service';
import { StudentService } from '../user/student.service';
import { CourseStatus } from '../course/course.model';
import { UserStatus } from '../user/user.model';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel('Enrollment')
    private readonly enrollmentModel: Model<Enrollment>,
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
  ) {}

  async getEnrollmentsByStudentId(student_id: string) {
    const enrollments = await this.enrollmentModel.aggregate([
      {
        $match: {
          student_id: new mongoose.Types.ObjectId(student_id),
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          course: {
            _id: 1,
            title: 1,
          },
          enrolled_at: '$createdAt',
        },
      },
    ]);
    return enrollments;
  }

  async createEnrollment(createEnrollment: CreateEnrollmentDto) {
    try {
      const [course, student] = await Promise.all([
        this.courseService.getCourseById(createEnrollment.course_id),
        this.studentService.getStudentById(createEnrollment.student_id),
      ]);

      if (course.status !== CourseStatus.ACTIVE) {
        throw new ConflictException('Course is not active');
      }
      if (student.status !== UserStatus.ACTIVE) {
        throw new ConflictException('Student is not active');
      }

      const enrollment = new this.enrollmentModel({
        student_id: createEnrollment.student_id,
        course_id: createEnrollment.course_id,
      });
      let result = await enrollment.save();
      return result;
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Student already enrolled');
      }
      throw e;
    }
  }
  async getEnrollmentById(id: string) {
    try {
      const enrollment = await this.enrollmentModel
        .findOne({
          _id: id,
        })
        .exec();
      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }
      return enrollment;
    } catch (error) {
      throw new NotFoundException('Enrollment not found');
    }
  }
  async deleteEnrollment(id: string) {
    try {
      let result = await this.enrollmentModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Enrollment not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Enrollment not found');
    }
  }
  async getAllEnrollments(page: number, limit: number) {
    if (page < 1) {
      page = 1;
    }

    const enrollments = await this.enrollmentModel.aggregate([
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $unwind: '$student',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          course: {
            _id: 1,
            title: 1,
          },
          student: {
            _id: 1,
            name: 1,
          },
          enrolled_at: '$createdAt',
        },
      },
    ]);
    if (!enrollments) {
      return [];
    }
    return enrollments;
  }
  async updateEnrollmentStatus(
    id: string,
    updateEnrollment: UpdateEnrollmentDto,
  ) {
    try {
      let result = await this.enrollmentModel
        .updateOne(
          { _id: id },
          {
            $set: {
              status: updateEnrollment.status,
            },
          },
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Enrollment not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Enrollment not found');
    }
  }
}
