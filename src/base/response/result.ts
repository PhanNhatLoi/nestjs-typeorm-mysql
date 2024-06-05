export class Result<TResponse> {
  success = true;

  constructor(
    readonly response: TResponse,
    readonly message: string | null,
    readonly error: string | null,
    readonly status: number,
  ) {
    if (error) this.success = false;
  }
}
