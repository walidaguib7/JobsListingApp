import { PartialType } from '@nestjs/mapped-types';
import { CreateReview } from './create.dto';

export class UpdateReview extends PartialType(CreateReview) {}
