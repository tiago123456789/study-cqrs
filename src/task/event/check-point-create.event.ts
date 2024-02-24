export class CheckPointCreateEvent {
  constructor(
    public readonly taskId: number,
    public readonly startedAt: Date,
    public readonly finishedAt: Date,
  ) {}
}
