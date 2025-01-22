import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserStatus } from './user.model';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The  name of the student',
    example: 'Jane',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the student',
    example: 'jane.doe@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the student',
    example: 'password',
    required: true,
  })
  password: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of birth of the student',
    example: '1995-06-15T00:00:00.000Z',
    required: true,
  })
  dob: Date;
}

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The  name of the student',
    example: 'Jane',
    required: false,
  })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the student',
    example: 'password',
    required: false,
  })
  password: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of birth of the student',
    example: '1995-06-15T00:00:00.000Z',
    required: false,
  })
  dob: Date;

  @IsEnum([UserStatus.ACTIVE, UserStatus.INACTIVE])
  @IsOptional()
  @ApiProperty({
    description: 'The status of the student',
    example: true,
    required: false,
  })
  status: UserStatus;
}
