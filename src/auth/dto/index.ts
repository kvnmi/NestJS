import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegDto {
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
