import { PartialType } from '@nestjs/mapped-types';
import { CreateApplication } from './create.dto';

export class UpdateApplication extends PartialType(CreateApplication) {}
