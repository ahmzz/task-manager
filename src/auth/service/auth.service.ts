import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthLoginDTO } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDTO } from '../dtos/auth-register.dto';
import { Role } from '../enums/auth.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userDAO: Repository<UserEntity>,
  ) {}

  async registerAdmin(
    registerDTO: AuthRegisterDTO,
  ): Promise<{ token: string }> {
    return this.register({ ...registerDTO, role: Role.ADMIN });
  }

  async registerUser(registerDTO: AuthRegisterDTO): Promise<{ token: string }> {
    return this.register({ ...registerDTO, role: Role.USER });
  }

  private async register(
    registerDTO: AuthRegisterDTO,
  ): Promise<{ token: string }> {
    const { email, password, name, role } = registerDTO;
    const existingUser = await this.userDAO.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already exists',
          errorCode: 'AUTH_EMAIL_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.userDAO.create({
      email,
      password: hashedPassword,
      name,
      role,
    });
    await this.userDAO.save(user);
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateUser(loginDTO: AuthLoginDTO): Promise<string> {
    const { email, password } = loginDTO;

    // Find user in database
    const user = await this.userDAO.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User does not exist',
          errorCode: 'AUTH_USER_NOT_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email or password is invalid',
          errorCode: 'AUTH_INVALID_CREDENTIALS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generate JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
