import { CheckPointWriteEntity } from 'src/task/entities/check-point-write.entity';

export interface ICheckPointCommandRepository {
  save(register: CheckPointWriteEntity): Promise<void>;
}
