import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsOptional } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  public copied?: number;

  @IsOptional()
  public raised?: number;
}
