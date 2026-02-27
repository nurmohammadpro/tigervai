import { Module } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';
import { MeilisearchController } from './meilisearch.controller';
import { TenantConnectionModule } from 'lib/connection/mongooseConnection.service';

@Module({
  imports: [TenantConnectionModule],
  controllers: [MeilisearchController],
  providers: [MeilisearchService],
  exports: [MeilisearchService],
})
export class MeilisearchModule {}
