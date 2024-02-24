import { Injectable } from '@nestjs/common';
import { ITaskQueryRepository } from './itask-query.repository';
import { TaskReadEntity } from 'src/task/entities/task-read.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class TaskQueryRepository implements ITaskQueryRepository {
  private INDEX = 'tasks';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async makeComplete(
    id: number,
    startedAt: string,
    finishedAt: string,
  ): Promise<void> {
    await this.elasticsearchService.updateByQuery({
      index: this.INDEX,
      query: {
        bool: {
          must: [
            {
              term: {
                id: {
                  value: id,
                },
              },
            },
            {
              range: {
                day: {
                  gte: startedAt,
                  lte: finishedAt,
                  time_zone: 'Z',
                  boost: 1,
                },
              },
            },
          ],
          boost: 1,
        },
      },
      script: {
        source: 'ctx._source.isDone = true',
        lang: 'painless',
        params: {},
      },
    });
  }

  async getAll(): Promise<TaskReadEntity[]> {
    const registers = await this.elasticsearchService.search({
      index: this.INDEX,
      query: {
        match_all: {},
      },
    });

    return registers.hits.hits.map((item) => {
      const itemValues: { [key: string]: any } = item._source;
      const task = new TaskReadEntity();
      task.setId(itemValues.id);
      task.setTitle(itemValues.title);
      task.setDescription(itemValues.description);
      task.setIsDone(itemValues.isDone);
      task.setCreatedAt(itemValues.createdAt);
      task.setExpiredAt(itemValues.expiredAt);
      task.setDay(itemValues.day);

      return task;
    });
  }

  async getPaginateInDay(
    day: string,
    offset: number,
    limit: number,
  ): Promise<TaskReadEntity[]> {
    const registers = await this.elasticsearchService.search({
      from: offset,
      size: limit,
      index: this.INDEX,
      query: {
        match: {
          day: day,
        },
      },
      sort: [
        {
          id: {
            order: 'asc',
            missing: '_first',
            unmapped_type: 'long',
          },
        },
      ],
    });

    return registers.hits.hits.map((item) => {
      const itemValues: { [key: string]: any } = item._source;
      const task = new TaskReadEntity();
      task.setId(itemValues.id);
      task.setTitle(itemValues.title);
      task.setDescription(itemValues.description);
      task.setIsDone(itemValues.isDone);
      task.setCreatedAt(itemValues.createdAt);
      task.setExpiredAt(itemValues.expiredAt);
      task.setDay(itemValues.day);
      task.setStartedAt(itemValues.startedAt || null);
      task.setFinishedAt(itemValues.finishedAt || null);

      return task;
    });
  }

  async addCheckPointInDay(
    day: string,
    checkPoint: TaskReadEntity,
  ): Promise<void> {
    await this.elasticsearchService.updateByQuery({
      index: this.INDEX,
      query: {
        bool: {
          must: [
            {
              term: {
                id: {
                  value: checkPoint.getId(),
                },
              },
            },
            {
              term: {
                day: {
                  value: day,
                },
              },
            },
          ],
          boost: 1,
        },
      },
      script: {
        source:
          'ctx._source.startedAt = params.startedAt; ctx._source.finishedAt = params.finishedAt',
        lang: 'painless',
        params: {
          startedAt: checkPoint.getStartedAt(),
          finishedAt: checkPoint.getFinishedAt(),
        },
      },
    });
  }

  async saveBatch(registers: Array<TaskReadEntity>): Promise<void> {
    await this.elasticsearchService.bulk({ refresh: true, body: registers });
  }

  async save(register: TaskReadEntity): Promise<void> {
    await this.elasticsearchService.index({
      index: this.INDEX,
      document: {
        id: register.getId(),
        title: register.getTitle(),
        description: register.getDescription(),
        isDone: register.getIsDone(),
        day: register.getDay(),
        createdAt: register.getCreatedAt(),
        expiredAt: register.getExpiredAt(),
        startedAt: register.getStartedAt(),
        finishedAt: register.getFinishedAt(),
      },
    });
  }
}
