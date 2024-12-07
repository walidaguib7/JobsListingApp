import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';
import { Category } from 'src/categories/category.entity';
import { JobType } from 'utils/enums';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsEnum(JobType)
  type: JobType;
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsString()
  @IsNotEmpty()
  salary: string;
  @IsNumber()
  employerId: number;

  categories: Category[];
}
