import { ResponseType } from 'src/base/response/response-type';
import { Result } from 'src/base/response/result';

export class Results {
  static success<TResponse>(data: TResponse, message: string | null = null) {
    return new Result<TResponse>(data, message, null, ResponseType.Success);
  }
  static notFound<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.NotFound,
    );
  }
  static validation<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.Validation,
    );
  }
  static unauthorized<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.Unauthorized,
    );
  }
  static forbidden<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.Forbidden,
    );
  }
  static badRequest<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.BadRequest,
    );
  }
  static internalServer<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.InternalServer,
    );
  }
  static alreadyExist<TResponse>(
    message: string | null = null,
    error: string | null = null,
    data: TResponse | null = null,
  ) {
    return new Result<any>(
      data,
      message,
      error || message,
      ResponseType.Conflict,
    );
  }
  static error<TResponse>(
    message: string | null = null,
    error: string | null = null,
    status = ResponseType.InternalServer,
    data: TResponse | null = null,
  ) {
    return new Result<any>(data, message, error || message, status);
  }
}
