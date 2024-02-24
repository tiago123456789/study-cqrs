import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByDayQuery } from './get-task-by-day.query';
import { Inject } from '@nestjs/common';
import { IRESUME_QUERY_REPOSITORY } from 'src/common/constants/provider';
import { GetResumeByDayQuery } from './get-resume-by-day.query';
import { IResumeQueryRepository } from '../repositories/query/iresume-query.repository';
import { ResumeReadEntity } from '../entities/resume-read.entity';

@QueryHandler(GetResumeByDayQuery)
export class GetResumeByDayQueryHandler
  implements IQueryHandler<GetResumeByDayQuery, ResumeReadEntity>
{
  constructor(
    @Inject(IRESUME_QUERY_REPOSITORY)
    private readonly resumeQueryRepository: IResumeQueryRepository,
  ) {}

  execute(query: GetTaskByDayQuery): Promise<ResumeReadEntity> {
    return this.resumeQueryRepository.getByDay(query.day);
  }
}
