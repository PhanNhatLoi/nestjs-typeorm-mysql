import {
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IUploadFileService } from '@modules/upload-file/services/upload-file.service.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    FilesInterceptor('file', 5, {
      storage: multerConfig('/media').storage,
      limits: multerOptions({ fileSize: 25 }).limits,
    }),
  )
  async uploadMedia(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return await Promise.all(
      files.map((file) => this._fileService.uploadFile(file)),
    );
  }

  @Post('private/image') // Endpoint for uploading files
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      storage: multerConfig('/images/private').storage,
      fileFilter: multerOptions().fileFilter,
      limits: multerOptions({ fileSize: 5 }).limits,
    }),
  )
  async uploadFilePrivate(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/' })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return await Promise.all(
      files.map((file) => this._fileService.uploadFile(file)),
    );
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
  async getFilePublic(@Param('filename') filename: string, @Res() res) {
    const filePath = join(process.cwd(), 'files/media', filename);
    const fileExtension = filename.split('-').pop();
    const contentType = fileExtension.replace('.', '/');
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
    return filePath;
  }
}
