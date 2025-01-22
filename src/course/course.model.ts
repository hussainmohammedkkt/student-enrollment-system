import { Schema, Document } from 'mongoose';

export enum CourseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface Course extends Document {
  title: string;
  description: string;
  duration: number;
  status: CourseStatus;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CourseSchema = new Schema<Course>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.ACTIVE,
    },
  },
  { timestamps: true },
);
