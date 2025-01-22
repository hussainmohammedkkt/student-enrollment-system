import { UserType } from '../user/user.model';

export interface DecodedUserToken {
  sub: string;
  name: string;
  email: string;
  role: UserType;
}
