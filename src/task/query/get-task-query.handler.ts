import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskQuery } from './get-task.query';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TaskReadEntity } from '../entities/task-read.entity';
import { ITaskQueryRepository } from '../repositories/query/itask-query.repository';
import { ITASK_QUERY_REPOSITORY } from 'src/common/constants/provider';
import { Inject } from '@nestjs/common';

@QueryHandler(GetTaskQuery)
export class GetTaskQueryHandler
  implements IQueryHandler<GetTaskQuery, TaskReadEntity[]>
{
  constructor(
    @Inject(ITASK_QUERY_REPOSITORY)
    private readonly taskQueryRepository: ITaskQueryRepository,
  ) {}

  async execute(query: GetTaskQuery): Promise<TaskReadEntity[]> {
    return this.taskQueryRepository.getAll();
  }
}
