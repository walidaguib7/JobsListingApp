import { PartialType } from '@nestjs/mapped-types';
import { CreateConversation } from './create.dto';

export class UpdateConversation extends PartialType(CreateConversation) {}
