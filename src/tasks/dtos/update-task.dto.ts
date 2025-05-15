import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task.enum';

export class UpdateTaskDTO {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
  })
  status?: TaskStatus;
}
