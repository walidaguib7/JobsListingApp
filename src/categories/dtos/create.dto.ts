import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategory {
  @IsNotEmpty()
  @IsString()
  title: string;
}
