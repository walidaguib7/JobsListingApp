import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  isString,
  IsString,
} from 'class-validator';
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
}
