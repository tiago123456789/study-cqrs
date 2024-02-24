export class CheckPointCreateCommand {
  constructor(
    public readonly taskId: number,
    public readonly startedAt: Date,
    public readonly finishedAt: Date,
  ) {}
}
