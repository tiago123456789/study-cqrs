import { ResumeReadEntity } from 'src/task/entities/resume-read.entity';

export interface IResumeQueryRepository {
  INDEX: string;
  createIndexIfNotExist(index): Promise<void>;
  isFirstRegisterInDay(day: string): Promise<boolean>;
  existRegisterInStartAndEndDate(
    startDate: string,
    endDate: string,
  ): Promise<{ [key: string]: boolean }>;
  saveBatch(registers: Array<ResumeReadEntity>): Promise<void>;

  save(register: ResumeReadEntity): Promise<void>;
  updateTotalByDay(day: string, total: number): Promise<void>;
  incrementTotalByDays(days: Array<string>): Promise<void>;
  incrementTotalStartedAndFinishedByDay(day: string): Promise<void>;
  getByDay(day: string): Promise<ResumeReadEntity>;
}
