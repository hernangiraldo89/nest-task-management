import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) { }

  public async getTasks(data: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(data);
  }

  public async createTask(data: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(data);
  }

  public async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  public async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = data.status;
    await task.save();
    return task;
  }
}
