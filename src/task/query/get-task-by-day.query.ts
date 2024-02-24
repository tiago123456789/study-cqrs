export class GetTaskByDayQuery {
  constructor(
    public readonly day: string,
    public readonly offset: number,
    public readonly limit: number,
  ) {}
}
