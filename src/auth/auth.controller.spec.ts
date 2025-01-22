import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, UpdateProfileDto } from './login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    profile: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call AuthService.login and return its result', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '123456',
      };
      const mockResponse = { access_token: 'token' };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('profile', () => {
    it('should call AuthService.profile and return its result', async () => {
      const mockUser = { sub: '123' };
      const mockProfile = {
        name: 'Test User',
        email: 'test.user@gmail.com',
        role: 'student',
        dob: new Date(),
      };

      mockAuthService.profile.mockResolvedValue(mockProfile);

      const request = { user: mockUser };
      const result = await authController.profile(request);

      expect(authService.profile).toHaveBeenCalledWith(mockUser.sub);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should call AuthService.updateProfile and return its result', async () => {
      const mockUser = { sub: '123' };
      const updateProfileDto: UpdateProfileDto = {
        name: 'Updated Name',
        password: '123456',
        dob: new Date(),
      };
      const mockUpdatedProfile = { message: 'Profile updated successfully' };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const request = { user: mockUser };
      const result = await authController.updateProfile(
        request,
        updateProfileDto,
      );

      expect(authService.updateProfile).toHaveBeenCalledWith(
        mockUser.sub,
        updateProfileDto,
      );
      expect(result).toEqual(mockUpdatedProfile);
    });
  });
});
