import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnrollmentStatus } from './enrollment.model';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the student',
    example: '',
    required: true,
  })
  student_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the course',
    example: '',
    required: true,
  })
  course_id: string;
}

export class UpdateEnrollmentDto {
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  @ApiProperty({
    description: 'New status of the enrollment',
    example: 'active',
    required: true,
  })
  status: EnrollmentStatus;
}
