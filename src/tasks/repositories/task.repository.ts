import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { User } from '../../auth/entities/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends  Repository<Task> {

  private logger = new Logger();

  async getTasks(data: GetTasksFilterDto, user: User): Promise<Task[]> {
    const {status, search} = data;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title Like :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    try {
      const task = await query.getMany();
      return  task;
    } catch (e) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(data)}`, e.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(data: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = data;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (e) {
      this.logger.error(`Failed to create a task for user "${user.username}". Data: ${data}`, e.stack);
      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }

}
