import { Schema, Document, Types } from 'mongoose';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

export interface Enrollment extends Document {
  student_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const EnrollmentSchema = new Schema<Enrollment>(
  {
    student_id: { type: Schema.Types.ObjectId, required: true },
    course_id: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      default: EnrollmentStatus.ACTIVE,
    },
  },
  { timestamps: true },
);
EnrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });
