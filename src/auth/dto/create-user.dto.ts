import {
  IsAlpha,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsArray()
  roles: []
}
