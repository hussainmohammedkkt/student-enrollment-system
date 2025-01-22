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
import { AdminService } from './admin.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { UserType } from './user.model';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { RolesGuard } from '../authorization/roles.guard';
import { Roles } from '../role/roles.decorator';

@UseGuards(AuthenticationGuard, RolesGuard)
@Roles(UserType.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin', tags: ['Admin'] })
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins', tags: ['Admin'] })
  async getAllAdmins(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getAllAdmins(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a admin by id', tags: ['Admin'] })
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a admin', tags: ['Admin'] })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a admin', tags: ['Admin'] })
  async deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
