import { Result } from 'src/base/response/result';
import { UploadFileResponse } from './dto/upload-file.dto';

export abstract class IUploadFileService {
  abstract uploadFile(file: Express.Multer.File): Promise<UploadFileResponse>;
}
