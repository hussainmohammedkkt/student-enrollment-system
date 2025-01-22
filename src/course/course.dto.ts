import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The  title of the course',
    example: 'Computer Science',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The  description of the course',
    example: 'Computer Science',
    required: true,
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The  duration of the course in hours',
    example: 9,
    required: true,
  })
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The price of the course',
    example: 100,
    required: true,
  })
  price: number;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The  title of the course',
    example: 'Computer Science',
    required: false,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The  description of the course',
    example: 'Computer Science',
    required: false,
  })
  description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The  duration of the course in hours',
    example: 9,
    required: false,
  })
  duration: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The price of the course',
    example: 100,
    required: false,
  })
  price: number;
}
