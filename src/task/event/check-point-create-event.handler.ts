import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { CheckPointCreateEvent } from './check-point-create.event';
import { Inject } from '@nestjs/common';
import {
  IRESUME_QUERY_REPOSITORY,
  ITASK_QUERY_REPOSITORY,
} from 'src/common/constants/provider';
import { ITaskQueryRepository } from '../repositories/query/itask-query.repository';
import { TaskReadEntity } from '../entities/task-read.entity';
import { IResumeQueryRepository } from '../repositories/query/iresume-query.repository';

@EventsHandler(CheckPointCreateEvent)
export class CheckPointCreateEventHandler
  implements IEventHandler<CheckPointCreateEvent>
{
  constructor(
    @Inject(ITASK_QUERY_REPOSITORY)
    private readonly taskQueryRepository: ITaskQueryRepository,
    @Inject(IRESUME_QUERY_REPOSITORY)
    private readonly resumeQueryRepository: IResumeQueryRepository,
  ) {}

  async handle(event: CheckPointCreateEvent) {
    const day = dayjs(event.startedAt).format('YYYY-MM-DD');
    const task = new TaskReadEntity();
    task.setId(event.taskId);
    task.setStartedAt(event.startedAt);
    task.setFinishedAt(event.finishedAt);
    await this.taskQueryRepository.addCheckPointInDay(day, task);
    await this.resumeQueryRepository.incrementTotalStartedAndFinishedByDay(day);
  }
}
