import { TaskReadEntity } from 'src/task/entities/task-read.entity';

export interface ITaskQueryRepository {
  saveBatch(registers: Array<TaskReadEntity>): Promise<void>;
  save(register: TaskReadEntity): Promise<void>;
  addCheckPointInDay(day: string, checkPoint: TaskReadEntity): Promise<void>;
  getPaginateInDay(
    day: string,
    offset: number,
    limit: number,
  ): Promise<TaskReadEntity[]>;

  makeComplete(
    id: number,
    startedAt: string,
    finishedAt: string,
  ): Promise<void>;
  getAll(): Promise<TaskReadEntity[]>;
}
