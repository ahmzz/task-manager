import { IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../enums/task.enum';

export class TaskDTO {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Status must be PENDING, IN_PROGRESS, or COMPLETED',
  })
  status: TaskStatus;

  @IsString()
  userId: string;
}
