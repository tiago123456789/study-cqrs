export class TaskCreateEvent {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly isDone: boolean,
    public readonly createdAt: Date,
    public readonly expiredAt: Date,
  ) {}
}
