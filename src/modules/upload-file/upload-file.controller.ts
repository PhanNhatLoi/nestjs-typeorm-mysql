import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IUploadFileService } from '@modules/upload-file/services/upload-file.service.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { multerConfig, multerOptions } from 'src/configs/configuration.config';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';

@Controller('file')
@ApiTags('Upload file')
export class UploadFileController {
  constructor(private readonly _fileService: IUploadFileService) {}

  @Post('upload/media')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerConfig('/media').storage,
      limits: multerOptions({ fileSize: 25 }).limits,
    }),
  )
  async uploadMedia(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this._fileService.uploadFile(file);
  }

  @Post('private/image') // Endpoint for uploading files
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerConfig('/images/private').storage,
      fileFilter: multerOptions().fileFilter,
      limits: multerOptions({ fileSize: 5 }).limits,
    }),
  )
  async uploadFilePrivate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this._fileService.uploadFile(file);
  }

  @Get('image/:filename')
  @UseGuards(JwtAccessTokenGuard)
  async getFile(@Param('filename') filename: string, @Res() res) {
    const filePath = join(process.cwd(), 'files/images/private', filename);
    const fileExtension = filename.split('.').pop();
    const contentType = fileExtension.replace('.', '/');
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
    return filePath;
  }
  @Get('media/:filename')
  @UseGuards(JwtAccessTokenGuard)
  async getFilePublic(@Param('filename') filename: string, @Res() res) {
    const filePath = join(process.cwd(), 'files/media', filename);
    const fileExtension = filename.split('-').pop();
    const contentType = fileExtension.replace('.', '/');
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
    return filePath;
  }
}
