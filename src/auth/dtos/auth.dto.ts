import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
