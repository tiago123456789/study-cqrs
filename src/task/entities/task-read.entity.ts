export class TaskReadEntity {
  private id: number;
  private title: string;
  private description: string;
  private isDone = false;
  private createdAt: Date;
  private expiredAt: Date;
  private day: Date;
  private startedAt: Date;
  private finishedAt: Date;

  getId(): number {
    return this.id;
  }

  setId(id): void {
    this.id = id;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getIsDone(): boolean {
    return this.isDone;
  }

  setIsDone(isDone: boolean): void {
    this.isDone = isDone;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }

  setExpiredAt(expiredAt: Date): void {
    this.expiredAt = expiredAt;
  }

  getDay(): Date {
    return this.day;
  }

  setDay(day: Date): void {
    this.day = day;
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
}
