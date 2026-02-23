import { Test, TestingModule } from '@nestjs/testing';
import { CategoryBrandController } from './category-brand.controller';
import { CategoryBrandService } from './category-brand.service';

describe('CategoryBrandController', () => {
  let controller: CategoryBrandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryBrandController],
      providers: [CategoryBrandService],
    }).compile();

    controller = module.get<CategoryBrandController>(CategoryBrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
