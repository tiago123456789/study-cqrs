import { Injectable } from '@nestjs/common';
import { ITaskCommandRepository } from './itask-command.repository';
import { TaskWriteEntity } from 'src/task/entities/task-write.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckPointWriteEntity } from 'src/task/entities/check-point-write.entity';

@Injectable()
export class TaskCommandRepository implements ITaskCommandRepository {
  constructor(
    @InjectRepository(TaskWriteEntity)
    private readonly repository: Repository<TaskWriteEntity>,
    @InjectRepository(CheckPointWriteEntity)
    private readonly checkPointRepository: Repository<CheckPointWriteEntity>,
  ) {}
  async getTotalCheckPoints(taskId: number): Promise<number> {
    this.repository.createQueryBuilder();
    const [_, total] = await this.checkPointRepository.findAndCountBy({
      task: {
        id: taskId,
      },
    });

    return total;
  }

  async makeComplete(id: number): Promise<void> {
    const task = await this.findOne(id);
    task.setIsDone(true);
    await this.repository.merge(task);
  }

  async findOne(id: number): Promise<TaskWriteEntity> {
    const register = await this.repository.findOne({
      where: {
        id,
      },
    });

    return register;
  }

  async save(register: TaskWriteEntity): Promise<void> {
    await this.repository.save(register);
  }
}
