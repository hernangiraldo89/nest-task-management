import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseIntPipe, Patch,
  Post,
  Put,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger('TaskController');

  constructor(
    private taskService: TasksService,
  ) {}

  @Get()
  getTasks(@Query(ValidationPipe) data: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${ JSON.stringify(data) }`)
    return this.taskService.getTasks(data, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() data: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.createTask(data, user);
  }

  @Delete('/:id')
  deleteTasks(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) data: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTask(id, data, user);
  }
}
