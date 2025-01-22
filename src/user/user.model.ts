import { Schema, Document } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}
export enum UserType {
  ADMIN = 'admin',
  STUDENT = 'student',
  SUPER_ADMIN = 'super_admin',
}

export interface User extends Document {
  name: string;
  email: string;
  dob: Date;
  password: string;
  user_type: UserType;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    user_type: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.STUDENT,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true },
);
