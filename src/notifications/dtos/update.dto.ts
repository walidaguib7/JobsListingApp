import { PartialType } from '@nestjs/mapped-types';
import { CreateNotification } from './create.dto';

export class UpdateNotification extends PartialType(CreateNotification) {}
