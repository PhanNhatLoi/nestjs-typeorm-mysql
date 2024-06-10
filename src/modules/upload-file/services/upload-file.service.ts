import { BadRequestException, Injectable } from '@nestjs/common';
import { IUploadFileService } from './upload-file.service.interface';
import { UploadFileResponse } from './dto/upload-file.dto';
import { ERRORS_DICTIONARY } from 'src/shared/constants/error-dictionary.constaint';

@Injectable()
export class UploadFileService implements IUploadFileService {
  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponse> {
    if (!file) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.VALIDATION_ERROR,
        details: 'File is not provided',
      });
    }
    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
