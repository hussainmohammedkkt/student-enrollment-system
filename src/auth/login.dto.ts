import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    required: true,
  })
  password: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    required: false,
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of the user',
    example: 'Jane',
    required: false,
  })
  name: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'The date of birth of the user',
    example: 'password',
    required: false,
  })
  dob: Date;
}
