import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TaskCreateEvent } from './task-create.event';
import * as dayjs from 'dayjs';
import { Inject } from '@nestjs/common';
import {
  IRESUME_QUERY_REPOSITORY,
  ITASK_QUERY_REPOSITORY,
} from 'src/common/constants/provider';
import { ITaskQueryRepository } from '../repositories/query/itask-query.repository';
import { TaskReadEntity } from '../entities/task-read.entity';
import { IResumeQueryRepository } from '../repositories/query/iresume-query.repository';
import { ResumeReadEntity } from '../entities/resume-read.entity';

@EventsHandler(TaskCreateEvent)
export class TaskCreateEventHandler implements IEventHandler<TaskCreateEvent> {
  constructor(
    @Inject(ITASK_QUERY_REPOSITORY)
    private readonly taskQueryRepository: ITaskQueryRepository,
    @Inject(IRESUME_QUERY_REPOSITORY)
    private readonly resumeQueryRepository: IResumeQueryRepository,
  ) {}

  async handle(event: TaskCreateEvent) {
    const expiredAt = dayjs(event.expiredAt);
    const createdAt = dayjs(event.createdAt);

    const totalDays = expiredAt.diff(createdAt, 'day');
    const startDate = dayjs(event.createdAt);

    await this.resumeQueryRepository.createIndexIfNotExist(
      this.resumeQueryRepository.INDEX,
    );

    const itemsToSaveBatch = [];
    const daysToAddOrUpdateResume = [];
    for (let index = 0; index <= totalDays; index += 1) {
      const task = new TaskReadEntity();
      task.setId(event.id);
      task.setTitle(event.title);
      task.setDescription(event.description);
      task.setCreatedAt(event.createdAt);
      task.setExpiredAt(event.expiredAt);
      task.setDay(startDate.add(index, 'day').toDate());
      task.setIsDone(event.isDone);
      itemsToSaveBatch.push({ index: { _index: 'tasks' } });
      itemsToSaveBatch.push(task);
      daysToAddOrUpdateResume.push(
        startDate.add(index, 'day').format('YYYY-MM-DD'),
      );
    }

    const daysHasResume =
      await this.resumeQueryRepository.existRegisterInStartAndEndDate(
        startDate.subtract(1, 'day').format('YYYY-MM-DDT00:00:00Z'),
        expiredAt.format('YYYY-MM-DDT23:59:59Z'),
      );

    const itemsResumeToSaveBatch = [];
    const daysToUpdateResume = [];
    for (let index = 0; index < daysToAddOrUpdateResume.length; index += 1) {
      const day = daysToAddOrUpdateResume[index];
      if (!daysHasResume[day]) {
        itemsResumeToSaveBatch.push({
          index: { _index: this.resumeQueryRepository.INDEX },
        });
        const resume = new ResumeReadEntity();
        resume.setTotal(1);
        resume.setTotalStarted(0);
        resume.setTotalFinished(0);
        resume.setDay(day);
        itemsResumeToSaveBatch.push(resume);
      } else {
        daysToUpdateResume.push(day);
      }
    }

    if (itemsResumeToSaveBatch.length > 0) {
      await this.resumeQueryRepository.saveBatch(itemsResumeToSaveBatch);
    }

    if (daysToUpdateResume.length > 0) {
      await this.resumeQueryRepository.incrementTotalByDays(daysToUpdateResume);
    }
    await this.taskQueryRepository.saveBatch(itemsToSaveBatch);
  }
}
