import { Injectable } from '@nestjs/common';
import { ICheckPointCommandRepository } from './icheck-point-command.repository';
import { CheckPointWriteEntity } from 'src/task/entities/check-point-write.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CheckPointCommandRepository
  implements ICheckPointCommandRepository
{
  constructor(
    @InjectRepository(CheckPointWriteEntity)
    private readonly checkPointRepository: Repository<CheckPointWriteEntity>,
  ) {}

  async save(register: CheckPointWriteEntity): Promise<void> {
    await this.checkPointRepository.save(register);
  }
}
