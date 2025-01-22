import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserStatus } from 'src/user/user.model';
import * as jwt from 'jsonwebtoken';
import { DecodedUserToken } from 'src/authentication/decoded-token.interface';
import { config } from 'src/config/config';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email: email, status: UserStatus.ACTIVE })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let tokenData: DecodedUserToken = {
      name: user.name,
      email: user.email,
      role: user.user_type,
      sub: user._id?.toString() as string,
    };
    return {
      access_token: jwt.sign(tokenData, config.jwt_secret, { expiresIn: '1h' }),
    };
  }
  async profile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      name: user.name,
      email: user.email,
      role: user.user_type,
      dob: user.dob,
    };
  }
  async updateProfile(userId: string, updateProfile: UpdateProfileDto) {
    try {
      const result = await this.userModel.updateOne(
        { _id: userId },
        {
          $set: {
            ...(updateProfile.password && {
              password: bcrypt.hashSync(updateProfile.password, 10),
            }),
            ...(updateProfile.name && { name: updateProfile.name }),
            ...(updateProfile.dob && { dob: updateProfile.dob }),
          },
        },
      );
      if (result.modifiedCount === 0) {
        throw new NotFoundException('User not found');
      }
      return null;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
