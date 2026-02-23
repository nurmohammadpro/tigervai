import { Module } from '@nestjs/common';
import { UploadServiceService } from './upload-service.service';
import { UploadServiceController } from './upload-service.controller';

@Module({
  controllers: [UploadServiceController],
  providers: [UploadServiceService],
})
export class UploadServiceModule {}
