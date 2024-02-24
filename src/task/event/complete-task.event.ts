export class CompleteTaskEvent {
  constructor(
    public readonly taskId: number,
    public readonly createdAt: Date,
    public readonly expiredAt: Date,
  ) {}
}
