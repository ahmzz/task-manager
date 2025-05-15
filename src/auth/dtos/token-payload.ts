import { Role } from '../enums/auth.enum';

export interface UserPayload {
  sub: number;
  email: string;
  role: Role;
}
