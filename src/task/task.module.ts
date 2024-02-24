import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TaskCreateCommandHandler } from './command/task-create-command.handler';
import { GetTaskQueryHandler } from './query/get-task-query.handler';
import { TaskCreateEventHandler } from './event/task-create-event.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskWriteEntity } from './entities/task-write.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { GetTaskByDayQueryHandler } from './query/get-task-by-day-query.handler';
import { CheckPointWriteEntity } from './entities/check-point-write.entity';
import { CheckPointCreateCommandHandler } from './command/check-point-create-command.handler';
import { CheckPointCreateEventHandler } from './event/check-point-create-event.handler';
import { TaskQueryRepository } from './repositories/query/task-query.repository';
import {
  ICHECK_POINT_COMMAND_REPOSITORY,
  IRESUME_QUERY_REPOSITORY,
  ITASK_COMMAND_REPOSITORY,
  ITASK_QUERY_REPOSITORY,
} from 'src/common/constants/provider';
import { ResumeQueryRepository } from './repositories/query/resume-query.repository';
import { TaskCommandRepository } from './repositories/command/task-command.repository';
import { CheckPointCommandRepository } from './repositories/command/check-point-command.repository';
import { GetResumeByDayQueryHandler } from './query/get-resume-by-day-query.handler';
import { CompleteTaskCommandHandler } from './command/complete-task-command.handler';
import { CompleteTaskEventHandler } from './event/complete-task-event.handler';
import { TaskConsumer } from './task.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forFeature([TaskWriteEntity, CheckPointWriteEntity]),
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        node: config.get('ELASTIC_ENDPOINT'),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          redis: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'tasks_to_process',
    }),
  ],
  controllers: [TaskController],
  providers: [
    TaskService,
    TaskCreateCommandHandler,
    GetTaskQueryHandler,
    TaskCreateEventHandler,
    GetTaskByDayQueryHandler,
    CheckPointCreateCommandHandler,
    CheckPointCreateEventHandler,
    GetResumeByDayQueryHandler,
    CompleteTaskCommandHandler,
    CompleteTaskEventHandler,
    TaskConsumer,
    {
      provide: ITASK_QUERY_REPOSITORY,
      useClass: TaskQueryRepository,
    },
    {
      provide: IRESUME_QUERY_REPOSITORY,
      useClass: ResumeQueryRepository,
    },
    {
      provide: ITASK_COMMAND_REPOSITORY,
      useClass: TaskCommandRepository,
    },
    {
      provide: ICHECK_POINT_COMMAND_REPOSITORY,
      useClass: CheckPointCommandRepository,
    },
  ],
})
export class TaskModule {}
