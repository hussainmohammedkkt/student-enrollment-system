import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserStatus } from './user.model';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the admin',
    example: 'Jane',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the admin',
    example: 'jane.doe@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the admin',
    example: 'password',
    required: true,
  })
  password: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of birth of the admin',
    example: '1995-06-15T00:00:00.000Z',
    required: true,
  })
  dob: Date;
}

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The  name of the admin',
    example: 'Jane',
    required: false,
  })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the admin',
    example: 'password',
    required: false,
  })
  password: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({
    description: 'The date of birth of the admin',
    example: '1995-06-15T00:00:00.000Z',
    required: false,
  })
  dob: Date;

  @IsEnum([UserStatus.ACTIVE, UserStatus.INACTIVE])
  @IsOptional()
  @ApiProperty({
    description: 'The status of the admin',
    example: true,
    required: false,
  })
  status: UserStatus;
}
