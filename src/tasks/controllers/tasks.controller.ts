import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { TaskEntity } from '../entities/task.entity';
import { UpdateTaskDTO } from '../dtos/update-task.dto';
import { UserPayload } from 'src/auth/dtos/token-payload';
import { UserDecorator } from 'src/auth/decorators/user.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Role } from 'src/auth/enums/auth.enum';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ValidationPipe()) createTaskDTO: CreateTaskDTO,
    @UserDecorator() user: UserPayload,
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@UserDecorator() user: UserPayload): Promise<TaskEntity[]> {
    return this.tasksService.findAllTasks(user);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: UserPayload,
  ): Promise<TaskEntity> {
    return this.tasksService.findOneTask(id, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateTaskDTO: UpdateTaskDTO,
    @UserDecorator() user: UserPayload,
  ): Promise<TaskEntity> {
    return this.tasksService.updateTask(id, updateTaskDTO, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: UserPayload,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
