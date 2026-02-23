import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadServiceService } from './upload-service.service';

import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Upload Service')
@Controller('upload-service')
export class UploadServiceController {
  constructor(private readonly uploadServiceService: UploadServiceService) {}

  // ✅ SINGLE UPLOAD
  @Post('single')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a single file',
    schema: {
      type: 'object',
      properties: {
        
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
   
  ) {
    return this.uploadServiceService.uploadSingleFile(file)
  }

  // ✅ MULTIPLE UPLOAD
  @Post('multiple')
  @ApiOperation({ summary: 'Upload up to 5 files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple files',
    schema: {
      type: 'object',
      properties: {
      
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
   
  ) {
    return this.uploadServiceService.uploadMultipleFiles(files);
  }

  // ✅ DELETE FILE
  @Delete(':key')
  @ApiOperation({ summary: 'Delete uploaded file by key' })
  @ApiParam({
    name: 'key',
    example: 'c94f2a4c-8d4b-4b3d-8a75-d2dfb7d61fa3-1730622011',
    description: 'File UUID key returned during upload',
  })
  async deleteFile(@Param('key') key: string) {
    return this.uploadServiceService.deleteFile(key);
  }
}
