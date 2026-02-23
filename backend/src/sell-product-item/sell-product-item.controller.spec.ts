import { Test, TestingModule } from '@nestjs/testing';
import { SellProductItemController } from './sell-product-item.controller';
import { SellProductItemService } from './sell-product-item.service';

describe('SellProductItemController', () => {
  let controller: SellProductItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellProductItemController],
      providers: [SellProductItemService],
    }).compile();

    controller = module.get<SellProductItemController>(SellProductItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
