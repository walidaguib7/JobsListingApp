import { PartialType } from '@nestjs/mapped-types';
import { SendMessageDto } from './create.dto';

export class UpdateMessageDto extends PartialType(SendMessageDto) {}
