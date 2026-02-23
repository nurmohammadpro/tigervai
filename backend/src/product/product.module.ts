import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MeilisearchModule } from 'src/meilisearch/meilisearch.module';
import { SellProductItemModule } from 'src/sell-product-item/sell-product-item.module';

@Module({
  imports: [MeilisearchModule,SellProductItemModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
