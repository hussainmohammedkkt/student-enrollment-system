import { SetMetadata } from '@nestjs/common';
import { UserType } from '../user/user.model';

export const Roles = (...args: UserType[]) => SetMetadata('roles', args);
