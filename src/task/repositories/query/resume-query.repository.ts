import { Injectable } from '@nestjs/common';
import { IResumeQueryRepository } from './iresume-query.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ResumeReadEntity } from 'src/task/entities/resume-read.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ResumeQueryRepository implements IResumeQueryRepository {
  public INDEX = 'resumes';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async getByDay(day: string): Promise<ResumeReadEntity> {
    const registers = await this.elasticsearchService.search({
      index: this.INDEX,
      query: {
        match: {
          day: day,
        },
      },
    });

    if (!registers.hits.hits[0]) {
      return new ResumeReadEntity();
    }
    const itemValues: { [key: string]: any } = registers.hits.hits[0]._source;
    const resume = new ResumeReadEntity();
    resume.setTotal(itemValues.total);
    resume.setTotalStarted(itemValues.totalStarted);
    resume.setTotalFinished(itemValues.totalFinished);
    resume.setDay(itemValues.day);

    return resume;
  }

  async incrementTotalByDays(days: Array<string>): Promise<void> {
    await this.elasticsearchService.updateByQuery({
      index: this.INDEX,
      query: {
        terms: {
          day: days,
          boost: 1,
        },
      },
      script: {
        source: 'ctx._source.total += 1;',
        lang: 'painless',
        params: {},
      },
      refresh: true,
    });
  }

  async incrementTotalStartedAndFinishedByDay(day: string): Promise<void> {
    await this.elasticsearchService.updateByQuery({
      index: this.INDEX,
      query: {
        bool: {
          must: [
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
        source: 'ctx._source.totalStarted += 1; ctx._source.totalFinished += 1',
        lang: 'painless',
        params: {},
      },
    });
  }

  async updateTotalByDay(day: string, total: number): Promise<void> {
    await this.elasticsearchService.updateByQuery({
      index: this.INDEX,
      query: {
        bool: {
          must: [
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
        source: 'ctx._source.total += params.total',
        lang: 'painless',
        params: {
          total: total,
        },
      },
    });
  }

  async saveBatch(registers: Array<ResumeReadEntity>): Promise<void> {
    await this.elasticsearchService.bulk({ refresh: true, body: registers });
  }

  async save(register: ResumeReadEntity): Promise<void> {
    await this.elasticsearchService.index({
      index: this.INDEX,
      document: {
        total: register.getTotal(),
        totalStarted: register.getTotalStarted(),
        totalFinished: register.getTotalFinished(),
        day: register.getDay(),
      },
    });
  }

  async existRegisterInStartAndEndDate(
    startDate: string,
    endDate: string,
  ): Promise<{ [key: string]: boolean }> {
    console.log(startDate, endDate);
    const response = await this.elasticsearchService.search({
      index: this.INDEX,
      body: {
        query: {
          range: {
            day: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        aggs: {
          items_by_day: {
            date_histogram: {
              field: 'day',
              calendar_interval: 'day',
              format: 'yyyy-MM-dd',
            },
          },
        },
      },
    });

    // @ts-ignore
    const result = {};
    // @ts-ignore
    (response.aggregations.items_by_day.buckets || []).forEach(
      (item: { [key: string]: any }) => {
        result[dayjs(item.key_as_string).format('YYYY-MM-DD')] = true;
      },
    );

    return result;
  }

  async isFirstRegisterInDay(day: string): Promise<boolean> {
    const register = await this.elasticsearchService.search({
      index: this.INDEX,
      size: 1,
      query: {
        match: {
          day: day,
        },
      },
    });

    return register.hits.hits.length > 0;
  }

  async createIndexIfNotExist(index: any): Promise<void> {
    const hasIndex = await this.elasticsearchService.indices.exists({
      index,
    });
    if (!hasIndex) {
      await this.elasticsearchService.indices.create({
        index,
      });
    }
  }
}
