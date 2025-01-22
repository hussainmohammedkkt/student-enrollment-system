import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/user/user.model';

export const Roles = (...args: UserType[]) => SetMetadata('roles', args);
