import { PartialType } from '@nestjs/swagger';
import { CreateMeilisearchDto } from './create-meilisearch.dto';

export class UpdateMeilisearchDto extends PartialType(CreateMeilisearchDto) {
    
    id?:string
}
