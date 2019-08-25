import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../enums/task-status.enum';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends  Repository<Task> {

  async getTasks(data: GetTasksFilterDto): Promise<Task[]> {
    const {status, search} = data;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title Like :search OR task.description LIKE :search', { search: `%${search}%` });
    }

    const task = await query.getMany();
    return  task;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const { title, description } = data;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }

}
