import { TaskWriteEntity } from 'src/task/entities/task-write.entity';

export interface ITaskCommandRepository {
  save(register: TaskWriteEntity): Promise<void>;
  makeComplete(id: number): Promise<void>;
  findOne(id: number): Promise<TaskWriteEntity>;
  getTotalCheckPoints(taskId: number): Promise<number>;
}
