import { UserType } from 'src/user/user.model';

export interface DecodedUserToken {
  sub: string;
  name: string;
  email: string;
  role: UserType;
}
