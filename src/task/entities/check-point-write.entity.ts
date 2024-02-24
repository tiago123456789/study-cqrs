import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskWriteEntity } from './task-write.entity';

@Entity({ name: 'check_points' })
export class CheckPointWriteEntity {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ name: 'started_at', type: 'timestamp' })
  private startedAt: Date;

  @Column({ name: 'finished_at', type: 'timestamp' })
  private finishedAt: Date;

  @ManyToOne(() => TaskWriteEntity, (task) => task.checkPoints)
  public task: TaskWriteEntity;

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public setStartedAt(startedAt: Date): void {
    this.startedAt = startedAt;
  }

  public getFinishedAt(): Date {
    return this.finishedAt;
  }

  public setFinishedAt(finishedAt: Date): void {
    this.finishedAt = finishedAt;
  }

  public getTask(): TaskWriteEntity {
    return this.task;
  }

  public setTask(task: TaskWriteEntity): void {
    this.task = task;
  }
}
