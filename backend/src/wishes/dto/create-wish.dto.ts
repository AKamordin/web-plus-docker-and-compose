import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  public name: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(200)
  public link: string;

  @IsNotEmpty()
  @IsUrl()
  public image: string;

  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false },
    {
      message: 'Число должно быть положительным с округлением до сотых',
    },
  )
  @IsPositive()
  public price: number;

  @IsNotEmpty()
  public description: string;
}
