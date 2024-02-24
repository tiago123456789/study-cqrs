import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CheckPointCreateCommand } from './check-point-create.command';
import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { CheckPointWriteEntity } from '../entities/check-point-write.entity';
import * as dayjs from 'dayjs';
import { CheckPointCreateEvent } from '../event/check-point-create.event';
import {
  ICHECK_POINT_COMMAND_REPOSITORY,
  ITASK_COMMAND_REPOSITORY,
} from 'src/common/constants/provider';
import { ICheckPointCommandRepository } from '../repositories/command/icheck-point-command.repository';
import { ITaskCommandRepository } from '../repositories/command/itask-command.repository';

@CommandHandler(CheckPointCreateCommand)
export class CheckPointCreateCommandHandler
  implements ICommandHandler<CheckPointCreateCommand>
{
  constructor(
    private eventBus: EventBus,
    @Inject(ITASK_COMMAND_REPOSITORY)
    private readonly taskRepository: ITaskCommandRepository,
    @Inject(ICHECK_POINT_COMMAND_REPOSITORY)
    private readonly checkPointRepository: ICheckPointCommandRepository,
  ) {}

  async execute(command: CheckPointCreateCommand): Promise<void> {
    const task = await this.taskRepository.findOne(command.taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const isStartedFinishedSameDay =
      dayjs(command.startedAt).format('YYYY-MM-DD') !==
      dayjs(command.finishedAt).format('YYYY-MM-DD');

    if (isStartedFinishedSameDay) {
      throw new HttpException(
        'The startedAt and finishedAt needs stay same day',
        409,
      );
    }

    const checkPoint = new CheckPointWriteEntity();
    checkPoint.setTask(task);
    checkPoint.setStartedAt(command.startedAt);
    checkPoint.setFinishedAt(command.finishedAt);

    await this.checkPointRepository.save(checkPoint);

    this.eventBus.publish(
      new CheckPointCreateEvent(
        command.taskId,
        command.startedAt,
        command.finishedAt,
      ),
    );
    return;
  }
}
