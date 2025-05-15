import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/auth.dto';
import { AuthService } from '../service/auth.service';
import { AuthRegisterDTO } from '../dtos/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/admin')
  async registerAdmin(
    @Body(new ValidationPipe()) registerDTO: AuthRegisterDTO,
  ): Promise<{ token: string }> {
    return this.authService.registerAdmin(registerDTO);
  }

  @Post('register/user')
  async registerUser(
    @Body(new ValidationPipe()) registerDTO: AuthRegisterDTO,
  ): Promise<{ token: string }> {
    return this.authService.registerUser(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) loginDTO: AuthLoginDTO,
  ): Promise<{ token: string }> {
    const token = await this.authService.validateUser(loginDTO);
    return { token };
  }
}
