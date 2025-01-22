import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { User, UserStatus, UserType } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createStudent(createStudent: CreateStudentDto) {
    try {
      const user = new this.userModel({
        name: createStudent.name,
        email: createStudent.email,
        password: bcrypt.hashSync(createStudent.password, 10),
        dob: createStudent.dob,
      });
      let result = await user.save();
      return result;
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }
  async updateStudent(id: string, updateStudent: UpdateStudentDto) {
    try {
      let result = await this.userModel
        .updateOne(
          { _id: id },
          {
            $set: {
              ...(updateStudent.name && { name: updateStudent.name }),
              ...(updateStudent.password && {
                password: bcrypt.hashSync(updateStudent.password, 10),
              }),
              ...(updateStudent.dob && { dob: updateStudent.dob }),
              ...(updateStudent.status !== undefined && {
                status: updateStudent.status,
              }),
            },
          },
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Student not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }

  async getAllStudents(page: number, limit: number) {
    const students = await this.userModel
      .find(
        {
          user_type: UserType.STUDENT,
          status: { $ne: UserStatus.DELETED },
        },
        '-password',
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    if (!students) {
      return [];
    }
    return students;
  }
  async getStudentById(id: string) {
    try {
      const student = await this.userModel
        .findOne(
          {
            _id: id,
            user_type: UserType.STUDENT,
            status: { $ne: UserStatus.DELETED },
          },
          '-password',
        )
        .exec();
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return student;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }

  async deleteStudent(id: string) {
    try {
      let result = await this.userModel
        .updateOne(
          { _id: id, user_type: UserType.STUDENT },
          {
            $set: { status: UserStatus.DELETED },
          },
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Student not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }
}
