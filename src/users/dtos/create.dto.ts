import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Role } from 'utils/enums';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  phone_number: string;
  @IsNotEmpty()
  password: string;
  isVerified: boolean;
  mediaId: number;
  @IsArray()
  role: string[];
}
