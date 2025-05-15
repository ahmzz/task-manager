import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { Role } from 'src/auth/enums/auth.enum';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { TaskStatus } from '../enums/task.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(
    dto: CreateTaskDTO,
    user: { sub: number; role: Role },
  ): Promise<TaskEntity> {
    const task = this.taskRepository.create({
      ...dto,
      userId: user.sub,
      status: TaskStatus.PENDING,
    });
    return this.taskRepository.save(task);
  }

  async findAllTasks(user: { sub: number; role: Role }): Promise<TaskEntity[]> {
    if (user.role === Role.ADMIN) {
      return this.taskRepository.find();
    }
    return this.taskRepository.find({
      where: { userId: user.sub },
      relations: ['user'],
    });
  }

  async findOneTask(
    id: number,
    user: { sub: number; role: Role },
  ): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Task not found',
          errorCode: 'TASK_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role !== Role.ADMIN && task.userId !== user.sub) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You can only view your own tasks',
          errorCode: 'TASK_ACCESS_DENIED',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return task;
  }

  async updateTask(
    id: number,
    dto: UpdateTaskDTO,
    user: { sub: number; role: Role },
  ): Promise<TaskEntity> {
    const task = await this.findOneTask(id, user);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async deleteTask(
    id: number,
    user: { sub: number; role: Role },
  ): Promise<void> {
    const task = await this.findOneTask(id, user);
    await this.taskRepository.remove(task);
  }
}
