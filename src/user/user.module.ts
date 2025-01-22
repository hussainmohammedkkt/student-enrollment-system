import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { UserSchema } from './user.model';
import { StudentController } from './student.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [StudentController, AdminController],
  providers: [StudentService, AdminService],
  exports: [StudentService],
})
export class UserModule {}
