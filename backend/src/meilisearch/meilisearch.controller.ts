import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MeilisearchService } from './meilisearch.service';
import { CreateMeilisearchDto, SearchProductsDto } from './dto/create-meilisearch.dto';
import { UpdateMeilisearchDto } from './dto/update-meilisearch.dto';

@Controller('meilisearch')
export class MeilisearchController {
  constructor(private readonly meilisearchService: MeilisearchService) {}

  @Get()
  findAll() {
    return this.meilisearchService.findAll();
  }
  @Get('get-all-product')
  getAllProduct(@Query() query:SearchProductsDto) {
    return this.meilisearchService.search(query);
  }

  
}
