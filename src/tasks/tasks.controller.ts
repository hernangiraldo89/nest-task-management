import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {

  constructor(
    private taskService: TasksService,
  ) {}

  @Get()
  getTasks(@Query(ValidationPipe) data: GetTasksFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(data);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() data: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(data);
  }

  @Delete('/:id')
  deleteTasks(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Put('/:id/status')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body(TaskStatusValidationPipe) data: UpdateTaskDto): Promise<Task> {
    return this.taskService.updateTask(id, data);
  }
}
