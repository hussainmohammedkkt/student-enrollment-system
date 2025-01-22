import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto, UpdateProfileDto } from './login.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login', tags: ['Auth'] })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Profile', tags: ['Auth'] })
  async profile(@Req() request: any) {
    return this.authService.profile(request.user.sub);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update Profile', tags: ['Auth'] })
  async updateProfile(
    @Req() request: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(request.user.sub, updateProfileDto);
  }
}
