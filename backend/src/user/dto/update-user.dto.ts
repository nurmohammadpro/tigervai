import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

      @ApiProperty({ description: 'mongoDb', example: 'test@example.com' })
      @IsMongoId()
      id: string
}
