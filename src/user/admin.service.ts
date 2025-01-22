import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserStatus, UserType } from './user.model';

@Injectable()
export class AdminService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createSuperAdmin() {
    try {
      const superAdmin = await this.userModel
        .findOne({
          user_type: UserType.SUPER_ADMIN,
        })
        .exec();
      if (superAdmin) {
        console.log('Super admin already exists');
        return true;
      }
      const user = new this.userModel({
        name: 'Super Admin',
        email: 'super.admin@yopmail.com',
        user_type: UserType.SUPER_ADMIN,
        password: bcrypt.hashSync('superadmin123', 10),
        dob: new Date(),
      });
      await user.save();
      console.log('Super admin does not exist. Creating super admin...');
      return true;
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }
  async createAdmin(createAdmin: CreateAdminDto) {
    try {
      const user = new this.userModel({
        name: createAdmin.name,
        email: createAdmin.email,
        user_type: UserType.ADMIN,
        password: bcrypt.hashSync(createAdmin.password, 10),
        dob: createAdmin.dob,
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
  async getAllAdmins(page: number, limit: number) {
    const admins = await this.userModel
      .find(
        {
          user_type: UserType.ADMIN,
          status: { $ne: UserStatus.DELETED },
        },
        '-password',
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    if (!admins) {
      return [];
    }
    return admins;
  }
  async getAdminById(id: string) {
    try {
      const admin = await this.userModel
        .findOne(
          {
            _id: id,
            user_type: UserType.ADMIN,
            status: { $ne: UserStatus.DELETED },
          },
          '-password',
        )
        .exec();
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new NotFoundException('Admin not found');
    }
  }
  async deleteAdmin(id: string) {
    try {
      let result = await this.userModel
        .updateOne(
          { _id: id, user_type: UserType.ADMIN },
          { $set: { status: UserStatus.DELETED } },
        )
        .exec();
      if (result.modifiedCount === 0) {
        throw new NotFoundException('Admin not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Admin not found');
    }
  }

  async updateAdmin(id: string, updateAdmin: UpdateAdminDto) {
    try {
      let result = await this.userModel
        .updateOne(
          { _id: id },
          {
            $set: {
              ...(updateAdmin.name && { name: updateAdmin.name }),
              ...(updateAdmin.password && {
                password: bcrypt.hashSync(updateAdmin.password, 10),
              }),
              ...(updateAdmin.dob && { dob: updateAdmin.dob }),
              ...(updateAdmin.status !== undefined && {
                status: updateAdmin.status,
              }),
            },
          },
        )
        .exec();

      if (result.modifiedCount === 0) {
        throw new NotFoundException('Admin not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Admin not found');
    }
  }
}
