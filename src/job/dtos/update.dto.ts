import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
