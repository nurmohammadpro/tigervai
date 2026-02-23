import { Test, TestingModule } from '@nestjs/testing';
import { SellProductItemService } from './sell-product-item.service';

describe('SellProductItemService', () => {
  let service: SellProductItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellProductItemService],
    }).compile();

    service = module.get<SellProductItemService>(SellProductItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
