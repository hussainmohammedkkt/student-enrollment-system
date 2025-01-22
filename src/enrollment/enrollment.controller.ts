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
import { EnrollmentService } from './enrollment.service';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { RolesGuard } from 'src/authorization/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { UserType } from 'src/user/user.model';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './enrollment.dto';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthenticationGuard, RolesGuard)
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({
    summary: 'Enroll a student to a course',
    tags: ['Enrollment'],
  })
  async createEnrollment(@Body() createEnrollment: CreateEnrollmentDto) {
    return await this.enrollmentService.createEnrollment(createEnrollment);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a enrollment by id', tags: ['Enrollment'] })
  async getEnrollmentById(@Param('id') id: string) {
    return this.enrollmentService.getEnrollmentById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a enrollment', tags: ['Enrollment'] })
  async deleteEnrollment(@Param('id') id: string) {
    return this.enrollmentService.deleteEnrollment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all enrollments', tags: ['Enrollment'] })
  async getAllEnrollments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.enrollmentService.getAllEnrollments(page, limit);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an enrollment status',
    tags: ['Enrollment'],
  })
  async updateEnrollment(
    @Param('id') id: string,
    @Body() updateEnrollment: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.updateEnrollmentStatus(id, updateEnrollment);
  }

  @Get('student/:student_id')
  @ApiOperation({
    summary: 'Get all enrollments by student id',
    tags: ['Enrollment'],
  })
  async getEnrollmentsByStudentId(@Param('student_id') student_id: string) {
    return this.enrollmentService.getEnrollmentsByStudentId(student_id);
  }
}
