import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
