import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TaskCreateEvent } from './event/task-create.event';
import { EventBus } from '@nestjs/cqrs';

@Processor('tasks_to_process')
export class TaskConsumer {
  constructor(private eventBus: EventBus) {}

  @Process()
  async transcode(job: Job<TaskCreateEvent>) {
    const task = job.data;
    this.eventBus.publish(
      new TaskCreateEvent(
        task.id,
        task.title,
        task.description,
        task.isDone,
        task.createdAt,
        task.expiredAt,
      ),
    );
  }
}
