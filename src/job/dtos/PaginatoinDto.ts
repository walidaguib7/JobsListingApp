// pagination.dto.ts
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobType } from 'utils/enums';
import { Category } from 'src/categories/category.entity';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => String)
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsString()
  @Type(() => String)
  location?: string;

  @IsOptional()
  categories: number[];
}
