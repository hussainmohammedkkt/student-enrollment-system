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
import { ApiOperation } from '@nestjs/swagger';
import { CreateStudentDto, UpdateStudentDto } from './student.dto';
import { StudentService } from './student.service';
import { UserType } from './user.model';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../role/roles.decorator';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@UseGuards(AuthenticationGuard, RolesGuard)
@Controller('student')
@Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student', tags: ['Student'] })
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students', tags: ['Student'] })
  async getAllStudents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.studentService.getAllStudents(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by id', tags: ['Student'] })
  async getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student', tags: ['Student'] })
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student', tags: ['Student'] })
  async deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
