import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  constructor(
    public status: TaskStatus,
  ) {}
}
