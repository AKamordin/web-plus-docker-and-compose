import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    {
      message: 'Число должно быть положительным с округлением до сотых',
    },
  )
  @IsPositive()
  amount: number;
  @IsBoolean()
  @IsOptional()
  hidden: boolean;
  @IsNumber()
  @IsPositive()
  itemId: number;
}
