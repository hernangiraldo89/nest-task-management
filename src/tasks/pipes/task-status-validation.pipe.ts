import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskStatus } from '../enums/task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {

  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: UpdateTaskDto) {
    const status = value.status.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`${value.status} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: string): boolean {
    const idx = this.allowedStatus.indexOf(status as TaskStatus);
    return idx !== -1;
  }
}
