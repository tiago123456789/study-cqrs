import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ITASK_COMMAND_REPOSITORY } from 'src/common/constants/provider';
import { ITaskCommandRepository } from '../repositories/command/itask-command.repository';
import { HttpException, Inject, NotFoundException } from '@nestjs/common';
import { CompleteTaskCommand } from './compĺete-task.command';
import { CompleteTaskEvent } from '../event/complete-task.event';
import * as dayjs from 'dayjs';

@CommandHandler(CompleteTaskCommand)
export class CompleteTaskCommandHandler
  implements ICommandHandler<CompleteTaskCommand>
{
  constructor(
    private eventBus: EventBus,
    @Inject(ITASK_COMMAND_REPOSITORY)
    private readonly taskRepository: ITaskCommandRepository,
  ) {}

  async execute(command: CompleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.findOne(command.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const createdAt = dayjs(task.getCreatedAt())
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    const expiredAt = dayjs(task.getExpiredAt())
      .add(1, 'day')
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);

    const totalDays = expiredAt.diff(createdAt, 'day');
    const totalCheckPoints = await this.taskRepository.getTotalCheckPoints(
      command.taskId,
    );

    const hasCheckPointAllDays = totalCheckPoints === totalDays;
    if (!hasCheckPointAllDays) {
      const totalDaysMissedCheckPoints = totalDays - totalCheckPoints;
      throw new HttpException(
        `You missed ${totalDaysMissedCheckPoints} days without check points`,
        409,
      );
    }

    await this.taskRepository.makeComplete(command.taskId);
    this.eventBus.publish(
      new CompleteTaskEvent(
        command.taskId,
        task.getCreatedAt(),
        task.getExpiredAt(),
      ),
    );
    return;
  }
}
