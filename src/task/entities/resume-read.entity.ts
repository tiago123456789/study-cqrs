export class ResumeReadEntity {
  private total: number;
  private totalStarted: number;
  private totalFinished: number;
  private day: Date;

  public getTotal(): number {
    return this.total;
  }

  public setTotal(total: number): void {
    this.total = total;
  }

  public getTotalStarted(): number {
    return this.totalStarted;
  }

  public setTotalStarted(totalStarted: number): void {
    this.totalStarted = totalStarted;
  }

  public getTotalFinished(): number {
    return this.totalFinished;
  }

  public setTotalFinished(totalFinished: number): void {
    this.totalFinished = totalFinished;
  }

  public getDay(): Date {
    return this.day;
  }

  public setDay(day: Date): void {
    this.day = day;
  }
}
