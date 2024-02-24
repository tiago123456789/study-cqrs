import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { Inject } from '@nestjs/common';
import { ITASK_QUERY_REPOSITORY } from 'src/common/constants/provider';
import { ITaskQueryRepository } from '../repositories/query/itask-query.repository';
import { CompleteTaskEvent } from './complete-task.event';

@EventsHandler(CompleteTaskEvent)
export class CompleteTaskEventHandler
  implements IEventHandler<CompleteTaskEvent>
{
  constructor(
    @Inject(ITASK_QUERY_REPOSITORY)
    private readonly taskQueryRepository: ITaskQueryRepository,
  ) {}

  async handle(event: CompleteTaskEvent) {
    await this.taskQueryRepository.makeComplete(
      event.taskId,
      dayjs(event.createdAt).format('YYYY-MM-DD'),
      dayjs(event.expiredAt).format('YYYY-MM-DD'),
    );
  }
}
