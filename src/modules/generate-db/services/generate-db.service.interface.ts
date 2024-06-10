import { Result } from 'src/base/response/result';

export abstract class IGenerateDbService {
  abstract generate(): Promise<Result<String>>;
}
