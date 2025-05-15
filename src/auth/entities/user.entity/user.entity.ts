import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/auth/enums/auth.enum';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Column({ nullable: false })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Column({ nullable: true, default: null })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role, { message: 'Role must be either ADMIN or USER' })
  @IsOptional()
  role: Role;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
