import { Module } from '@nestjs/common';
import { SellProductItemService } from './sell-product-item.service';
import { SellProductItemController } from './sell-product-item.controller';
import { MeilisearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [MeilisearchModule],
  controllers: [SellProductItemController],
  providers: [SellProductItemService],
  exports: [SellProductItemService],
})
export class SellProductItemModule {}
