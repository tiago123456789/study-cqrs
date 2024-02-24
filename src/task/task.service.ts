import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NewTaskDto } from './dto/new-task.dto';
import { TaskCreateCommand } from './command/task-create.command';
import { GetTaskQuery } from './query/get-task.query';
import { GetTaskByDayQuery } from './query/get-task-by-day.query';
import { NewCheckPointDto } from './dto/new-check-point.dto';
import { CheckPointCreateCommand } from './command/check-point-create.command';
import { GetResumeByDayQuery } from './query/get-resume-by-day.query';
import { CompleteTaskCommand } from './command/compĺete-task.command';

@Injectable()
export class TaskService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  setCheckPoint(checkPoint: NewCheckPointDto) {
    return this.commandBus.execute(
      new CheckPointCreateCommand(
        checkPoint.taskId,
        checkPoint.startedAt,
        checkPoint.finishedAt,
      ),
    );
  }

  makeComplete(taskId: number) {
    return this.commandBus.execute(new CompleteTaskCommand(taskId));
  }

  create(task: NewTaskDto) {
    return this.commandBus.execute(
      new TaskCreateCommand(
        task.title,
        task.description,
        task.isDone,
        task.createdAt,
        task.expiredAt,
      ),
    );
  }

  findAll(offset: number, limit: number) {
    return this.queryBus.execute(new GetTaskQuery(offset, limit));
  }

  findPaginateByDay(day: string, offset: number, limit: number) {
    return this.queryBus.execute(new GetTaskByDayQuery(day, offset, limit));
  }

  getResumeByDay(day: string): Promise<any[]> {
    return this.queryBus.execute(new GetResumeByDayQuery(day));
  }
}
