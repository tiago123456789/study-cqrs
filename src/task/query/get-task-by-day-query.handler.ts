import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskQuery } from './get-task.query';
import { TaskReadEntity } from '../entities/task-read.entity';
import { GetTaskByDayQuery } from './get-task-by-day.query';
import { Inject } from '@nestjs/common';
import { ITASK_QUERY_REPOSITORY } from 'src/common/constants/provider';
import { ITaskQueryRepository } from '../repositories/query/itask-query.repository';

@QueryHandler(GetTaskByDayQuery)
export class GetTaskByDayQueryHandler
  implements IQueryHandler<GetTaskQuery, TaskReadEntity[]>
{
  constructor(
    @Inject(ITASK_QUERY_REPOSITORY)
    private readonly taskQueryRepository: ITaskQueryRepository,
  ) {}

  async execute(query: GetTaskByDayQuery): Promise<TaskReadEntity[]> {
    return this.taskQueryRepository.getPaginateInDay(
      query.day,
      query.offset || 0,
      query.limit || 10,
    );
  }
}
