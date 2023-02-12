import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;
  @IsOptional()
  @MaxLength(200)
  about: string;
  @IsOptional()
  @IsUrl()
  avatar: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Length(2)
  password: string;
}
