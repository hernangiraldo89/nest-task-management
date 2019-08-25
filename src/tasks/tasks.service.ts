import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  public async getTasks(data: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(data, user);
  }

  public async createTask(data: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(data, user);
  }

  public async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  public async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTask(id: number, data: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = data.status;
    await task.save();
    return task;
  }
}
