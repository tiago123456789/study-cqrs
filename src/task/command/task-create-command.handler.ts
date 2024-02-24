import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TaskCreateCommand } from './task-create.command';
import { TaskCreateEvent } from '../event/task-create.event';
import { TaskWriteEntity } from '../entities/task-write.entity';
import { ITASK_COMMAND_REPOSITORY } from 'src/common/constants/provider';
import { ITaskCommandRepository } from '../repositories/command/itask-command.repository';
import { Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@CommandHandler(TaskCreateCommand)
export class TaskCreateCommandHandler
  implements ICommandHandler<TaskCreateCommand>
{
  constructor(
    private eventBus: EventBus,
    @Inject(ITASK_COMMAND_REPOSITORY)
    private readonly taskRepository: ITaskCommandRepository,
    @InjectQueue('tasks_to_process') private queue: Queue,
  ) {}

  async execute(command: TaskCreateCommand): Promise<void> {
    const taskWrite = new TaskWriteEntity();
    taskWrite.setTitle(command.title);
    taskWrite.setDescription(command.description);
    taskWrite.setIsDone(command.isDone);
    taskWrite.setCreatedAt(command.createdAt);
    taskWrite.setExpiredAt(command.expiredAt);

    await this.taskRepository.save(taskWrite);
    await this.queue.add(
      new TaskCreateEvent(
        taskWrite.getId(),
        command.title,
        command.description,
        command.isDone,
        command.createdAt,
        command.expiredAt,
      ),
      {
        delay: 2 * 1000,
      },
    );
    return;
  }
}
