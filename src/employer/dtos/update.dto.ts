import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployerDto } from './create.dto';

export class UpdateEmployerDto extends PartialType(CreateEmployerDto) {}
