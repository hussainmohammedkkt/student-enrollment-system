import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseService } from './course.service';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { RolesGuard } from 'src/authorization/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { UserType } from 'src/user/user.model';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthenticationGuard, RolesGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course', tags: ['Course'] })
  async createCourse(@Body() createCourse: CreateCourseDto) {
    return this.courseService.createCourse(createCourse);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses', tags: ['Course'] })
  async getAllCourses(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.courseService.getAllCourses(page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course by id', tags: ['Course'] })
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourse: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id', tags: ['Course'] })
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course by id', tags: ['Course'] })
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
