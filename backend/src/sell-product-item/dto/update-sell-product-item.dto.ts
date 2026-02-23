import { PartialType } from '@nestjs/swagger';
import { CreateSellProductItemDto } from './create-sell-product-item.dto';

export class UpdateSellProductItemDto extends PartialType(CreateSellProductItemDto) {}
