import { Test, TestingModule } from '@nestjs/testing';
import { CategoryBrandService } from './category-brand.service';

describe('CategoryBrandService', () => {
  let service: CategoryBrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryBrandService],
    }).compile();

    service = module.get<CategoryBrandService>(CategoryBrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
