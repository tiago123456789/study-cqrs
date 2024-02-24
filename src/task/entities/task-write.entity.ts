import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CheckPointWriteEntity } from './check-point-write.entity';

@Entity({ name: 'tasks' })
export class TaskWriteEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 150 })
  private title: string;

  @Column({ length: 255 })
  private description: string;

  @Column({ default: 'true', name: 'is_done' })
  public isDone: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  private createdAt: Date;

  @Column({ name: 'expired_at', type: 'timestamp' })
  private expiredAt: Date;

  @OneToMany(() => CheckPointWriteEntity, (checkPoint) => checkPoint.task)
  public checkPoints: CheckPointWriteEntity[];

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public isIsDone(): boolean {
    return this.isDone;
  }

  public setIsDone(isDone: boolean): void {
    this.isDone = isDone;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public getExpiredAt(): Date {
    return this.expiredAt;
  }

  public setExpiredAt(expiredAt: Date): void {
    this.expiredAt = expiredAt;
  }

  public getCheckPoints(): CheckPointWriteEntity[] {
    return this.checkPoints;
  }

  public setCheckPoints(checkPoint: CheckPointWriteEntity): void {
    this.checkPoints = [checkPoint];
  }
}
