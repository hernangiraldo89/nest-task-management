import { TaskStatus } from '../enums/task-status.enum';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetTasksFilterDto {

  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  public status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  public search: string;
}
